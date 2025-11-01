// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { 
//   Package, Truck, CheckCircle, Clock, XCircle, Search,
//   Eye, RefreshCw, MapPin, CreditCard, Calendar,
//   ShoppingCart, MessageCircle, Star, Home
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// const Orders = () => {
//   const { user, updateUser } = useAuth();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [rating, setRating] = useState(0);
//   const [orders, setOrders] = useState([]);

//   // ✅ Fetch orders from both user data and global orders endpoint
//   useEffect(() => {
//     if (user) {
//       fetchAllOrders();
//     }
//   }, [user]);

//   const fetchAllOrders = async () => {
//     try {
//       setRefreshing(true);
      
//       // Fetch from global orders endpoint
//       const ordersResponse = await fetch('http://localhost:3000/orders');
//       let globalOrders = [];
      
//       if (ordersResponse.ok) {
//         globalOrders = await ordersResponse.json();
//       }
      
//       // Get user orders
//       const userOrders = user?.orders || [];
      
//       // Combine both sources, prioritizing global orders (more up-to-date)
//       const allOrders = [...globalOrders, ...userOrders];
      
//       // Remove duplicates based on order ID, prefer global orders
//       const uniqueOrders = allOrders.reduce((acc, order) => {
//         const existingOrder = acc.find(o => o.id === order.id);
//         if (!existingOrder) {
//           acc.push(order);
//         } else if (order.source === 'global') {
//           // Replace with global order if exists
//           const index = acc.findIndex(o => o.id === order.id);
//           acc[index] = order;
//         }
//         return acc;
//       }, []);
      
//       setOrders(uniqueOrders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to load orders');
//       // Fallback to user orders only
//       setOrders(user?.orders || []);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Enhanced refresh function
//   const handleRefreshOrders = async () => {
//     try {
//       setRefreshing(true);
      
//       // Refresh user data first
//       const userResponse = await fetch(`http://localhost:3000/users/${user.id}`);
//       if (userResponse.ok) {
//         const updatedUser = await userResponse.json();
//         updateUser(updatedUser);
//       }
      
//       // Then fetch all orders
//       await fetchAllOrders();
//       toast.success("Orders updated successfully");
//     } catch (error) {
//       console.error('Error refreshing orders:', error);
//       toast.error('Failed to refresh orders');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Enhanced cancel order function
//   const handleCancelOrder = async (order) => {
//     const canCancel = ["Processing", "Confirmed"].includes(order.status);
    
//     if (!canCancel) {
//       toast.error("This order can no longer be cancelled");
//       return;
//     }

//     if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
//       try {
//         // Update in global orders
//         await fetch(`http://localhost:3000/orders/${order.id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             status: "Cancelled",
//             cancelledDate: new Date().toLocaleDateString()
//           })
//         });

//         // Update in user orders
//         const updatedOrders = orders.map(o => 
//           o.id === order.id ? { 
//             ...o, 
//             status: "Cancelled",
//             cancelledDate: new Date().toLocaleDateString()
//           } : o
//         );

//         // Update user data
//         await fetch(`http://localhost:3000/users/${user.id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ orders: updatedOrders })
//         });

//         // Update local state
//         setOrders(updatedOrders);
//         updateUser({ ...user, orders: updatedOrders });
        
//         toast.success(`Order #${order.id} has been cancelled`);
//       } catch (error) {
//         console.error('Error cancelling order:', error);
//         toast.error('Failed to cancel order');
//       }
//     }
//   };

//   // ✅ Enhanced reorder function
//   const handleReorder = async (order) => {
//     try {
//       const cartItems = order.items.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         image: item.image,
//         quantity: item.quantity,
//         category: item.category,
//         description: item.description
//       }));

//       const updatedCart = [...(user.cart || []), ...cartItems];
      
//       const response = await fetch(`http://localhost:3000/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cart: updatedCart })
//       });

//       if (response.ok) {
//         const updatedUser = await response.json();
//         updateUser(updatedUser);
//         toast.success(`Added ${order.items.length} items from order #${order.id} to cart`);
//         setTimeout(() => navigateToCart(), 1000);
//       } else {
//         throw new Error('Failed to update cart');
//       }
//     } catch (error) {
//       console.error('Error reordering:', error);
//       toast.error('Failed to add items to cart');
//     }
//   };

//   // ✅ Enhanced buy again function
//   const handleBuyAgain = async (product) => {
//     try {
//       const cartItem = {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         quantity: 1,
//         category: product.category,
//         description: product.description
//       };

