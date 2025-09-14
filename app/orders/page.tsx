import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationHelper } from '@/components/navigation';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon, 
  MapPinIcon,
  ArchiveBoxIcon,
  CreditCardIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Order History - CODALWARE',
  description: 'View your order history and track your purchases',
};

interface OrderTrackingStep {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current: boolean;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface EnhancedOrder {
  id: string;
  date: string;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
  timeline: OrderTrackingStep[];
}

export default function OrdersPage() {
  const enhancedOrders: EnhancedOrder[] = [
    {
      id: 'ORD-2025-001',
      date: '2025-09-05',
      status: 'delivered',
      total: 189.99,
      shippingAddress: {
        street: '123 Main Street',
        city: 'Lomé',
        state: 'Maritime',
        zip: '01BP',
        country: 'Togo'
      },
      trackingNumber: 'TG123456789',
      items: [
        { id: '1', name: 'Nike Air Max 270', quantity: 1, price: 159.99, image: '/shoes/shoe-1.jpg' },
        { id: '2', name: 'Nike Crew Socks', quantity: 2, price: 15.00 },
      ],
      timeline: [
        {
          id: '1',
          title: 'Order Placed',
          description: 'Your order has been confirmed and payment processed',
          date: '2025-09-05 10:30 AM',
          completed: true,
          current: false,
          icon: CreditCardIcon
        },
        {
          id: '2',
          title: 'Processing',
          description: 'Your order is being prepared for shipment',
          date: '2025-09-05 2:15 PM',
          completed: true,
          current: false,
          icon: ArchiveBoxIcon
        },
        {
          id: '3',
          title: 'Shipped',
          description: 'Your package is on its way',
          date: '2025-09-06 8:45 AM',
          completed: true,
          current: false,
          icon: TruckIcon
        },
        {
          id: '4',
          title: 'Out for Delivery',
          description: 'Your package is being delivered today',
          date: '2025-09-08 9:00 AM',
          completed: true,
          current: false,
          icon: MapPinIcon
        },
        {
          id: '5',
          title: 'Delivered',
          description: 'Successfully delivered to your address',
          date: '2025-09-08 3:22 PM',
          completed: true,
          current: false,
          icon: CheckCircleIcon
        }
      ]
    },
    {
      id: 'ORD-2025-002',
      date: '2025-09-10',
      status: 'shipped',
      total: 299.99,
      estimatedDelivery: '2025-09-15',
      trackingNumber: 'TG987654321',
      shippingAddress: {
        street: '456 Commerce Ave',
        city: 'Lomé',
        state: 'Maritime',
        zip: '01BP',
        country: 'Togo'
      },
      items: [
        { id: '3', name: 'Nike Air Force 1', quantity: 1, price: 109.99, image: '/shoes/shoe-2.webp' },
        { id: '4', name: 'Nike Dri-FIT Shirt', quantity: 1, price: 39.99 },
        { id: '5', name: 'Nike Tech Fleece Hoodie', quantity: 1, price: 149.99 },
      ],
      timeline: [
        {
          id: '1',
          title: 'Order Placed',
          description: 'Your order has been confirmed and payment processed',
          date: '2025-09-10 11:15 AM',
          completed: true,
          current: false,
          icon: CreditCardIcon
        },
        {
          id: '2',
          title: 'Processing',
          description: 'Your order is being prepared for shipment',
          date: '2025-09-10 4:30 PM',
          completed: true,
          current: false,
          icon: ArchiveBoxIcon
        },
        {
          id: '3',
          title: 'Shipped',
          description: 'Your package is on its way',
          date: '2025-09-11 7:20 AM',
          completed: true,
          current: true,
          icon: TruckIcon
        },
        {
          id: '4',
          title: 'Out for Delivery',
          description: 'Your package will be delivered soon',
          date: 'Estimated: 2025-09-15',
          completed: false,
          current: false,
          icon: MapPinIcon
        },
        {
          id: '5',
          title: 'Delivered',
          description: 'Package will be delivered to your address',
          date: 'Estimated: 2025-09-15',
          completed: false,
          current: false,
          icon: CheckCircleIcon
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-400 bg-green-400/10';
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'shipped':
        return 'text-blue-400 bg-blue-400/10';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const TimelineStep = ({ step, isLast }: { step: OrderTrackingStep; isLast: boolean }) => {
    const Icon = step.icon;
    
    return (
      <div className="relative flex items-start space-x-6 group">
        {/* Enhanced Icon with Glow Effect */}
        <div className="flex flex-col items-center">
          <div className={`relative p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
            step.completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
              : step.current
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 animate-pulse'
              : 'bg-slate-700 text-slate-400 border-2 border-slate-600'
          }`}>
            <Icon className="h-5 w-5" />
            
            {/* Success Check Mark Overlay */}
            {step.completed && (
              <div className="absolute -top-1 -right-1 bg-emerald-600 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Current Step Pulse Ring */}
            {step.current && (
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
            )}
          </div>
          
          {/* Enhanced Connecting Line */}
          {!isLast && (
            <div className="relative flex justify-center w-full mt-2">
              <div className={`w-1 h-12 rounded-full transition-all duration-500 ${
                step.completed 
                  ? 'bg-gradient-to-b from-emerald-500 to-green-600 shadow-sm shadow-emerald-500/20' 
                  : 'bg-slate-600'
              }`}>
                {/* Animated flowing dots for current step */}
                {step.current && (
                  <div className="absolute inset-0 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600">
                    <div className="absolute top-0 w-1 h-3 bg-blue-300 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Content Card */}
        <div className="flex-1 pb-6">
          <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 group-hover:bg-slate-800/70 ${
            step.completed
              ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : step.current
              ? 'border-blue-500/30 shadow-lg shadow-blue-500/10'
              : 'border-slate-700'
          }`}>
            {/* Header with Status Badge */}
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold text-lg transition-colors duration-300 ${
                step.completed 
                  ? 'text-emerald-400' 
                  : step.current 
                  ? 'text-blue-400' 
                  : 'text-slate-400'
              }`}>
                {step.title}
              </h4>
              
              {/* Status Badges */}
              <div className="flex items-center space-x-2">
                {step.completed && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                    ✓ Completed
                  </span>
                )}
                {step.current && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30 animate-pulse">
                    ⏳ In Progress
                  </span>
                )}
                {!step.completed && !step.current && (
                  <span className="px-3 py-1 bg-slate-600/20 text-slate-500 text-xs font-medium rounded-full border border-slate-600/30">
                    ⏸ Pending
                  </span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-slate-300 mb-3 leading-relaxed">{step.description}</p>
            
            {/* Enhanced Date Display */}
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-medium ${
                step.completed ? 'text-emerald-300' : step.current ? 'text-blue-300' : 'text-slate-500'
              }`}>
                {step.date}
              </span>
            </div>
            
            {/* Progress Bar for Current Step */}
            {step.current && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Processing...</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <NavigationHelper />
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Order History</h1>
          <p className="text-gray-400 mt-2">View and track all your orders</p>
        </div>

        <div className="space-y-8">
          {enhancedOrders.map((order) => (
            <div key={order.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h2 className="text-2xl font-semibold text-white mb-1">{order.id}</h2>
                    <p className="text-slate-400">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                    {order.trackingNumber && (
                      <p className="text-sm text-blue-400 mt-1">
                        Tracking: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-2xl font-bold text-white">${order.total}</span>
                  </div>
                </div>
                
                {/* Delivery Info */}
                {order.estimatedDelivery && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-blue-400 text-sm">
                      <TruckIcon className="h-4 w-4 inline mr-2" />
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Enhanced Order Timeline */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-3">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                    Order Timeline
                    <div className="ml-auto px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
                      Live Tracking
                    </div>
                  </h3>
                  <div className="space-y-4 relative">
                    {/* Background Pattern */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent opacity-50"></div>
                    
                    {order.timeline.map((step, index) => (
                      <TimelineStep 
                        key={step.id} 
                        step={step} 
                        isLast={index === order.timeline.length - 1} 
                      />
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                      Items ({order.items.length})
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            {item.image && (
                              <div className="w-12 h-12 bg-slate-600 rounded-lg overflow-hidden">
                                <Image 
                                  src={item.image} 
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-white font-semibold">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-white">{order.shippingAddress.street}</p>
                      <p className="text-slate-400">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p className="text-slate-400">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-slate-700/50 border-t border-slate-700 flex justify-end space-x-3">
                <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200">
                  Download Invoice
                </button>
                {order.status !== 'delivered' && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200">
                    Track Package
                  </button>
                )}
                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors duration-200">
                  Reorder Items
                </button>
              </div>
            </div>
          ))}
        </div>

        {enhancedOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-4">Start shopping to see your orders here</p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
