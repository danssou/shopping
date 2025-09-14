'use client';

import { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '@/components/notifications';

interface User {
  id: string;
  name?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  bio?: string | null;
  dateOfBirth?: Date | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null;
}

interface PersonalInfoTabProps {
  user: User;
}

export default function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const { success, error: showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
    address: {
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || 'US',
    }
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful update
      success('Profile Updated', 'Your profile information has been updated successfully');
    } catch (error) {
      showError('Update Failed', 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful update
      success('Address Updated', 'Your address has been updated successfully');
    } catch (error) {
      showError('Update Failed', 'Failed to update address');
      console.error('Address update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Form */}
      <form onSubmit={handleProfileSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <UserIcon className="h-4 w-4 mr-2" />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <UserIcon className="h-4 w-4 mr-2" />
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
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
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-slate-900 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Address Information Form */}
      <form onSubmit={handleAddressSubmit}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Address Information</h3>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <MapPinIcon className="h-4 w-4 mr-2" />
              Street Address
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Enter your street address"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="City"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
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
                value={formData.address.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select 
                value={formData.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-slate-900 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}