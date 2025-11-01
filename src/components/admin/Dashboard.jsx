import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Calendar,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from db.json
      const response = await fetch('/db.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      const users = data.users || [];
      const products = data.products || [];
      
      // Extract orders from users (since orders are nested in user data)
      const allOrders = users.flatMap(user => 
        (user.orders || []).map(order => ({
          ...order,
          customerName: user.username || user.name || user.email,
          customerEmail: user.email
        }))
      );

      // Calculate stats
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const completedOrders = allOrders.filter(order => order.status === 'Shipped' || order.status === 'completed').length;
      const totalUsers = users.filter(user => user.role !== 'admin').length;
      
      const updatedStats = [
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          change: '+12%',
          trend: 'up',
          icon: <Users className="w-6 h-6" />,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-600',
          onClick: () => navigate('/admin/users')
        },
        {
          title: 'Total Products',
          value: products.length.toString(),
          change: '+5%',
          trend: 'up',
          icon: <Package className="w-6 h-6" />,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-600',
          onClick: () => navigate('/admin/products')
        },
        {
          title: 'Total Orders',
          value: allOrders.length.toString(),
          change: '+8%',
          trend: 'up',
          icon: <ShoppingCart className="w-6 h-6" />,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-600',
          onClick: () => navigate('/admin/orders')
        },
        {
          title: 'Revenue',
          value: `$${totalRevenue.toFixed(2)}`,
          change: '+15%',
          trend: 'up',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-600',
          onClick: () => navigate('/admin/analytics')
        }
      ];

      // Get recent orders (sorted by date)
      const recentOrdersData = allOrders
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          customer: order.customerName,
          product: order.items?.[0]?.name || 'Multiple Items',
          amount: `$${order.totalAmount?.toFixed(2) || '0.00'}`,
          status: order.status || 'processing',
          date: order.date ? new Date(order.date).toLocaleDateString() : 'N/A'
        }));

      // Get top products from order history
      const productSales = {};
      allOrders.forEach(order => {
        order.items?.forEach(item => {
          const productId = item.id;
          if (productId) {
            productSales[productId] = (productSales[productId] || 0) + (item.quantity || 1);
          }
        });
      });

      const topProductsData = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([productId, sales]) => {
          const product = products.find(p => p.id === productId);
          return product ? { ...product, sales } : null;
        })
        .filter(Boolean);

      // Generate recent activities from orders
      const activitiesData = allOrders
        .slice(0, 5)
        .map((order, index) => ({
          id: index + 1,
          type: 'order',
          message: `New order #${order.id} placed`,
          time: 'Recently',
          user: order.customerName
        }));

      // Generate revenue data based on time range
      const generateRevenueData = () => {
        const baseRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const avgOrderValue = allOrders.length > 0 ? baseRevenue / allOrders.length : 100;
        
        switch (timeRange) {
          case 'week':
            return Array.from({ length: 7 }, (_, i) => 40 + Math.random() * 60);
          case 'month':
            return Array.from({ length: 30 }, (_, i) => {
              const dayMultiplier = 0.8 + (Math.sin(i / 30 * Math.PI) * 0.4);
              return 50 + (Math.random() * 50 * dayMultiplier);
            });
          case 'quarter':
            return Array.from({ length: 12 }, (_, i) => 60 + Math.random() * 40);
          case 'year':
            return Array.from({ length: 12 }, (_, i) => {
              const monthMultiplier = 0.7 + (Math.sin(i / 12 * Math.PI) * 0.6);
              return 70 + (Math.random() * 30 * monthMultiplier);
            });
          default:
            return Array.from({ length: 7 }, (_, i) => 50 + Math.random() * 50);
        }
      };

      setStats(updatedStats);
      setRecentOrders(recentOrdersData);
      setTopProducts(topProductsData);
      setRecentActivities(activitiesData);
      setRevenueData(generateRevenueData());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard updated successfully');
  };

  const handleExportData = () => {
    const csvContent = [
      ['Metric', 'Value', 'Change', 'Date'],
      ...stats.map(stat => [stat.title, stat.value, stat.change, new Date().toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Dashboard data exported successfully!');
  };

  const handleViewOrderDetails = (OrderManagement) => {
    navigate(`/admin/OrderManagement`);
    toast.success(`Viewing order #${orderId}`);
  };

  const handleViewProductDetails = (ProductManagement) => {
    navigate(`/admin/ProductManagement`);
    toast.success(`Viewing product details`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': 
      case 'completed': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'user': return <Users className="w-4 h-4 text-green-500" />;
      case 'product': return <Package className="w-4 h-4 text-purple-500" />;
      case 'system': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const RevenueChart = () => {
    const maxHeight = Math.max(...revenueData);
    const totalRevenue = revenueData.reduce((sum, value) => sum + value * 10, 0);
    
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-end justify-between h-32">
            {revenueData.map((height, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-red-500 to-orange-500 rounded-t-lg transition-all duration-500 hover:from-red-400 hover:to-orange-400 cursor-pointer"
                  style={{ height: `${(height / maxHeight) * 100}%` }}
                  onClick={() => toast.success(`Revenue: $${(height * 10).toLocaleString()}`)}
                />
                <span className="text-xs text-gray-400">
                  {timeRange === 'week' ? `Day ${index + 1}` : 
                   timeRange === 'month' ? index + 1 :
                   timeRange === 'quarter' || timeRange === 'year' ? `M${index + 1}` : index + 1}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-300">
            <span>Current: ${totalRevenue.toLocaleString()}</span>
            <span className="text-green-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.2% from last period
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Admin! Here's what's happening with your store today.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-red-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
            onClick={stat.onClick}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? 
                      <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    }
                    {stat.change} from last period
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.time} • {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Recent Orders
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleExportData}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-lg hover:border-red-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
             
            </div>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {order.customer?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 cursor-pointer" onClick={() => handleViewOrderDetails(order.id)}>
                      {order.customer || 'Unknown Customer'}
                    </h3>
                    <p className="text-sm text-gray-600">{order.product}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {order.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.amount}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <button 
                      onClick={() => handleViewOrderDetails(order.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Top Selling Products
            </h2>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                onClick={() => handleViewProductDetails(product.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-bold w-6 text-center ${
                    index === 0 ? 'text-yellow-600' : 
                    index === 1 ? 'text-gray-600' : 
                    index === 2 ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {product.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-red-600">{product.name}</h3>
                    <p className="text-xs text-gray-600">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${product.price}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {product.sales} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;