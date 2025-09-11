import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface UserDevice {
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

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UserPreferences {
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
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string;
  image?: string;
  address?: UserAddress;
  devices?: UserDevice[];
  preferences?: UserPreferences;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAddress: (address: UserAddress) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addDevice: (device: UserDevice) => void;
  removeDevice: (deviceId: string) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: (profile) => {
        set({ 
          profile,
          error: null 
        });
      },

      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      updateAddress: (address) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              address: {
                ...currentProfile.address,
                ...address
              },
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      updatePreferences: (preferences) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              preferences: {
                ...currentProfile.preferences,
                ...preferences
              },
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      addDevice: (device) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          const devices = currentProfile.devices || [];
          const existingDeviceIndex = devices.findIndex(d => d.id === device.id);
          
          let updatedDevices;
          if (existingDeviceIndex >= 0) {
            // Update existing device
            updatedDevices = devices.map(d => d.id === device.id ? device : d);
          } else {
            // Add new device
            updatedDevices = [...devices, device];
          }

          set({
            profile: {
              ...currentProfile,
              devices: updatedDevices,
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      removeDevice: (deviceId) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              devices: (currentProfile.devices || []).filter(d => d.id !== deviceId),
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      clearProfile: () => {
        set({ 
          profile: null,
          error: null 
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
