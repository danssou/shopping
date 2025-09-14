'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema/user'
import { products } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// Wishlist item type matching the schema
type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

// Cart item type for move to cart functionality
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

/**
 * Server action to get user's wishlist
 */
export async function getWishlistAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to view wishlist', wishlist: [] }
  }

  try {
    // Get current user's wishlist
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found', wishlist: [] }
    }

    const wishlist = (currentUser.wishlist as WishlistItem[]) || []

    return { 
      success: true, 
      message: 'Wishlist retrieved successfully',
      wishlist,
      wishlistCount: wishlist.length
    }
  } catch (error) {
    console.error('Get wishlist error:', error)
    return { success: false, message: 'Failed to retrieve wishlist', wishlist: [] }
  }
}

/**
 * Server action to add item to wishlist
 */
export async function addToWishlistAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to add items to wishlist' }
  }

  try {
    const productId = formData.get('productId') as string

    if (!productId) {
      return { success: false, message: 'Product ID is required' }
    }

    // Get product details
    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1)
    
    if (!product) {
      return { success: false, message: 'Product not found' }
    }

    // Get current user's wishlist
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentWishlist = (currentUser.wishlist as WishlistItem[]) || []

    // Check if item already exists in wishlist
    const existingItem = currentWishlist.find(item => item.productId === productId)

    if (existingItem) {
      return { success: false, message: 'Item already in wishlist' }
    }

    // Add new item to wishlist
    const newItem: WishlistItem = {
      id: crypto.randomUUID(),
      productId,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl || undefined,
      addedAt: new Date().toISOString(),
    }

    const updatedWishlist = [...currentWishlist, newItem]

    // Update user's wishlist in database
    await db.update(user)
      .set({
        wishlist: updatedWishlist,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/wishlist')
    revalidatePath('/') // Update wishlist icon/count

    return { 
      success: true, 
      message: 'Item added to wishlist successfully',
      wishlistCount: updatedWishlist.length
    }
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return { success: false, message: 'Failed to add item to wishlist' }
  }
}

/**
 * Server action to remove item from wishlist
 */
export async function removeFromWishlistAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const itemId = formData.get('itemId') as string
    const productId = formData.get('productId') as string

    if (!itemId && !productId) {
      return { success: false, message: 'Item ID or Product ID is required' }
    }

    // Get current user's wishlist
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentWishlist = (currentUser.wishlist as WishlistItem[]) || []

    // Remove item from wishlist (by itemId or productId)
    const updatedWishlist = currentWishlist.filter(item => {
      if (itemId) return item.id !== itemId
      if (productId) return item.productId !== productId
      return true
    })

    // Update user's wishlist in database
    await db.update(user)
      .set({
        wishlist: updatedWishlist,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/wishlist')
    revalidatePath('/') // Update wishlist icon/count

    return { 
      success: true, 
      message: 'Item removed from wishlist',
      wishlistCount: updatedWishlist.length
    }
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return { success: false, message: 'Failed to remove item from wishlist' }
  }
}

/**
 * Server action to clear entire wishlist
 */
export async function clearWishlistAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    await db.update(user)
      .set({
        wishlist: [],
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/wishlist')
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Wishlist cleared successfully',
      wishlistCount: 0
    }
  } catch (error) {
    console.error('Clear wishlist error:', error)
    return { success: false, message: 'Failed to clear wishlist' }
  }
}

/**
 * Server action to move item from wishlist to cart
 */
export async function moveToCartAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to move items to cart' }
  }

  try {
    const itemId = formData.get('itemId') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const size = formData.get('size') as string
    const color = formData.get('color') as string

    if (!itemId) {
      return { success: false, message: 'Item ID is required' }
    }

    if (quantity < 1 || quantity > 99) {
      return { success: false, message: 'Quantity must be between 1 and 99' }
    }

    // Get current user's wishlist and cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentWishlist = (currentUser.wishlist as WishlistItem[]) || []
    const currentCart = (currentUser.cart as CartItem[]) || []

    // Find the wishlist item
    const wishlistItem = currentWishlist.find(item => item.id === itemId)
    
    if (!wishlistItem) {
      return { success: false, message: 'Item not found in wishlist' }
    }

    // Get fresh product details to check stock
    const [product] = await db.select().from(products).where(eq(products.id, wishlistItem.productId)).limit(1)
    
    if (!product) {
      return { success: false, message: 'Product not found' }
    }

    // Check stock availability
    const stock = product.stock || 0
    if (stock < quantity) {
      return { success: false, message: 'Insufficient stock available' }
    }

    // Check if item already exists in cart (same product, size, color)
    const existingCartItemIndex = currentCart.findIndex(item => 
      item.productId === wishlistItem.productId && 
      item.size === size && 
      item.color === color
    )

    let updatedCart: CartItem[]

    if (existingCartItemIndex !== -1) {
      // Update quantity of existing cart item
      const newQuantity = currentCart[existingCartItemIndex].quantity + quantity
      
      // Check total quantity doesn't exceed stock
      if (newQuantity > stock) {
        return { success: false, message: 'Total quantity would exceed available stock' }
      }

      updatedCart = currentCart.map((item, index) => 
        index === existingCartItemIndex 
          ? { ...item, quantity: newQuantity }
          : item
      )
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: crypto.randomUUID(),
        productId: wishlistItem.productId,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity,
        imageUrl: wishlistItem.imageUrl,
        size: size || undefined,
        color: color || undefined,
      }

      updatedCart = [...currentCart, newCartItem]
    }

    // Remove item from wishlist
    const updatedWishlist = currentWishlist.filter(item => item.id !== itemId)

    // Update both cart and wishlist in database
    await db.update(user)
      .set({
        cart: updatedCart,
        wishlist: updatedWishlist,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/wishlist')
    revalidatePath('/cart')
    revalidatePath('/') // Update both cart and wishlist icons/counts

    return { 
      success: true, 
      message: 'Item moved to cart successfully',
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: updatedWishlist.length
    }
  } catch (error) {
    console.error('Move to cart error:', error)
    return { success: false, message: 'Failed to move item to cart' }
  }
}

