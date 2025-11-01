
import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Truck, CheckCircle, Edit, X, Save, Download, 
  Loader, RefreshCw, User, Mail, MapPin, CreditCard, Calendar,
  MessageCircle, Phone, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // ✅ Fetch orders from both users and global orders endpoint
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch from global orders endpoint
      const ordersResponse = await fetch('http://localhost:3000/orders');
      let globalOrders = [];
      
      if (ordersResponse.ok) {
        globalOrders = await ordersResponse.json();
      }
      
      // Also fetch from users to get complete order data
      const usersResponse = await fetch('http://localhost:3000/users');
      const users = await usersResponse.json();
      
      const userOrders = users.flatMap(user => 
        (user.orders || []).map(order => ({
          ...order,
          userId: user.id,
          userEmail: user.email,
          userName: user.username || user.name,
          userPhone: user.phone,
          userAvatar: user.avatar,
          source: 'user' // Mark where this order came from
        }))
      );
      
      // Combine both sources, prioritizing user orders (more complete data)
      const allOrders = [...globalOrders, ...userOrders];
      
      // Remove duplicates based on order ID
      const uniqueOrders = allOrders.reduce((acc, order) => {
        if (!acc.find(o => o.id === order.id)) {
          acc.push(order);
        }
        return acc;
      }, []);
      
      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Find which user owns this order
  const findOrderOwner = async (orderId) => {
    try {
      const usersResponse = await fetch('http://localhost:3000/users');
      const users = await usersResponse.json();
      
      for (const user of users) {
        if (user.orders && user.orders.some(order => order.id === orderId)) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding order owner:', error);
      return null;
    }
  };

  // ✅ Update order in both user data and global orders
  const updateOrder = async (orderId, updatedData) => {
    try {
      setUpdatingOrder(true);
      
      // 1. Find the user who owns this order
      const orderOwner = await findOrderOwner(orderId);
      
      if (orderOwner) {
        // 2. Update in user's orders array
        const updatedUserOrders = orderOwner.orders.map(order => 
          order.id === orderId ? { ...order, ...updatedData } : order
        );
        
        await fetch(`http://localhost:3000/users/${orderOwner.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: updatedUserOrders })
        });
        
        console.log(`✅ Updated order ${orderId} in user ${orderOwner.id}`);
      }

      // 3. Update in global orders endpoint
      const globalOrderResponse = await fetch(`http://localhost:3000/orders/${orderId}`);
      if (globalOrderResponse.ok) {
        await fetch(`http://localhost:3000/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        console.log(`✅ Updated order ${orderId} in global orders`);
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    } finally {
      setUpdatingOrder(false);
    }
  };

  // ✅ Update multiple orders (for bulk operations)
  const updateMultipleOrders = async (orderIds, updatedData) => {
    try {
      setUpdatingOrder(true);
      
      const usersResponse = await fetch('http://localhost:3000/users');
      const users = await usersResponse.json();
      
      // Update in each user's orders
      for (const user of users) {
        if (user.orders) {
          const hasRelevantOrders = user.orders.some(order => 
            orderIds.includes(order.id)
          );
          
          if (hasRelevantOrders) {
            const updatedUserOrders = user.orders.map(order => 
              orderIds.includes(order.id) ? { ...order, ...updatedData } : order
            );
            
            await fetch(`http://localhost:3000/users/${user.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orders: updatedUserOrders })
            });
            
            console.log(`✅ Updated ${orderIds.length} orders in user ${user.id}`);
          }
        }
      }

      // Update in global orders
      for (const orderId of orderIds) {
        const globalOrderResponse = await fetch(`http://localhost:3000/orders/${orderId}`);
        if (globalOrderResponse.ok) {
          await fetch(`http://localhost:3000/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
        }
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating multiple orders:', error);
      throw error;
    } finally {
      setUpdatingOrder(false);
    }
  };

  const navigateToDashboard = () => navigate('/admino');

  const handleRefreshOrders = async () => {
    setRefreshing(true);
    await fetchAllOrders();
    setRefreshing(false);
    toast.success('Orders refreshed successfully');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': 
      case 'Delivered': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': 
      case 'Delivered': 
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Processing': 
        return <Loader className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'Shipped': 
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Cancelled': 
        return <X className="w-4 h-4 text-red-600" />;
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: 
        return <Loader className="w-4 h-4 text-gray-600" />;
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const markAsShipped = async (order) => {
    if (!newTrackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      const updatedData = {
        status: 'Shipped',
        trackingNumber: newTrackingNumber,
        shippedDate: new Date().toLocaleDateString()
      };

      await updateOrder(order.id, updatedData);
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, ...updatedData } : o
      ));
      
      toast.success(`Order #${order.id} marked as shipped`);
      setNewTrackingNumber('');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const markAsCompleted = async (order) => {
    try {
      const updatedData = {
        status: 'Completed',
        deliveredDate: new Date().toLocaleDateString()
      };

      await updateOrder(order.id, updatedData);
      
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, ...updatedData } : o
      ));
      
      toast.success(`Order #${order.id} marked as completed`);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const markAsDelivered = async (order) => {
    try {
      const updatedData = {
        status: 'Delivered',
        deliveredDate: new Date().toLocaleDateString()
      };

      await updateOrder(order.id, updatedData);
      
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, ...updatedData } : o
      ));
      
      toast.success(`Order #${order.id} marked as delivered`);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const cancelOrder = async (order) => {
    if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      try {
        const updatedData = {
          status: 'Cancelled',
          cancelledDate: new Date().toLocaleDateString()
        };

        await updateOrder(order.id, updatedData);
        
        setOrders(orders.map(o => 
          o.id === order.id ? { ...o, ...updatedData } : o
        ));
        
        toast.success(`Order #${order.id} has been cancelled`);
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const saveOrderUpdate = async (updatedOrder) => {
    try {
      const { source, ...orderData } = updatedOrder; // Remove source field
      await updateOrder(updatedOrder.id, orderData);
      
      setOrders(orders.map(o => 
        o.id === updatedOrder.id ? { ...o, ...orderData } : o
      ));
      
      toast.success(`Order #${updatedOrder.id} updated successfully`);
      setIsEditModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const openEditModal = (order) => {
    setEditingOrder({...order});
    setIsEditModalOpen(true);
  };

  const openShippingModal = (order) => {
    setSelectedOrder(order);
    setNewTrackingNumber(order.trackingNumber || '');
    setIsEditModalOpen(true);
  };

  const contactCustomer = (order) => {
    toast.success(`Contacting customer: ${order.userName}`);
    window.open(`mailto:${order.userEmail}?subject=Regarding Order #${order.id}`, '_blank');
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Products', 'Total Amount', 'Status', 'Order Date', 'Payment Method', 'Tracking Number', 'Shipping Address'],
      ...filteredOrders.map(order => [
        order.id,
        order.userName,
        order.userEmail,
        order.userPhone || 'N/A',
        order.items?.map(item => `${item.name} (Qty: ${item.quantity})`).join('; '),
        `$${order.totalAmount}`,
        order.status,
        order.date,
        order.paymentMethod,
        order.trackingNumber || 'N/A',
        order.shippingDetails ? `${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.postalCode}` : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Orders exported successfully');
  };

  const getStatusCounts = () => {
    const counts = {
      All: orders.length,
      Processing: orders.filter(o => o.status === 'Processing').length,
      Confirmed: orders.filter(o => o.status === 'Confirmed').length,
      Shipped: orders.filter(o => o.status === 'Shipped').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Completed: orders.filter(o => o.status === 'Completed').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={navigateToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefreshOrders}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={exportOrders}
            disabled={filteredOrders.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              filteredOrders.length === 0 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div 
            key={status}
            className={`bg-white p-4 rounded-lg shadow-md border-2 cursor-pointer transition-all ${
              statusFilter === status 
                ? 'border-red-500 shadow-lg' 
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <div className="text-2xl font-bold text-gray-800">{count}</div>
            <div className="text-sm text-gray-600 capitalize">
              {status === 'All' ? 'Total Orders' : status}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by order ID, customer name, email, or product..."
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
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={`${order.userId}-${order.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {order.userAvatar ? (
                        <img 
                          src={order.userAvatar} 
                          alt={order.userName}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/32x32?text=User";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items?.length || 0} items
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                      {order.items?.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewOrderDetails(order)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openShippingModal(order)}
                        disabled={['Shipped', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)}
                        className={`p-1 rounded transition-colors ${
                          ['Shipped', 'Delivered', 'Completed', 'Cancelled'].includes(order.status)
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                        title="Mark as Shipped"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => markAsDelivered(order)}
                        disabled={!['Shipped'].includes(order.status)}
                        className={`p-1 rounded transition-colors ${
                          !['Shipped'].includes(order.status)
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-purple-600 hover:text-purple-900 hover:bg-purple-50'
                        }`}
                        title="Mark as Delivered"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => markAsCompleted(order)}
                        disabled={!['Delivered'].includes(order.status)}
                        className={`p-1 rounded transition-colors ${
                          !['Delivered'].includes(order.status)
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50'
                        }`}
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditModal(order)}
                        className="p-1 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => contactCustomer(order)}
                        className="p-1 text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50 rounded transition-colors"
                        title="Contact Customer"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No orders found</div>
            <div className="text-gray-500 text-sm mt-2">
              {searchTerm || statusFilter !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'No orders in the system'
              }
            </div>
          </div>
        )}
      </div>

      {/* View Order Modal */}
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
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedOrder.userEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedOrder.userPhone || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
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
                        {selectedOrder.status}
                      </span>
                    </div>
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
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64x64?text=No+Img";
                        }}
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
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
                  onClick={() => contactCustomer(selectedOrder)}
                  className="flex items-center space-x-2 px-4 py-2 text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Customer</span>
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(selectedOrder);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Shipping Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingOrder ? 'Edit Order' : 'Mark as Shipped'}
                </h3>
                <button 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingOrder(null);
                    setNewTrackingNumber('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {editingOrder ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={editingOrder.trackingNumber || ''}
                      onChange={(e) => setEditingOrder({...editingOrder, trackingNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Tracking Number for Order #{selectedOrder?.id}
                  </label>
                  <input
                    type="text"
                    value={newTrackingNumber}
                    onChange={(e) => setNewTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tracking number..."
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingOrder(null);
                  setNewTrackingNumber('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editingOrder ? saveOrderUpdate(editingOrder) : markAsShipped(selectedOrder)}
                disabled={updatingOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:bg-red-400"
              >
                {updatingOrder ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingOrder ? 'Update Order' : 'Mark as Shipped'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;