//       const updatedCart = [...(user.cart || []), cartItem];
      
//       const response = await fetch(`http://localhost:3000/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cart: updatedCart })
//       });

//       if (response.ok) {
//         const updatedUser = await response.json();
//         updateUser(updatedUser);
//         toast.success(`Added ${product.name} to cart`);
//         setTimeout(() => navigateToCart(), 500);
//       } else {
//         throw new Error('Failed to add item to cart');
//       }
//     } catch (error) {
//       console.error('Error buying again:', error);
//       toast.error('Failed to add item to cart');
//     }
//   };

//   // Rest of the helper functions remain the same...
//   const getStatusIcon = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch (statusLower) {
//       case "completed": 
//       case "delivered": 
//         return <CheckCircle className="w-5 h-5 text-green-600" />;
//       case "shipped": 
//         return <Truck className="w-5 h-5 text-blue-600" />;
//       case "processing": 
//       case "confirmed":
//         return <Package className="w-5 h-5 text-yellow-600" />;
//       case "cancelled": 
//         return <XCircle className="w-5 h-5 text-red-600" />;
//       default: 
//         return <Clock className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch (statusLower) {
//       case "completed": 
//       case "delivered": 
//         return "bg-green-100 text-green-800 border-green-200";
//       case "shipped": 
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "processing": 
//       case "confirmed":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "cancelled": 
//         return "bg-red-100 text-red-800 border-red-200";
//       default: 
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusText = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch (statusLower) {
//       case "completed": 
//       case "delivered": 
//         return "Delivered";
//       case "shipped": 
//         return "Shipped";
//       case "processing": 
//         return "Processing";
//       case "confirmed":
//         return "Confirmed";
//       case "cancelled": 
//         return "Cancelled";
//       default: 
//         return status || "Pending";
//     }
//   };

//   const navigateToProducts = () => navigate('/products');
//   const navigateToHome = () => navigate('/'); 
//   const navigateToCart = () => navigate('/cart');

//   const handleTrackPackage = (order) => {
//     if (order.trackingNumber) {
//       toast.success(`Tracking order #${order.id} - ${order.trackingNumber}`);
//       // In a real app, this would open tracking in new window
//       console.log(`Tracking order: ${order.id}`, order.trackingNumber);
//     } else {
//       toast.error("No tracking number available for this order");
//     }
//   };

//   const handleViewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const handleContactSupport = () => {
//     navigate('/support');
//   };

//   const handleWriteReview = (product) => {
//     setSelectedProduct(product);
//     setReviewText("");
//     setRating(0);
//     setIsReviewModalOpen(true);
//   };

//   const handleSubmitReview = async () => {
//     if (!reviewText.trim() || rating === 0) {
//       toast.error("Please provide both rating and review text");
//       return;
//     }

//     try {
//       const reviewData = {
//         productId: selectedProduct.id,
//         productName: selectedProduct.name,
//         rating: rating,
//         review: reviewText,
//         date: new Date().toISOString(),
//         userName: user.username
//       };

//       const response = await fetch(`http://localhost:3000/users/${user.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           reviews: [...(user.reviews || []), reviewData]
//         }),
//       });

//       if (response.ok) {
//         const updatedUser = await response.json();
//         updateUser(updatedUser);
//         toast.success(`Review submitted for ${selectedProduct.name}`);
//         setIsReviewModalOpen(false);
//         setSelectedProduct(null);
//         setReviewText("");
//         setRating(0);
//       } else {
//         throw new Error('Failed to submit review');
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       toast.error('Failed to submit review');
//     }
//   };

//   const handleViewProduct = (product) => {
//     navigate(`/product/${product.id}`);
//   };

//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = 
//       order.id?.toString().includes(searchTerm.toLowerCase()) ||
//       order.items?.some(item => 
//         item.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
    
//     const matchesStatus = 
//       statusFilter === "all" || 
//       order.status?.toLowerCase() === statusFilter.toLowerCase();
    
//     return matchesSearch && matchesStatus;
//   });

//   const getOrderCountByStatus = () => {
//     const counts = {
//       all: orders.length,
//       processing: orders.filter(o => 
//         o.status?.toLowerCase() === "processing" || 
//         o.status?.toLowerCase() === "confirmed"
//       ).length,
//       shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
//       delivered: orders.filter(o => 
//         o.status?.toLowerCase() === "delivered" || 
//         o.status?.toLowerCase() === "completed"
//       ).length,
//       cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
//     };
//     return counts;
//   };

//   const statusCounts = getOrderCountByStatus();

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p>Please log in to view your orders</p>
//         </div>
//       </div>
//     );
//   }

//   if (orders.length === 0 && !refreshing) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
//         <div className="max-w-md">
//           <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
//           <p className="text-gray-600 mb-6">
//             You haven't placed any orders yet. Start shopping to see your orders here!
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <button 
//               onClick={navigateToProducts}
//               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//             >
//               Start Shopping
//             </button>
//             <button 
//               onClick={navigateToHome}
//               className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
//             >
//               <Home className="w-4 h-4" />
//               Go Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
//             <p className="text-gray-600 mt-2">Track and manage your orders</p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={navigateToCart}
//               className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ShoppingCart className="w-4 h-4" />
//               <span>View Cart</span>
//             </button>
//             <button
//               onClick={handleRefreshOrders}
//               disabled={refreshing}
//               className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//               <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//           {Object.entries(statusCounts).map(([status, count]) => (
//             <div
//               key={status}
//               className={`bg-white p-4 rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
//                 statusFilter === status
//                   ? 'border-red-500 shadow-md'
//                   : 'border-transparent hover:border-gray-300'
//               }`}
//               onClick={() => setStatusFilter(status)}
//             >
//               <div className="text-2xl font-bold text-gray-900">{count}</div>
//               <div className="text-sm text-gray-600 capitalize">
//                 {status === 'all' ? 'All Orders' : status}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search orders by order ID or product name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               />
//             </div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>

//         {/* Orders Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredOrders.map((order) => (
//             <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//               {/* Order Header */}
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h3 className="font-semibold text-lg text-gray-900">Order #{order.id}</h3>
//                     <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//                       <Calendar className="w-4 h-4" />
//                       {order.date}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {getStatusIcon(order.status)}
//                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
//                       {getStatusText(order.status)}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
//                   <CreditCard className="w-4 h-4" />
//                   <span className="capitalize">{order.paymentMethod}</span>
//                 </div>

//                 {/* Tracking Info */}
//                 {order.trackingNumber && (
//                   <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
//                     <Truck className="w-4 h-4" />
//                     <span>Tracking: {order.trackingNumber}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Order Items */}
//               <div className="p-6">
//                 <div className="space-y-3">
//                   {order.items?.slice(0, 3).map((item, index) => (
//                     <div key={`${item.id}-${index}`} className="flex justify-between items-center">
//                       <div className="flex-1 flex items-center gap-3">
//                         <img 
//                           src={item.image} 
//                           alt={item.name}
//                           className="w-10 h-10 rounded-lg object-cover cursor-pointer"
//                           onClick={() => handleViewProduct(item)}
//                           onError={(e) => {
//                             e.target.src = "https://via.placeholder.com/40x40?text=No+Img";
//                           }}
//                         />
//                         <div>
//                           <div 
//                             className="text-sm font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-red-600"
//                             onClick={() => handleViewProduct(item)}
//                           >
//                             {item.name}
//                           </div>
//                           <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
//                         </div>
//                       </div>
//                       <span className="text-sm font-semibold text-gray-900">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
                  
//                   {order.items?.length > 3 && (
//                     <div className="text-sm text-gray-500 text-center pt-2 border-t">
//                       +{order.items.length - 3} more items
//                     </div>
//                   )}
//                 </div>

//                 {/* Order Total */}
//                 <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
//                   <span className="font-semibold text-gray-900">Total:</span>
//                   <span className="font-bold text-lg text-gray-900">
//                     ${order.totalAmount?.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               {/* Order Actions */}
//               <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => handleViewOrderDetails(order)}
//                     className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <Eye className="w-4 h-4" />
//                     <span>Details</span>
//                   </button>
                  
//                   {order.trackingNumber && (
//                     <button
//                       onClick={() => handleTrackPackage(order)}
//                       className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
//                     >
//                       <Truck className="w-4 h-4" />
//                       <span>Track</span>
//                     </button>
//                   )}
                  
//                   {(order.status === "Delivered" || order.status === "Completed") && (
//                     <button
//                       onClick={() => handleReorder(order)}
//                       className="flex items-center space-x-1 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
//                     >
//                       <RefreshCw className="w-4 h-4" />
//                       <span>Reorder All</span>
//                     </button>
//                   )}
                  
//                   {(order.status === "Processing" || order.status === "Confirmed") && (
//                     <button
//                       onClick={() => handleCancelOrder(order)}
//                       className="flex items-center space-x-1 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
//                     >
//                       <XCircle className="w-4 h-4" />
//                       <span>Cancel</span>
//                     </button>
//                   )}

//                   <button
//                     onClick={handleContactSupport}
//                     className="flex items-center space-x-1 px-3 py-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
//                   >
//                     <MessageCircle className="w-4 h-4" />
//                     <span>Support</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Rest of the component (modals, etc.) remains the same */}
//         {/* ... (keep all the modal code from your original component) ... */}
//       </div>
//     </div>
//   );
// };

// export default Orders;


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Package, Truck, CheckCircle, Clock, XCircle, Search,
  Eye, RefreshCw, MapPin, CreditCard, Calendar,
  ShoppingCart, MessageCircle, Star, Home
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
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders from both user data and global orders endpoint
  useEffect(() => {
    if (user) {
      fetchAllOrders();
    }
  }, [user]);

  const fetchAllOrders = async () => {
    try {
      setRefreshing(true);
      
      // Fetch from global orders endpoint (admin updates)
      const ordersResponse = await fetch('http://localhost:3000/orders');
      let globalOrders = [];
      
      if (ordersResponse.ok) {
        globalOrders = await ordersResponse.json();
        console.log('Global orders:', globalOrders);
      }
      
      // Get user orders from user data
      const userOrders = user?.orders || [];
      console.log('User orders:', userOrders);
      
      // Combine both sources, prioritizing global orders (admin updates)
      const allOrders = [...globalOrders, ...userOrders];
      
      // Remove duplicates based on order ID, prefer global orders (most up-to-date)
      const uniqueOrders = allOrders.reduce((acc, order) => {
        const existingOrderIndex = acc.findIndex(o => o.id === order.id);
        if (existingOrderIndex === -1) {
          acc.push(order);
        } else {
          // If order exists, prefer the one from global orders (admin updates)
          if (order.source === 'global' || !acc[existingOrderIndex].source) {
            acc[existingOrderIndex] = order;
          }
        }
        return acc;
      }, []);
      
      console.log('Final orders:', uniqueOrders);
      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      // Fallback to user orders only
      setOrders(user?.orders || []);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Enhanced refresh function
  const handleRefreshOrders = async () => {
    try {
      setRefreshing(true);
      
      // Refresh user data first
      const userResponse = await fetch(`http://localhost:3000/users/${user.id}`);
      if (userResponse.ok) {
        const updatedUser = await userResponse.json();
        updateUser(updatedUser);
      }
      
      // Then fetch all orders
      await fetchAllOrders();
      toast.success("Orders updated successfully");
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast.error('Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Enhanced cancel order function
  const handleCancelOrder = async (order) => {
    const canCancel = ["Processing", "Confirmed"].includes(order.status);
    
    if (!canCancel) {
      toast.error("This order can no longer be cancelled");
      return;
    }

    if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      try {
        // Update in global orders
        await fetch(`http://localhost:3000/orders/${order.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: "Cancelled",
            cancelledDate: new Date().toLocaleDateString()
          })
        });

        // Update in user orders
        const updatedOrders = orders.map(o => 
          o.id === order.id ? { 
            ...o, 
            status: "Cancelled",
            cancelledDate: new Date().toLocaleDateString()
          } : o
        );

        // Update user data
        await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: updatedOrders })
        });

        // Update local state
        setOrders(updatedOrders);
        updateUser({ ...user, orders: updatedOrders });
        
        toast.success(`Order #${order.id} has been cancelled`);
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Failed to cancel order');
      }
    }
  };

  // ✅ Enhanced reorder function
  const handleReorder = async (order) => {
    try {
      const cartItems = order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        category: item.category,
        description: item.description
      }));

      const updatedCart = [...(user.cart || []), ...cartItems];
      
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: updatedCart })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(`Added ${order.items.length} items from order #${order.id} to cart`);
        setTimeout(() => navigateToCart(), 1000);
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to add items to cart');
    }
  };

  // ✅ Enhanced buy again function
  const handleBuyAgain = async (product) => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category,
        description: product.description
      };

      const updatedCart = [...(user.cart || []), cartItem];
      
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: updatedCart })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(`Added ${product.name} to cart`);
        setTimeout(() => navigateToCart(), 500);
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error buying again:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed": 
      case "delivered": 
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped": 
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing": 
      case "confirmed":
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "cancelled": 
        return <XCircle className="w-5 h-5 text-red-600" />;
      default: 
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed": 
      case "delivered": 
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped": 
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing": 
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": 
        return "bg-red-100 text-red-800 border-red-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed": 
      case "delivered": 
        return "Delivered";
      case "shipped": 
        return "Shipped";
      case "processing": 
        return "Processing";
      case "confirmed":
        return "Confirmed";
      case "cancelled": 
        return "Cancelled";
      default: 
        return status || "Pending";
    }
  };

  const navigateToProducts = () => navigate('/products');
  const navigateToHome = () => navigate('/'); 
  const navigateToCart = () => navigate('/cart');

  const handleTrackPackage = (order) => {
    if (order.trackingNumber) {
      toast.success(`Tracking order #${order.id} - ${order.trackingNumber}`);
      // In a real app, this would open tracking in new window
      console.log(`Tracking order: ${order.id}`, order.trackingNumber);
    } else {
      toast.error("No tracking number available for this order");
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleContactSupport = () => {
    navigate('/support');
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
      const reviewData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        rating: rating,
        review: reviewText,
        date: new Date().toISOString(),
        userName: user.username
      };

      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
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

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
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
      processing: orders.filter(o => 
        o.status?.toLowerCase() === "processing" || 
        o.status?.toLowerCase() === "confirmed"
      ).length,
      shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
      delivered: orders.filter(o => 
        o.status?.toLowerCase() === "delivered" || 
        o.status?.toLowerCase() === "completed"
      ).length,
      cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
    };
    return counts;
  };

  const statusCounts = getOrderCountByStatus();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to view your orders</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && !refreshing) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
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

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
                    <Truck className="w-4 h-4" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
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
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40x40?text=No+Img";
                          }}
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
                  
                  {order.trackingNumber && (
                    <button
                      onClick={() => handleTrackPackage(order)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Track</span>
                    </button>
                  )}
                  
                  {(order.status === "Delivered" || order.status === "Completed") && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reorder All</span>
                    </button>
                  )}
                  
                  {(order.status === "Processing" || order.status === "Confirmed") && (
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}

                  <button
                    onClick={handleContactSupport}
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

        {/* View Order Details Modal */}
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
                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">#{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedOrder.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Payment & Total</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg">${selectedOrder.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                {selectedOrder.shippingDetails && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Full Name:</strong> {selectedOrder.shippingDetails.fullName}</p>
                        <p><strong>Email:</strong> {selectedOrder.shippingDetails.email}</p>
                        <p><strong>Address:</strong> {selectedOrder.shippingDetails.address}</p>
                        <p><strong>City:</strong> {selectedOrder.shippingDetails.city}</p>
                        <p><strong>Postal Code:</strong> {selectedOrder.shippingDetails.postalCode}</p>
                        {selectedOrder.shippingDetails.phone && (
                          <p><strong>Phone:</strong> {selectedOrder.shippingDetails.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items ({selectedOrder.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                          onClick={() => handleViewProduct(item)}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64x64?text=No+Img";
                          }}
                        />
                        <div className="flex-1">
                          <h5 
                            className="font-medium text-gray-900 cursor-pointer hover:text-red-600"
                            onClick={() => handleViewProduct(item)}
                          >
                            {item.name}
                          </h5>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="text-sm text-gray-600">Price: ${item.price}</span>
                            {item.category && (
                              <span className="text-sm text-gray-600">Category: {item.category}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </p>
                          {(selectedOrder.status === "Delivered" || selectedOrder.status === "Completed") && (
                            <button
                              onClick={() => handleBuyAgain(item)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Buy Again
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Information */}
                {selectedOrder.trackingNumber && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Tracking Information</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Tracking Number:</strong> {selectedOrder.trackingNumber}
                      </p>
                      {selectedOrder.shippedDate && (
                        <p className="text-sm text-blue-800 mt-1">
                          <strong>Shipped Date:</strong> {selectedOrder.shippedDate}
                        </p>
                      )}
                      {selectedOrder.deliveredDate && (
                        <p className="text-sm text-green-800 mt-1">
                          <strong>Delivered Date:</strong> {selectedOrder.deliveredDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={handleContactSupport}
                    className="flex items-center space-x-2 px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Close
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
                <p className="text-sm text-gray-600 mt-1">for {selectedProduct.name}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= rating ? (
                          <Star className="w-8 h-8 text-yellow-400 fill-current" />
                        ) : (
                          <Star className="w-8 h-8 text-gray-300" />
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
                  onClick={() => setIsReviewModalOpen(false)}
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