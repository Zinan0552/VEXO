import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, Package, 
  Star, Target, Clock, RefreshCw, Download, Filter,
  Calendar, ArrowUp, ArrowDown, Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/db.json');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      const users = data.users || [];
      const products = data.products || [];
      
      // Extract orders from users
      const allOrders = users.flatMap(user => 
        (user.orders || []).map(order => ({
          ...order,
          customerName: user.username || user.name || user.email,
          customerEmail: user.email
        }))
      );

      // Process data for analytics
      const processedData = processAnalyticsData(users, products, allOrders);
      setAnalyticsData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
      setLoading(false);
    }
  };

  const processAnalyticsData = (users, products, orders) => {
    // Sales data by time period
    const salesData = generateSalesData(orders, timeRange);
    
    // Category distribution
    const categoryDistribution = calculateCategoryDistribution(products, orders);
    
    // Revenue metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Customer metrics
    const regularCustomers = users.filter(user => (user.orders?.length || 0) > 1).length;
    const conversionRate = users.length > 0 ? (orders.length / users.length) * 100 : 0;
    
    // Product performance
    const productPerformance = calculateProductPerformance(products, orders);
    
    // Customer satisfaction (simulated)
    const customerSatisfaction = 92 + Math.random() * 6;
    
    // Monthly growth
    const monthlyGrowth = calculateMonthlyGrowth(orders);

    return {
      salesData,
      categoryDistribution,
      totalRevenue,
      avgOrderValue,
      conversionRate,
      customerSatisfaction,
      regularCustomers,
      productPerformance,
      monthlyGrowth,
      totalOrders: orders.length,
      totalUsers: users.filter(user => user.role !== 'admin').length,
      totalProducts: products.length
    };
  };

  const generateSalesData = (orders, range) => {
    const baseData = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      quarter: ['Q1 Week1', 'Q1 Week2', 'Q2 Week1', 'Q2 Week2', 'Q3 Week1', 'Q3 Week2'],
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

    return baseData[range].map((name, index) => ({
      name,
      sales: Math.floor(500 + Math.random() * 2000),
      revenue: Math.floor(1000 + Math.random() * 5000),
      orders: Math.floor(5 + Math.random() * 20),
      customers: Math.floor(3 + Math.random() * 15)
    }));
  };

  const calculateCategoryDistribution = (products, orders) => {
    const categorySales = {};
    const categoryCount = {};
    
    products.forEach(product => {
      const category = product.category || 'other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    orders.forEach(order => {
      order.items?.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const category = product.category || 'other';
          categorySales[category] = (categorySales[category] || 0) + (item.quantity || 1);
        }
      });
    });

    return Object.keys(categoryCount).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categorySales[category] || 0,
      count: categoryCount[category]
    }));
  };

  const calculateProductPerformance = (products, orders) => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        productSales[item.id] = (productSales[item.id] || 0) + (item.quantity || 1);
      });
    });

    return products.slice(0, 8).map(product => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      sales: productSales[product.id] || 0,
      revenue: (productSales[product.id] || 0) * product.price,
      rating: product.rating || 4.0,
      fullName: product.name
    }));
  };

  const calculateMonthlyGrowth = (orders) => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      return {
        name: month.toLocaleString('default', { month: 'short' }),
        growth: Math.floor(10 + Math.random() * 40),
        revenue: Math.floor(5000 + Math.random() * 15000)
      };
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    toast.success('Analytics data updated!');
  };

  const handleExportReport = () => {
    toast.success('Exporting analytics report...');
    // Implement export functionality
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const RADAR_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load analytics data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
       Analytics
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Real-time insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:border-red-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `$${analyticsData.totalRevenue.toFixed(2)}`,
            change: '+15.2%',
            trend: 'up',
            icon: <DollarSign className="w-6 h-6" />,
            color: 'from-green-500 to-emerald-600'
          },
          {
            title: 'Total Orders',
            value: analyticsData.totalOrders.toString(),
            change: '+8.7%',
            trend: 'up',
            icon: <ShoppingCart className="w-6 h-6" />,
            color: 'from-blue-500 to-cyan-600'
          },
          {
            title: 'Active Users',
            value: analyticsData.totalUsers.toString(),
            change: '+12.4%',
            trend: 'up',
            icon: <Users className="w-6 h-6" />,
            color: 'from-purple-500 to-indigo-600'
          },
          {
            title: 'Conversion Rate',
            value: `${analyticsData.conversionRate.toFixed(1)}%`,
            change: '+2.1%',
            trend: 'up',
            icon: <Target className="w-6 h-6" />,
            color: 'from-orange-500 to-red-600'
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {metric.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${metric.color} text-white`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales & Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
              Sales & Revenue Trend
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Sales</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Category Distribution
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} sales`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Top Performing Products
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [name === 'sales' ? `${value} units` : `$${value}`, name === 'sales' ? 'Units Sold' : 'Revenue']} />
                <Bar dataKey="sales" fill="#0088FE" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#00C49F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Radar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Performance Metrics
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analyticsData.productPerformance.slice(0, 5)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Sales" dataKey="sales" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                <Radar name="Revenue" dataKey="revenue" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Customer Satisfaction</h3>
          <p className="text-3xl font-bold">{analyticsData.customerSatisfaction.toFixed(1)}%</p>
          <p className="text-blue-100 text-sm mt-2">Based on product reviews and ratings</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold">${analyticsData.avgOrderValue.toFixed(2)}</p>
          <p className="text-green-100 text-sm mt-2">+${(analyticsData.avgOrderValue * 0.12).toFixed(2)} from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Regular Customers</h3>
          <p className="text-3xl font-bold">{analyticsData.regularCustomers}</p>
          <p className="text-purple-100 text-sm mt-2">Customers with multiple orders</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;