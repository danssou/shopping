'use client';

import { useState } from 'react';
import { 
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '@/components/notifications';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastSeen: string;
  ipAddress: string;
  location: {
    city: string;
    country: string;
  };
}

export default function DevicesTab() {
  const { error: showError } = useNotifications();
  
  // Mock device data - in real app, this would come from server actions
  const [devices] = useState<Device[]>([
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
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return DevicePhoneMobileIcon;
      case 'tablet': return DeviceTabletIcon;
      default: return ComputerDesktopIcon;
    }
  };

  const handleRemoveDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to remove "${deviceName}"? You'll need to sign in again on this device.`)) {
      return;
    }

    try {
      // In a real app, this would call a server action to revoke the session
      // For now, we'll simulate the action
      if (deviceId === '1') {
        // Simulate current device - can't remove
        showError('Cannot Remove', 'You cannot remove the current device. Please use a different device to remove this one.');
        return;
      }
      
      // For demo purposes, just show success
      // In production, this would be: await revokeDeviceSession(deviceId);
      setTimeout(() => {
        // Remove from local state for demo
        // In real app, this would be handled by server state
      }, 1000);
      
    } catch (error) {
      showError('Remove Failed', 'Failed to remove device');
      console.error('Remove device error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Connected Devices</h3>
        <p className="text-slate-400 mb-6">
          Manage devices that have access to your account. Remove any devices you don&apos;t recognize.
        </p>
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
              <button 
                onClick={() => handleRemoveDevice(device.id, device.name)}
                className="text-red-400 hover:text-red-300 font-medium text-sm"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12">
          <ComputerDesktopIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-400 mb-2">No devices found</h4>
          <p className="text-slate-500">Your connected devices will appear here</p>
        </div>
      )}
    </div>
  );
}