/**
 * Example usage of the modular notification system
 * 
 * This file demonstrates how to use the new notification system
 * throughout your application for different scenarios.
 */

'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { ShoppingBagIcon, UserIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotificationExamples() {
  const { success, error, warning, info, addNotification } = useNotifications();

  // Basic usage examples
  const showSuccessNotification = () => {
    success('Payment successful!', 'Your order has been processed and will be shipped soon.');
  };

  const showErrorNotification = () => {
    error('Payment failed', 'Please check your payment details and try again.');
  };

  const showWarningNotification = () => {
    warning('Stock running low', 'Only 3 items left in stock for this product.');
  };

  const showInfoNotification = () => {
    info('New features available', 'Check out our latest product updates in the dashboard.');
  };

  // Advanced usage with custom options
  const showCartNotification = () => {
    success(
      'Item added to cart',
      'Product has been successfully added to your shopping cart.',
      {
        icon: ShoppingBagIcon,
        duration: 3000,
        action: {
          label: 'View Cart',
          onClick: () => console.log('Opening cart...')
        }
      }
    );
  };

  const showPersistentNotification = () => {
    addNotification({
      type: 'info',
      title: 'Important Update',
      message: 'System maintenance scheduled for tonight at 2 AM EST.',
      persistent: true, // Won't auto-hide
      icon: ExclamationTriangleIcon,
      action: {
        label: 'Learn More',
        onClick: () => console.log('Opening maintenance info...')
      }
    });
  };

  const showUserNotification = () => {
    success(
      'Profile updated',
      'Your profile information has been saved successfully.',
      {
        icon: UserIcon,
        duration: 2000
      }
    );
  };

  // Error handling scenarios
  const showValidationError = () => {
    error(
      'Validation Error',
      'Please fill in all required fields before submitting.',
      {
        duration: 8000 // Longer duration for error messages
      }
    );
  };

  const showNetworkError = () => {
    error(
      'Connection Error',
      'Unable to connect to server. Please check your internet connection.',
      {
        persistent: true, // Keep until user dismisses
        action: {
          label: 'Retry',
          onClick: () => {
            console.log('Retrying connection...');
            // Add retry logic here
          }
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification System Examples</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic Notifications</h2>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={showSuccessNotification}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Success
            </button>
            <button 
              onClick={showErrorNotification}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Error
            </button>
            <button 
              onClick={showWarningNotification}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Warning
            </button>
            <button 
              onClick={showInfoNotification}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Info
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Advanced Notifications</h2>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={showCartNotification}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Cart Notification (with action)
            </button>
            <button 
              onClick={showPersistentNotification}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Persistent Notification
            </button>
            <button 
              onClick={showUserNotification}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              User Profile Update
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Error Scenarios</h2>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={showValidationError}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Validation Error
            </button>
            <button 
              onClick={showNetworkError}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Network Error (with retry)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Notes:</h3>
        <ul className="text-sm space-y-1">
          <li>• Notifications appear in the top-right corner by default</li>
          <li>• Success notifications auto-hide after 4 seconds</li>
          <li>• Error notifications auto-hide after 6 seconds</li>
          <li>• Warning notifications auto-hide after 5 seconds</li>
          <li>• Info notifications auto-hide after 4 seconds</li>
          <li>• Persistent notifications require manual dismissal</li>
          <li>• Action buttons can be added for interactive notifications</li>
          <li>• Custom icons and durations can be specified</li>
          <li>• Maximum of 5 notifications can be shown simultaneously</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * How to use in your components:
 * 
 * 1. Import the hook:
 *    import { useNotifications } from '@/contexts/NotificationContext';
 * 
 * 2. Use in your component:
 *    const { success, error, warning, info } = useNotifications();
 * 
 * 3. Call notification methods:
 *    success('Title', 'Message');
 *    error('Error Title', 'Error details');
 * 
 * 4. For advanced usage:
 *    success('Title', 'Message', {
 *      duration: 3000,
 *      icon: CustomIcon,
 *      action: { label: 'Action', onClick: () => {} }
 *    });
 */