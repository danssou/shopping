'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema/user'
import { products } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// Cart item type matching the schema
type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
  size: z.string().optional(),
  color: z.string().optional(),
})

const updateQuantitySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative').max(99, 'Quantity cannot exceed 99'),
})

/**
 * Server action to add item to cart
 */
export async function addToCartAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to add items to cart' }
  }

  try {
    const productId = formData.get('productId') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const size = formData.get('size') as string
    const color = formData.get('color') as string

    // Validate input
    const validation = addToCartSchema.safeParse({ productId, quantity, size, color })
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message }
    }

    // Get product details
    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1)
    
    if (!product) {
      return { success: false, message: 'Product not found' }
    }

    // Check stock availability
    const stock = product.stock || 0
    if (stock < quantity) {
      return { success: false, message: 'Insufficient stock available' }
    }

    // Get current user's cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentCart = (currentUser.cart as CartItem[]) || []

    // Check if item already exists in cart (same product, size, color)
    const existingItemIndex = currentCart.findIndex(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    )

    let updatedCart: CartItem[]

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const newQuantity = currentCart[existingItemIndex].quantity + quantity
      
      // Check total quantity doesn't exceed stock
      if (newQuantity > stock) {
        return { success: false, message: 'Total quantity would exceed available stock' }
      }

      updatedCart = currentCart.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: newQuantity }
          : item
      )
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        productId,
        name: product.name,
        price: parseFloat(product.price),
        quantity,
        imageUrl: product.imageUrl || undefined,
        size: size || undefined,
        color: color || undefined,
      }

      updatedCart = [...currentCart, newItem]
    }

    // Update user's cart in database
    await db.update(user)
      .set({
        cart: updatedCart,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/') // Update cart icon/count

    return { 
      success: true, 
      message: 'Item added to cart successfully',
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, message: 'Failed to add item to cart' }
  }
}

/**
 * Server action to remove item from cart
 */
export async function removeFromCartAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const itemId = formData.get('itemId') as string

    if (!itemId) {
      return { success: false, message: 'Item ID is required' }
    }

    // Get current user's cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentCart = (currentUser.cart as CartItem[]) || []

    // Remove item from cart
    const updatedCart = currentCart.filter(item => item.id !== itemId)

    // Update user's cart in database
    await db.update(user)
      .set({
        cart: updatedCart,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/') // Update cart icon/count

    return { 
      success: true, 
      message: 'Item removed from cart',
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
    }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, message: 'Failed to remove item from cart' }
  }
}

/**
 * Server action to update item quantity in cart
 */
export async function updateQuantityAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const itemId = formData.get('itemId') as string
    const quantity = parseInt(formData.get('quantity') as string)

    if (!itemId) {
      return { success: false, message: 'Item ID is required' }
    }

    // Validate quantity
    const validation = updateQuantitySchema.safeParse({ productId: 'dummy', quantity })
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message }
    }

    // Get current user's cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentCart = (currentUser.cart as CartItem[]) || []

    // Find the item to update
    const itemIndex = currentCart.findIndex(item => item.id === itemId)
    
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found in cart' }
    }

    const cartItem = currentCart[itemIndex]

    // If quantity is 0, remove the item
    if (quantity === 0) {
      const updatedCart = currentCart.filter(item => item.id !== itemId)
      
      await db.update(user)
        .set({
          cart: updatedCart,
          updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id))

      revalidatePath('/cart')
      revalidatePath('/')

      return { 
        success: true, 
        message: 'Item removed from cart',
        cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      }
    }

    // Check stock availability for the new quantity
    const [product] = await db.select().from(products).where(eq(products.id, cartItem.productId)).limit(1)
    
    if (!product) {
      return { success: false, message: 'Product not found' }
    }

    const stock = product.stock || 0
    if (quantity > stock) {
      return { success: false, message: 'Insufficient stock available' }
    }

    // Update quantity
    const updatedCart = currentCart.map(item => 
      item.id === itemId 
        ? { ...item, quantity }
        : item
    )

    await db.update(user)
      .set({
        cart: updatedCart,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Quantity updated successfully',
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
    }
  } catch (error) {
    console.error('Update quantity error:', error)
    return { success: false, message: 'Failed to update quantity' }
  }
}

/**
 * Server action to clear entire cart
 */
export async function clearCartAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    await db.update(user)
      .set({
        cart: [],
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Cart cleared successfully',
      cartCount: 0
    }
  } catch (error) {
    console.error('Clear cart error:', error)
    return { success: false, message: 'Failed to clear cart' }
  }
}

/**
 * Server action to apply coupon/discount code
 */
export async function applyCouponAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const couponCode = (formData.get('couponCode') as string)?.toUpperCase().trim()

    if (!couponCode) {
      return { success: false, message: 'Coupon code is required' }
    }

    // Simple coupon validation (in a real app, you'd have a coupons table)
    const validCoupons = {
      'SAVE10': { discount: 0.1, type: 'percentage' as const, description: '10% off' },
      'SAVE20': { discount: 0.2, type: 'percentage' as const, description: '20% off' },
      'FREESHIP': { discount: 0, type: 'free_shipping' as const, description: 'Free shipping' },
      'NEWUSER': { discount: 0.15, type: 'percentage' as const, description: '15% off for new users' },
    }

    const coupon = validCoupons[couponCode as keyof typeof validCoupons]

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' }
    }

    // Get current user's cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentCart = (currentUser.cart as CartItem[]) || []

    if (currentCart.length === 0) {
      return { success: false, message: 'Cart is empty' }
    }

    // Store coupon in user preferences
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

    const currentPreferences = (currentUser.preferences as UserPreferences) || {}
    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      activeCoupon: {
        code: couponCode,
        ...coupon,
        appliedAt: new Date().toISOString(),
      }
    }

    await db.update(user)
      .set({
        preferences: updatedPreferences,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/checkout')

    return { 
      success: true, 
      message: `Coupon applied: ${coupon.description}`,
      coupon: {
        code: couponCode,
        ...coupon,
      }
    }
  } catch (error) {
    console.error('Apply coupon error:', error)
    return { success: false, message: 'Failed to apply coupon' }
  }
}

/**
 * Server action to remove applied coupon
 */
export async function removeCouponAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    // Get current user preferences
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

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

    const currentPreferences = (currentUser.preferences as UserPreferences) || {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { activeCoupon, ...restPreferences } = currentPreferences

    await db.update(user)
      .set({
        preferences: restPreferences,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/cart')
    revalidatePath('/checkout')

    return { 
      success: true, 
      message: 'Coupon removed successfully'
    }
  } catch (error) {
    console.error('Remove coupon error:', error)
    return { success: false, message: 'Failed to remove coupon' }
  }
}