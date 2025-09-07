import CheckoutProtection from '@/components/auth/CheckoutProtection';

export default function CheckoutPage() {
  return (
    <CheckoutProtection>
      <div className="min-h-screen bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            Checkout
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-slate-100 rounded-lg shadow-sm border border-slate-300 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Shipping Information
              </h2>
              
              {/* This content is only shown to authenticated users */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors duration-200"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors duration-200"
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="bg-slate-100 rounded-lg shadow-sm border border-slate-300 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Order Summary
              </h2>
              
              {/* Sample order items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4 pb-4 border-b border-slate-300">
                  <div className="w-16 h-16 bg-slate-300 rounded-lg flex items-center justify-center">
                    <span className="text-slate-700 text-sm">Shoe</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">Nike Air Force 1</h3>
                    <p className="text-sm text-slate-600">Size 10 • White</p>
                    <p className="text-sm text-slate-600">Qty: 1</p>
                  </div>
                  <span className="font-medium text-slate-900">$199.99</span>
                </div>
              </div>
              
              {/* Order totals */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">$199.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-900">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="text-slate-900">$16.00</span>
                </div>
                <div className="border-t border-slate-300 pt-4 flex justify-between font-semibold text-lg">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">$215.99</span>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
                Place Order
              </button>
              
              <p className="text-xs text-slate-600 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CheckoutProtection>
  );
}
