import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Eye,
  RefreshCw,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingCart,
  MessageCircle,
  Star,
  Home,
  ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // Get orders from user data
  const orders = user?.orders || [];

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": 
      case "delivered": 
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped": 
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing": 
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "cancelled": 
        return <XCircle className="w-5 h-5 text-red-600" />;
      default: 
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": 
      case "delivered": 
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped": 
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing": 
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": 
        return "bg-red-100 text-red-800 border-red-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": 
      case "delivered": 
        return "Delivered";
      case "shipped": 
        return "Shipped";
      case "processing": 
        return "Processing";
      case "cancelled": 
        return "Cancelled";
      default: 
        return "Pending";
    }
  };

  // Navigation functions
  const navigateToProducts = () => navigate('/products');
  const navigateToCart = () => navigate('/cart');
  const navigateToTrackOrder = (orderId) => navigate(`/track-order/${orderId}`);
  const navigateToProductDetails = (productId) => navigate(`/product/${productId}`);
  const navigateToSupport = () => navigate('/support');
  const navigateToProfile = () => navigate('/profile');

  const handleRefreshOrders = async () => {
    setRefreshing(true);
    try {
      // Refresh user data from server
      const response = await fetch(`http://localhost:5001/users/${user.id}`);
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success("Orders updated successfully");
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast.error('Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTrackPackage = (order) => {
    toast.success(`Tracking order #${order.id}`);
    // In a real app, this would navigate to tracking page
    window.open(`https://tracking.example.com/track/${order.id}`, '_blank');
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleReorder = async (order) => {
    try {
      // Add all items from order to cart
      const cartItems = order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        category: item.category
      }));

      // Update user's cart in the database
      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: [...(user.cart || []), ...cartItems]
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(`Added ${order.items.length} items from order #${order.id} to cart`);
        // Navigate to cart after short delay
        setTimeout(() => navigateToCart(), 1000);
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to add items to cart');
    }
  };

  const handleCancelOrder = async (order) => {
    if (order.status === "Processing") {
      if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
        try {
          // Update order status in the database
          const updatedOrders = orders.map(o => 
            o.id === order.id ? { ...o, status: "Cancelled" } : o
          );

          const response = await fetch(`http://localhost:5001/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orders: updatedOrders
            }),
          });

          if (response.ok) {
            const updatedUser = await response.json();
            updateUser(updatedUser);
            toast.success(`Order #${order.id} has been cancelled`);
          } else {
            throw new Error('Failed to cancel order');
          }
        } catch (error) {
          console.error('Error cancelling order:', error);
          toast.error('Failed to cancel order');
        }
      }
    } else {
      toast.error("This order can no longer be cancelled");
    }
  };

  const handleContactSupport = (order) => {
    toast.success(`Opening support for order #${order.id}`);
    navigateToSupport();
  };

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setReviewText("");
    setRating(0);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || rating === 0) {
      toast.error("Please provide both rating and review text");
      return;
    }

    try {
      // Submit review to backend
      const reviewData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        rating: rating,
        review: reviewText,
        date: new Date().toISOString(),
        userName: user.username
      };

      // Save review to user's data
      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: [...(user.reviews || []), reviewData]
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(`Review submitted for ${selectedProduct.name}`);
        setIsReviewModalOpen(false);
        setSelectedProduct(null);
        setReviewText("");
        setRating(0);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleBuyAgain = async (product) => {
    try {
      // Add single product to cart
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category
      };

      // Update user's cart in the database
      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: [...(user.cart || []), cartItem]
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(`Added ${product.name} to cart`);
        // Navigate to cart after short delay
        setTimeout(() => navigateToCart(), 500);
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error buying again:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleViewProduct = (product) => {
    navigateToProductDetails(product.id);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getOrderCountByStatus = () => {
    const counts = {
      all: orders.length,
      processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
      shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
      delivered: orders.filter(o => o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "completed").length,
      cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
    };
    return counts;
  };

  const statusCounts = getOrderCountByStatus();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="max-w-md">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={navigateToProducts}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
            <button 
              onClick={navigateToHome}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={navigateToCart}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart</span>
            </button>
            <button
              onClick={handleRefreshOrders}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`bg-white p-4 rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                statusFilter === status
                  ? 'border-red-500 shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">
                {status === 'all' ? 'All Orders' : status}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-3">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                      <div className="flex-1 flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                          onClick={() => handleViewProduct(item)}
                        />
                        <div>
                          <div 
                            className="text-sm font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-red-600"
                            onClick={() => handleViewProduct(item)}
                          >
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  {order.items?.length > 3 && (
                    <div className="text-sm text-gray-500 text-center pt-2 border-t">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewOrderDetails(order)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleTrackPackage(order)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track</span>
                  </button>
                  
                  {(order.status === "Delivered" || order.status === "Completed") && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reorder All</span>
                    </button>
                  )}
                  
                  {(order.status === "Processing" || order.status === "Shipped") && (
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleContactSupport(order)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Support</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for Filters */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No orders match your criteria'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-semibold"
                >
                  Clear filters
                </button>
              )}
              <button
                onClick={navigateToProducts}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order Details #{selectedOrder.id}</h3>
                  <button 
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">#{selectedOrder.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">{selectedOrder.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-lg">${selectedOrder.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{selectedOrder.shippingDetails?.fullName}</p>
                        <p>{selectedOrder.shippingDetails?.email}</p>
                        <p>{selectedOrder.shippingDetails?.address}</p>
                        <p>{selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.postalCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items ({selectedOrder.items?.length})</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover cursor-pointer"
                            onClick={() => handleViewProduct(item)}
                          />
                          <div className="flex-1">
                            <h5 
                              className="font-medium text-gray-900 cursor-pointer hover:text-red-600"
                              onClick={() => handleViewProduct(item)}
                            >
                              {item.name}
                            </h5>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleBuyAgain(item)}
                                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Buy Again
                              </button>
                              {(selectedOrder.status === "Delivered" || selectedOrder.status === "Completed") && (
                                <button
                                  onClick={() => handleWriteReview(item)}
                                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Write Review
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-between">
                <button
                  onClick={() => handleContactSupport(selectedOrder)}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleReorder(selectedOrder)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reorder All Items
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {isReviewModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Write a Review</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedProduct.name}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= rating ? (
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        ) : (
                          <Star className="w-6 h-6 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Share your experience with this product..."
                  />
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;