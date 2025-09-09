import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order History - CODALWARE',
  description: 'View your order history and track your purchases',
};

export default function OrdersPage() {
  const sampleOrders = [
    {
      id: 'ORD-2025-001',
      date: '2025-09-05',
      status: 'Delivered',
      total: 189.99,
      items: [
        { name: 'Nike Air Max 270', quantity: 1, price: 159.99 },
        { name: 'Nike Crew Socks', quantity: 2, price: 15.00 },
      ],
    },
    {
      id: 'ORD-2025-002',
      date: '2025-09-08',
      status: 'Processing',
      total: 299.99,
      items: [
        { name: 'Nike Air Force 1', quantity: 1, price: 109.99 },
        { name: 'Nike Dri-FIT Shirt', quantity: 1, price: 39.99 },
        { name: 'Nike Tech Fleece Hoodie', quantity: 1, price: 149.99 },
      ],
    },
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

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Order History</h1>
          <p className="text-gray-400 mt-2">View and track all your orders</p>
        </div>

        <div className="space-y-6">
          {sampleOrders.map((order) => (
            <div key={order.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{order.id}</h2>
                  <p className="text-gray-400">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-xl font-bold text-white">${order.total}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-medium text-white mb-3">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-3">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-white font-semibold">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200">
                  View Details
                </button>
                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors duration-200">
                  Reorder Items
                </button>
              </div>
            </div>
          ))}
        </div>

        {sampleOrders.length === 0 && (
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
  );
}
