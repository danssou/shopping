'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema/user'
import { orders, products } from '@/lib/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// Order types
type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  name?: string;
  phone?: string;
}

type OrderCoupon = {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'free_shipping';
  description: string;
}

// Validation schemas
const createOrderSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
    name: z.string().optional(),
    phone: z.string().optional(),
  }),
})

/**
 * Server action to create a new order from user's cart
 */
export async function createOrderAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to place an order' }
  }

  try {
    const paymentMethod = formData.get('paymentMethod') as string
    const shippingAddressStr = formData.get('shippingAddress') as string
    
    if (!shippingAddressStr) {
      return { success: false, message: 'Shipping address is required' }
    }

    const shippingAddress = JSON.parse(shippingAddressStr) as ShippingAddress

    // Validate input
    const validation = createOrderSchema.safeParse({
      paymentMethod,
      shippingAddress,
    })

    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message }
    }

    // Get current user's cart and preferences
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const cart = (currentUser.cart as OrderItem[]) || []

    if (cart.length === 0) {
      return { success: false, message: 'Cart is empty' }
    }

    // Calculate order totals
    let subtotal = 0
    const orderItems: OrderItem[] = []

    // Validate cart items and calculate subtotal
    for (const cartItem of cart) {
      // Get fresh product data to validate price and stock
      const [product] = await db.select().from(products).where(eq(products.id, cartItem.productId)).limit(1)
      
      if (!product) {
        return { success: false, message: `Product ${cartItem.name} is no longer available` }
      }

      // Check stock
      const stock = product.stock || 0
      if (stock < cartItem.quantity) {
        return { success: false, message: `Insufficient stock for ${cartItem.name}` }
      }

      // Use current price from database
      const currentPrice = parseFloat(product.price)
      const itemTotal = currentPrice * cartItem.quantity
      subtotal += itemTotal

      orderItems.push({
        ...cartItem,
        price: currentPrice, // Use current price
      })
    }

    // Get applied coupon from user preferences
    type UserPreferences = {
      theme?: 'light' | 'dark' | 'auto';
      notifications?: {
        email: boolean;
        push: boolean;
        marketing: boolean;
      };
      privacy?: {
        profileVisibility: 'public' | 'private';
        showEmail: boolean;
      };
      activeCoupon?: {
        code: string;
        discount: number;
        type: 'percentage' | 'fixed' | 'free_shipping';
        description: string;
        appliedAt: string;
      };
    }

    const preferences = (currentUser.preferences as UserPreferences) || {}
    const appliedCoupon = preferences.activeCoupon

    // Calculate discount
    let discount = 0
    let coupon: OrderCoupon | undefined

    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = subtotal * appliedCoupon.discount
      } else if (appliedCoupon.type === 'fixed') {
        discount = Math.min(appliedCoupon.discount, subtotal)
      }
      
      coupon = {
        code: appliedCoupon.code,
        discount: appliedCoupon.discount,
        type: appliedCoupon.type,
        description: appliedCoupon.description,
      }
    }

    // Calculate shipping (simple logic - free shipping over $100 or with coupon)
    let shipping = 0
    if (appliedCoupon?.type !== 'free_shipping' && (subtotal - discount) < 100) {
      shipping = 9.99
    }

    // Calculate tax (8.5% for example)
    const tax = (subtotal - discount) * 0.085

    const total = subtotal - discount + shipping + tax

    // Create order
    const [newOrder] = await db.insert(orders).values({
      userId: session.user.id,
      status: 'pending',
      total: total.toString(),
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      shipping: shipping.toString(),
      discount: discount.toString(),
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      coupon,
    }).returning()

    // Update product stock
    for (const item of orderItems) {
      await db.update(products)
        .set({
          stock: sql`stock - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId))
    }

    // Clear user's cart and remove applied coupon
    const updatedPreferences = { ...preferences }
    delete updatedPreferences.activeCoupon

    await db.update(user)
      .set({
        cart: [],
        preferences: updatedPreferences,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/orders')
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Order placed successfully',
      orderId: newOrder.id,
      orderNumber: newOrder.id.slice(-8).toUpperCase(),
      total
    }
  } catch (error) {
    console.error('Create order error:', error)
    return { success: false, message: 'Failed to create order' }
  }
}

/**
 * Server action to update order status (admin function)
 */
export async function updateOrderStatusAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const orderId = formData.get('orderId') as string
    const status = formData.get('status') as string
    const trackingNumber = formData.get('trackingNumber') as string
    const notes = formData.get('notes') as string

    if (!orderId || !status) {
      return { success: false, message: 'Order ID and status are required' }
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return { success: false, message: 'Invalid order status' }
    }

    // Check if order exists
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    
    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    // Update order
    await db.update(orders)
      .set({
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        notes: notes || order.notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    revalidatePath('/orders')
    revalidatePath('/admin/orders')

    return { 
      success: true, 
      message: `Order status updated to ${status}` 
    }
  } catch (error) {
    console.error('Update order status error:', error)
    return { success: false, message: 'Failed to update order status' }
  }
}

/**
 * Server action to cancel an order
 */
export async function cancelOrderAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const orderId = formData.get('orderId') as string
    const reason = formData.get('reason') as string

    if (!orderId) {
      return { success: false, message: 'Order ID is required' }
    }

    // Get order and verify ownership
    const [order] = await db.select().from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, session.user.id)
      ))
      .limit(1)
    
    if (!order) {
      return { success: false, message: 'Order not found or access denied' }
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed']
    if (!cancellableStatuses.includes(order.status)) {
      return { success: false, message: 'Order cannot be cancelled at this stage' }
    }

    // Restore product stock
    const orderItems = order.items as OrderItem[]
    for (const item of orderItems) {
      await db.update(products)
        .set({
          stock: sql`stock + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId))
    }

    // Update order status
    await db.update(orders)
      .set({
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by customer',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    revalidatePath('/orders')

    return { 
      success: true, 
      message: 'Order cancelled successfully' 
    }
  } catch (error) {
    console.error('Cancel order error:', error)
    return { success: false, message: 'Failed to cancel order' }
  }
}

