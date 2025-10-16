import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout, cartCount, wishlistCount, orders } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [stats, setStats] = useState({
    cartItems: 0,
    wishlistItems: 0,
    totalOrders: 0
  });

  // Initialize user data with real counts
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.username  || 'User',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });

      // Use actual data from context instead of mock data
      setStats({
        cartItems: cartCount || 0,
        wishlistItems: wishlistCount || 0,
        totalOrders: getOrderCount()
      });
    }
  }, [user, cartCount, wishlistCount, orders]);

  // Helper function to get order count safely
  const getOrderCount = () => {
    // Check if orders exists and is an array
    if (Array.isArray(orders)) {
      return orders.length;
    }
    
    // If orders doesn't exist in context, check user object
    if (user && Array.isArray(user.orders)) {
      return user.orders.length;
    }
    
    // Check for orderHistory or other common property names
    if (user && Array.isArray(user.orderHistory)) {
      return user.orderHistory.length;
    }
    
    // Default fallback - you can adjust this based on your actual data structure
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to update user data
      // await updateUserProfile(userData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setUserData({
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleViewWishlist = () => {
    navigate('/wishlist');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats Cards */}
          <div className="xl:col-span-1 lg:col-span-1 space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Quick Stats</h3>
              
              <div className="space-y-5">
                {/* Cart Items */}
                <div 
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all duration-200 border border-blue-100"
                  onClick={handleViewCart}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cart Items</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.cartItems}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Wishlist Items */}
                <div 
                  className="flex items-center justify-between p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-all duration-200 border border-red-100"
                  onClick={handleViewWishlist}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Wishlist</p>
                      <p className="text-2xl font-bold text-red-600">{stats.wishlistItems}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Total Orders */}
                <div 
                  className="flex items-center justify-between p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-all duration-200 border border-green-100"
                  onClick={handleViewOrders}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Orders</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalOrders}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleViewOrders}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center border border-gray-200 hover:border-gray-300"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Order History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="xl:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-gray-600 mt-1">Update your personal details and contact information</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center mt-4 sm:mt-0 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        required
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-transparent">
                        <p className="text-gray-900 font-medium">{userData.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        required
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-transparent">
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-transparent">
                        <p className="text-gray-900 font-medium">
                          {userData.phone || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-3 lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Enter your complete address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-transparent">
                        <p className="text-gray-900 font-medium">
                          {userData.address || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;