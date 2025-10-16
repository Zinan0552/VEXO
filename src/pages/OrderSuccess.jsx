import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock order data - replace with actual order data from location state or API
  const mockOrder = {
    id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toISOString(),
    total: 189.97,
    items: [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        quantity: 1,
        image: '/images/headphones.jpg'
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        price: 29.99,
        quantity: 2,
        image: '/images/tshirt.jpg'
      },
      {
        id: 3,
        name: 'Phone Case',
        price: 19.99,
        quantity: 1,
        image: '/images/phone-case.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card ending in 4242',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  };

  useEffect(() => {
    // Simulate loading order details
    const timer = setTimeout(() => {
      setOrderDetails(mockOrder);
      setLoading(false);
      
      // Show success toast
      toast.success('Order placed successfully!', {
        position: "top-center",
        autoClose: 5000,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleTrackOrder = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase, {user?.name || 'Customer'}!
          </p>
          <p className="text-gray-600">
            Your order <span className="font-semibold">{orderDetails.id}</span> has been successfully placed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Image</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${orderDetails.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${(orderDetails.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span className="text-red-600">
                    ${(orderDetails.total * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {orderDetails.shippingAddress.name}<br />
                    {orderDetails.shippingAddress.street}<br />
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}<br />
                    {orderDetails.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Estimate</h3>
                  <p className="text-gray-600">
                    {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                  <p className="text-gray-600">{orderDetails.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Date</h3>
                  <p className="text-gray-600">
                    {new Date(orderDetails.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmation</p>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation shortly.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your items for shipment.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Shipped</p>
                    <p className="text-sm text-gray-600">We'll notify you when your order ships.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleTrackOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-semibold transition-colors"
                >
                  Track Your Order
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
                <Link
                  to="/orders"
                  className="block text-center text-red-600 hover:text-red-700 font-semibold py-2 transition-colors"
                >
                  View All Orders
                </Link>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center">
                  Need help? <Link to="/contact" className="text-red-600 hover:text-red-700">Contact Support</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;