/**
 * Server action to move all items from wishlist to cart
 */
export async function moveAllToCartAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Please sign in to move items to cart' }
  }

  try {
    // Get current user's wishlist and cart
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    const currentWishlist = (currentUser.wishlist as WishlistItem[]) || []
    const currentCart = (currentUser.cart as CartItem[]) || []

    if (currentWishlist.length === 0) {
      return { success: false, message: 'Wishlist is empty' }
    }

    const updatedCart = [...currentCart]
    const failedItems: string[] = []

    // Process each wishlist item
    for (const wishlistItem of currentWishlist) {
      try {
        // Get fresh product details to check stock
        const [product] = await db.select().from(products).where(eq(products.id, wishlistItem.productId)).limit(1)
        
        if (!product) {
          failedItems.push(wishlistItem.name)
          continue
        }

        // Check stock availability
        const stock = product.stock || 0
        if (stock < 1) {
          failedItems.push(wishlistItem.name)
          continue
        }

        // Check if item already exists in cart
        const existingCartItemIndex = updatedCart.findIndex(item => 
          item.productId === wishlistItem.productId && 
          !item.size && // Default to no size/color for wishlist items
          !item.color
        )

        if (existingCartItemIndex !== -1) {
          // Update quantity of existing cart item
          const currentQuantity = updatedCart[existingCartItemIndex].quantity
          const newQuantity = currentQuantity + 1
          
          // Check if new quantity exceeds stock
          if (newQuantity > stock) {
            failedItems.push(wishlistItem.name)
            continue
          }

          updatedCart[existingCartItemIndex].quantity = newQuantity
        } else {
          // Add new item to cart
          const newCartItem: CartItem = {
            id: crypto.randomUUID(),
            productId: wishlistItem.productId,
            name: wishlistItem.name,
            price: wishlistItem.price,
            quantity: 1,
            imageUrl: wishlistItem.imageUrl,
          }

          updatedCart.push(newCartItem)
        }
      } catch (error) {
        console.error(`Error processing wishlist item ${wishlistItem.name}:`, error)
        failedItems.push(wishlistItem.name)
      }
    }

    // Update cart and clear wishlist
    await db.update(user)
      .set({
        cart: updatedCart,
        wishlist: [],
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/wishlist')
    revalidatePath('/cart')
    revalidatePath('/')

    const successCount = currentWishlist.length - failedItems.length
    let message = ''

    if (failedItems.length === 0) {
      message = 'All items moved to cart successfully'
    } else if (successCount === 0) {
      message = 'Failed to move any items to cart'
    } else {
      message = `${successCount} items moved to cart. ${failedItems.length} items failed (out of stock or not found)`
    }

    return { 
      success: successCount > 0, 
      message,
      cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: 0,
      failedItems
    }
  } catch (error) {
    console.error('Move all to cart error:', error)
    return { success: false, message: 'Failed to move items to cart' }
  }
}

/**
 * Server action to check if product is in wishlist
 */
export async function checkWishlistAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { inWishlist: false }
  }

  try {
    const productId = formData.get('productId') as string

    if (!productId) {
      return { inWishlist: false }
    }

    // Get current user's wishlist
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { inWishlist: false }
    }

    const currentWishlist = (currentUser.wishlist as WishlistItem[]) || []
    const inWishlist = currentWishlist.some(item => item.productId === productId)

    return { inWishlist }
  } catch (error) {
    console.error('Check wishlist error:', error)
    return { inWishlist: false }
  }
}