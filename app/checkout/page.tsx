'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useStore';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

type PaymentMethod = 'card' | 'paypal' | 'cash';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    deliveryInstructions: ''
  });

  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, American Express',
      icon: CreditCardIcon,
      fees: 'No additional fees'
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: BanknotesIcon,
      fees: 'No additional fees'
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: TruckIcon,
      fees: '+$2.00 handling fee'
    }
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700">
            <XMarkIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-slate-400 mb-6">Add some items to your cart before checking out.</p>
            <Link 
              href="/"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Processing payment:', {
      method: selectedPayment,
      amount: total,
      items: items,
      formData: formData
    });
    
    clearCart();
    setIsProcessing(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-slate-400">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 mr-2" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedPayment === method.id 
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                        className="sr-only"
                      />
                      <Icon className="h-6 w-6 text-gray-300 mr-4" />
                      <div className="flex-1">
                        <div className="text-white font-medium">{method.name}</div>
                        <div className="text-sm text-gray-400">{method.description}</div>
                        <div className="text-xs text-yellow-400">{method.fees}</div>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedPayment === 'card' && (
                <div className="space-y-4 p-4 bg-slate-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Card Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment === 'paypal' && (
                <div className="p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700">
                  <p className="text-blue-300 text-sm">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              )}

              {selectedPayment === 'cash' && (
                <div className="p-4 bg-orange-900 bg-opacity-20 rounded-lg border border-orange-700">
                  <p className="text-orange-300 text-sm mb-2">
                    <strong>Cash on Delivery</strong> - Pay when your order arrives
                  </p>
                  <p className="text-orange-400 text-xs">
                    • Additional $2.00 handling fee applies<br/>
                    • Have exact change ready<br/>
                    • Payment accepted in cash only
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{item.name}</h3>
                      <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-white font-medium">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {selectedPayment === 'cash' && (
                  <div className="flex justify-between text-orange-400">
                    <span>Handling Fee</span>
                    <span>$2.00</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2">
                  <div className="flex justify-between text-xl font-semibold text-white">
                    <span>Total</span>
                    <span>${(selectedPayment === 'cash' ? total + 2 : total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 text-slate-900 font-semibold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Place Order - $${(selectedPayment === 'cash' ? total + 2 : total).toFixed(2)}`
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-400 mt-4 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
