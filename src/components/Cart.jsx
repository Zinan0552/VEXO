import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield, Truck, Clock } from 'lucide-react';

const Cart = () => {
  const { user, updateCartQuantity, removeFromCart, cartCount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  // Cart items from user context
  const cartItems = user?.cart || [];

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount for coupon
  const total = subtotal + shipping + tax - discount;

  // Handle quantity updates
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await updateCartQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    setLoading(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon code
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 for 10% off.');
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your cart.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-6 py-16 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to find amazing martial arts gear!
          </p>
          <button
            onClick={handleContinueShopping}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-6 border-b last:border-b-0">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Product Details */}
                  <div className="flex-1 ml-6">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-red-600 font-bold text-lg">${item.price}</span>
                      {item.featured && (
                        <span className="ml-3 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={loading || item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="text-right ml-6">
                    <div className="font-bold text-gray-900 text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={loading}
                      className="mt-2 text-red-600 hover:text-red-700 transition flex items-center text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border">
                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-gray-600 text-sm">On orders over $75</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 text-sm">100% protected</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-gray-600 text-sm">30-day guarantee</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-sm mt-2">{couponError}</p>
                )}
                {!couponApplied && (
                  <p className="text-gray-500 text-xs mt-2">
                    Try code: <strong>WELCOME10</strong> for 10% off
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  🔒 Secure checkout. Your information is safe with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;