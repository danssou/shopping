'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema/user'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { parseDeviceInfo } from '@/utils/profile'
import { headers } from 'next/headers'

type DeviceInfo = {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastSeen: string;
  ipAddress: string;
  location?: {
    city?: string;
    country?: string;
  };
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const bio = formData.get('bio') as string

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return { success: false, message: 'First name, last name, and email are required' }
  }

  try {
    const fullName = `${firstName} ${lastName}`.trim()
    
    // Update user profile
    await db.update(user)
      .set({
        firstName,
        lastName,
        name: fullName,
        email,
        phone,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/profile')
    revalidatePath('/') // Update header/navbar
    
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { success: false, message: 'Failed to update profile' }
  }
}

export async function updateAddressAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const address = {
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    country: formData.get('country') as string,
  }

  // Validate required address fields
  if (!address.street || !address.city || !address.state || !address.zipCode) {
    return { success: false, message: 'All address fields are required' }
  }

  try {
    await db.update(user)
      .set({
        address,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/profile')
    revalidatePath('/checkout') // Update checkout page if needed
    
    return { success: true, message: 'Address updated successfully' }
  } catch (error) {
    console.error('Address update error:', error)
    return { success: false, message: 'Failed to update address' }
  }
}

export async function trackDeviceAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { success: false, message: 'Not authenticated' }
  }

  const userAgent = formData.get('userAgent') as string
  const ipAddress = formData.get('ipAddress') as string || 'Unknown'
  const location = formData.get('location') as string || 'Unknown'

  if (!userAgent) {
    return { success: false, message: 'User agent required' }
  }

  try {
    const deviceInfo = parseDeviceInfo(userAgent)

    // Get current user
    const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    
    if (!currentUser) {
      return { success: false, message: 'User not found' }
    }

    // Parse existing devices
    const currentDevices = (currentUser.devices as DeviceInfo[]) || []

    // Check if device already exists
    const deviceExists = currentDevices.find((d: DeviceInfo) => 
      d.browser === deviceInfo.browser && 
      d.os === deviceInfo.os && 
      d.type === deviceInfo.type
    )

    if (!deviceExists) {
      // Add new device
      const newDevice: DeviceInfo = {
        id: crypto.randomUUID(),
        name: `${deviceInfo.browser} on ${deviceInfo.os}`,
        type: deviceInfo.type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        lastSeen: new Date().toISOString(),
        ipAddress,
        location: location ? { city: location } : undefined,
      }

      const updatedDevices = [...currentDevices, newDevice]

      // Keep only last 10 devices
      if (updatedDevices.length > 10) {
        updatedDevices.splice(0, updatedDevices.length - 10)
      }

      await db.update(user)
        .set({
          devices: updatedDevices,
          updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id))
    } else {
      // Update last seen for existing device
      const updatedDevices = currentDevices.map(d => 
        d.id === deviceExists.id 
          ? { ...d, lastSeen: new Date().toISOString(), ipAddress, location: location ? { city: location } : d.location }
          : d
      )

      await db.update(user)
        .set({
          devices: updatedDevices,
          updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id))
    }

    return { success: true, message: 'Device tracked successfully' }
  } catch (error) {
    console.error('Device tracking error:', error)
    return { success: false, message: 'Failed to track device' }
  }
}

export async function updatePreferencesAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const preferences = {
    theme: (formData.get('theme') as string || 'dark') as 'light' | 'dark' | 'auto',
    notifications: {
      email: formData.get('emailNotifications') === 'true',
      push: formData.get('pushNotifications') === 'true',
      marketing: formData.get('marketingNotifications') === 'true',
    },
    privacy: {
      profileVisibility: (formData.get('profileVisibility') as string || 'public') as 'public' | 'private',
      showEmail: formData.get('showEmail') === 'true',
    }
  }

  try {
    await db.update(user)
      .set({
        preferences,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    revalidatePath('/profile')
    return { success: true, message: 'Preferences updated successfully' }
  } catch (error) {
    console.error('Preferences update error:', error)
    return { success: false, message: 'Failed to update preferences' }
  }
}

export async function deleteAccountAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const confirmation = formData.get('confirmation') as string

  if (confirmation !== 'DELETE MY ACCOUNT') {
    return { success: false, message: 'Please type "DELETE MY ACCOUNT" to confirm' }
  }

  try {
    // Mark the account as deleted by anonymizing data
    await db.update(user)
      .set({
        email: `deleted_${Date.now()}@example.com`,
        name: 'Deleted User',
        firstName: null,
        lastName: null,
        phone: null,
        bio: null,
        image: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    // Sign out the user
    await auth.api.signOut({
      headers: await headers(),
    })

    return { success: true, message: 'Account deleted successfully' }
  } catch (error) {
    console.error('Account deletion error:', error)
    return { success: false, message: 'Failed to delete account' }
  }
}