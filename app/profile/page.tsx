'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useWishlist, useCart } from '@/hooks/useStore';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  CalendarIcon,
  ShieldCheckIcon,
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('personal');
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const user = session?.user;
  
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Please sign in to view your profile.</div>
      </div>
    );
  }

  // Mock device data - in real app, this would come from the database
  const devices = [
    {
      id: '1',
      name: 'Chrome on Windows',
      type: 'desktop' as const,
      browser: 'Chrome',
      os: 'Windows',
      lastSeen: '2025-09-09T21:30:00Z',
      ipAddress: '192.168.1.100',
      location: { city: 'New York', country: 'United States' }
    },
    {
      id: '2',
      name: 'Safari on iPhone',
      type: 'mobile' as const,
      browser: 'Safari',
      os: 'iOS',
      lastSeen: '2025-09-09T20:15:00Z',
      ipAddress: '10.0.0.50',
      location: { city: 'San Francisco', country: 'United States' }
    }
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return DevicePhoneMobileIcon;
      case 'tablet': return DeviceTabletIcon;
      default: return ComputerDesktopIcon;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <div className="flex items-center space-x-6">
              <ProfileAvatar 
                user={{
                  name: user.name,
                  email: user.email,
                  image: user.image || undefined
                }} 
                size="xl" 
                editable={true}
                onImageChange={(file) => {
                  console.log('Image upload:', file);
                  // Handle image upload here
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name || 'User'}</h1>
                <p className="text-slate-300">{user.email}</p>
                <p className="text-sm text-slate-400 mt-1">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-700">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'personal', label: 'Personal Info', icon: UserIcon },
                { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
                { id: 'devices', label: 'Connected Devices', icon: ComputerDesktopIcon },
                { id: 'security', label: 'Security', icon: ShieldCheckIcon },
                { id: 'preferences', label: 'Preferences', icon: BellIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name || ''}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email || ''}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Address Information</h3>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your street address"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">My Wishlist</h3>
                    <p className="text-slate-400">Items you&apos;ve saved for later</p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <button
                      onClick={clearWishlist}
                      className="flex items-center text-red-400 hover:text-red-300 text-sm"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Clear All
                    </button>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <HeartIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-400 mb-2">Your wishlist is empty</h4>
                    <p className="text-slate-500">Items you like will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="bg-slate-700 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                              <span className="text-slate-400">No Image</span>
                            </div>
                          )}
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-red-400 hover:text-red-300"
                          >
                            <HeartSolidIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-white mb-1">{item.name}</h4>
                          <p className="text-slate-400 text-sm mb-2">{item.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-yellow-500">{item.price}</span>
                            <button
                              onClick={() => {
                                // Convert wishlist item to cart product format
                                const cartProduct = {
                                  id: item.id,
                                  name: item.name,
                                  description: null,
                                  price: item.price.replace('$', ''),
                                  imageUrl: item.imageUrl,
                                  category: item.category || null,
                                  brand: null,
                                  stock: null,
                                  createdAt: null,
                                  updatedAt: null,
                                };
                                addToCart(cartProduct);
                              }}
                              className="flex items-center text-sm bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-3 py-1 rounded-md font-medium transition-colors duration-200"
                            >
                              <ShoppingCartIcon className="h-4 w-4 mr-1" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Connected Devices</h3>
                  <p className="text-slate-400 mb-6">Manage devices that have access to your account. Remove any devices you don&apos;t recognize.</p>
                </div>

                <div className="space-y-4">
                  {devices.map((device) => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    return (
                      <div key={device.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-slate-600 p-2 rounded-lg">
                            <DeviceIcon className="h-6 w-6 text-slate-300" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{device.name}</h4>
                            <div className="text-sm text-slate-400">
                              <p>{device.type} • {device.os}</p>
                              <p>Last seen: {new Date(device.lastSeen).toLocaleString()}</p>
                              <p>{device.location?.city}, {device.location?.country} • {device.ipAddress}</p>
                            </div>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300 font-medium text-sm">
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Password</h4>
                    <p className="text-slate-400 text-sm mb-4">Change your password regularly to keep your account secure.</p>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                      Change Password
                    </button>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-slate-400 text-sm mb-4">Add an extra layer of security to your account.</p>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Login History</h4>
                    <p className="text-slate-400 text-sm mb-4">Review recent login activity on your account.</p>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'email', label: 'Email notifications', description: 'Receive order updates and promotions via email' },
                        { id: 'push', label: 'Push notifications', description: 'Get instant alerts on your device' },
                        { id: 'marketing', label: 'Marketing emails', description: 'Receive special offers and product updates' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{item.label}</p>
                            <p className="text-slate-400 text-xs">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">Profile visibility</p>
                          <p className="text-slate-400 text-xs">Control who can see your profile</p>
                        </div>
                        <select className="bg-slate-600 border border-slate-500 rounded text-white text-sm px-3 py-1">
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">Show email address</p>
                          <p className="text-slate-400 text-xs">Allow others to see your email</p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Theme</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'auto', label: 'Auto (system preference)' },
                        { id: 'dark', label: 'Dark theme' },
                        { id: 'light', label: 'Light theme' },
                      ].map((theme) => (
                        <label key={theme.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            defaultChecked={theme.id === 'dark'}
                            className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 focus:ring-yellow-500"
                          />
                          <span className="text-white text-sm">{theme.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