/**
 * Server action to get user's order history
 */
export async function getOrderHistoryAction(page = 1, limit = 10) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized', orders: [] }
  }

  try {
    const offset = (page - 1) * limit

    // Get user's orders
    const userOrders = await db.select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    // Transform orders for frontend
    const orderHistory = userOrders.map(order => ({
      id: order.id,
      orderNumber: order.id.slice(-8).toUpperCase(),
      status: order.status,
      total: parseFloat(order.total),
      itemCount: (order.items as OrderItem[]).reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt,
      trackingNumber: order.trackingNumber,
    }))

    return { 
      success: true, 
      orders: orderHistory,
      page,
      hasMore: userOrders.length === limit
    }
  } catch (error) {
    console.error('Get order history error:', error)
    return { success: false, message: 'Failed to get order history', orders: [] }
  }
}

/**
 * Server action to get order details
 */
export async function getOrderDetailsAction(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized', order: null }
  }

  try {
    // Get order and verify ownership
    const [order] = await db.select()
      .from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, session.user.id)
      ))
      .limit(1)
    
    if (!order) {
      return { success: false, message: 'Order not found', order: null }
    }

    // Transform order for frontend
    const orderDetails = {
      id: order.id,
      orderNumber: order.id.slice(-8).toUpperCase(),
      status: order.status,
      total: parseFloat(order.total),
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax || '0'),
      shipping: parseFloat(order.shipping || '0'),
      discount: parseFloat(order.discount || '0'),
      items: order.items as OrderItem[],
      shippingAddress: order.shippingAddress as ShippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      coupon: order.coupon as OrderCoupon | null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return { 
      success: true, 
      order: orderDetails 
    }
  } catch (error) {
    console.error('Get order details error:', error)
    return { success: false, message: 'Failed to get order details', order: null }
  }
}

/**
 * Server action to reorder (add order items back to cart)
 */
export async function reorderAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to reorder' }
  }

  try {
    const orderId = formData.get('orderId') as string

    if (!orderId) {
      return { success: false, message: 'Order ID is required' }
    }

    // Get order and verify ownership
    const [order] = await db.select()
      .from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, session.user.id)
      ))
      .limit(1)
    
    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    // Get current user's cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentCart = (currentUser.cart as OrderItem[]) || []
    const orderItems = order.items as OrderItem[]

    // Add order items to cart (checking stock and avoiding duplicates)
    const updatedCart = [...currentCart]
    const failedItems: string[] = []

    for (const orderItem of orderItems) {
      try {
        // Check if product still exists and has stock
        const [product] = await db.select().from(products).where(eq(products.id, orderItem.productId)).limit(1)
        
        if (!product) {
          failedItems.push(orderItem.name)
          continue
        }

        const stock = product.stock || 0
        if (stock < orderItem.quantity) {
          failedItems.push(orderItem.name)
          continue
        }

        // Check if item already exists in cart
        const existingItemIndex = updatedCart.findIndex(item => 
          item.productId === orderItem.productId && 
          item.size === orderItem.size && 
          item.color === orderItem.color
        )

        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          const newQuantity = updatedCart[existingItemIndex].quantity + orderItem.quantity
          
          if (newQuantity > stock) {
            failedItems.push(orderItem.name)
            continue
          }

          updatedCart[existingItemIndex].quantity = newQuantity
        } else {
          // Add new item to cart with current price
          const newCartItem: OrderItem = {
            id: crypto.randomUUID(),
            productId: orderItem.productId,
            name: orderItem.name,
            price: parseFloat(product.price), // Use current price
            quantity: orderItem.quantity,
            imageUrl: orderItem.imageUrl,
            size: orderItem.size,
            color: orderItem.color,
          }

          updatedCart.push(newCartItem)
        }
      } catch (error) {
        console.error(`Error processing order item ${orderItem.name}:`, error)
        failedItems.push(orderItem.name)
      }
    }

    // Update cart
    await db.update(user)
      .set({
        cart: updatedCart,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/')

    const successCount = orderItems.length - failedItems.length
    let message = ''

    if (failedItems.length === 0) {
      message = 'All items added to cart successfully'
    } else if (successCount === 0) {
      message = 'Failed to add any items to cart'
    } else {
      message = `${successCount} items added to cart. ${failedItems.length} items failed (out of stock or not found)`
    }

    return { 
      success: successCount > 0, 
      message,
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      failedItems
    }
  } catch (error) {
    console.error('Reorder error:', error)
    return { success: false, message: 'Failed to reorder' }
  }
}