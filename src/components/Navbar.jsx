import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Heart, 
  User, 
  Search,
  Phone,
  MapPin,
  LogOut,
  Package,
  Home,
  Info,
  Mail,
  Shield,
  Truck,
  Star,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [users, setUsers] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, cartCount, wishlistCount, isAuthenticated, logout} = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is admin
  useEffect(() => {
    // Check user role from auth context or user object
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingCart },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const profileItems = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Order History', path: '/orders', icon: Package },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlistCount },
    { name: 'Logout', path: '/logout', icon: LogOut },
  ];

  // Add admin dashboard item to profile dropdown if user is admin
  if (isAdmin) {
    profileItems.unshift({
      name: 'Admin Dashboard',
      path: '/admin/dashboard', // Consistent path
      icon: LayoutDashboard
    });
  }

  const quickLinks = [
    { name: 'Premium Collection', path: '/shop?category=premium' },
    { name: 'New Arrivals', path: '/shop?category=new' },
    { name: 'Sale Items', path: '/shop?category=sale' },
    { name: 'Best Sellers', path: '/shop?category=bestsellers' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      setIsAdmin(false); // Reset admin status on logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleQuickLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-3 h-3" />
              <span>(555) 123-4567</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <MapPin className="w-3 h-3" />
              <span>Free Shipping on Orders Over $75</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-3 h-3" />
              <span>Fast Delivery</span>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3" />
              <span>30-Day Money Back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-xl bg-white/95 backdrop-blur-sm' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                  <img 
                    src="src/assets/Vexo.jpg" 
                    alt="VEXO ICONIC Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    VEXO ICONIC
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Premium Materieals Arts</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Admin Dashboard Button - Only visible to admin */}
              {isAdmin && (
                <button
                  onClick={() => navigate("/admino")}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActiveRoute('/admino')
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}
            </div>

            {/* Desktop Search - Hidden by default, shown when icon clicked */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-lg mx-8 animate-slideDown">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products, categories, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center p-3 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-2xl transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <div className="relative">
                <Link
                  to={isAuthenticated ? "/wishlist" : "/login"}
                  className="flex items-center p-3 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 relative"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart */}
              <div className="relative">
                <Link
                  to={isAuthenticated ? "/cart" : "/login"}
                  className="flex items-center p-3 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                    alt={user?.username || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                  <span className="hidden lg:block font-medium">
                    {isAuthenticated 
                      ? (user?.username || 'Account')
                      : 'Login'
                    }
                  </span>
                </button>

                {/* Profile Dropdown - Only show when user is authenticated */}
                {isAuthenticated && isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
                      <p className="font-semibold text-gray-900 text-lg">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome Back!'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || 'No email provided'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isAdmin ? 'Administrator' : 'Premium Member'}
                        </span>
                        <span className="text-gray-500">
                          Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {profileItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const isLast = index === profileItems.length - 1;
                        const isAdminItem = item.name === 'Admin Dashboard';
                        
                        return (
                          <div key={item.name}>
                            {item.name === 'Logout' ? (
                              <button
                                onClick={handleLogout}
                                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition rounded-lg mx-2"
                              >
                                <div className="flex items-center">
                                  {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                                  {item.name}
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  navigate(item.path);
                                  setIsProfileDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-3 transition rounded-lg mx-2 ${
                                  isAdminItem 
                                    ? 'text-purple-700 hover:bg-purple-50 hover:text-purple-600' 
                                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                                }`}
                              >
                                <div className="flex items-center">
                                  {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                                  {item.name}
                                </div>
                                {item.badge > 0 && (
                                  <span className="bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            )}
                            {!isLast && <div className="border-b border-gray-100 mx-4"></div>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                      <div className="grid grid-cols-3 gap-4 text-center text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{cartCount}</div>
                          <div className="text-gray-500">In Cart</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{wishlistCount}</div>
                          <div className="text-gray-500">Wishlist</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">5</div>
                          <div className="text-gray-500">Orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-red-600 hover:bg-gray-100 p-3 rounded-2xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-2xl">
            <div className="container mx-auto px-4 py-6">
              
              {/* User Info Section */}
              {isAuthenticated && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                      alt={user?.firstName || 'User'}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome!'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || 'No email provided'}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-center text-xs">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="font-bold text-gray-900">{cartCount}</div>
                      <div className="text-gray-500">Cart</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="font-bold text-gray-900">{wishlistCount}</div>
                      <div className="text-gray-500">Wishlist</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="font-bold text-gray-900">5</div>
                      <div className="text-gray-500">Orders</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-2 mb-6">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActiveRoute(item.path)
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Admin Dashboard Mobile Button */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      navigate("/admino");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full text-left ${
                      isActiveRoute('/admin/dashboard')
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </div>

              {/* Quick Links */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 px-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleQuickLinkClick(link.path)}
                      className="text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <>
                    {profileItems.map((item) => {
                      const IconComponent = item.icon;
                      const isAdminItem = item.name === 'Admin Dashboard';
                      
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.name === 'Logout') {
                              handleLogout();
                            } else {
                              navigate(item.path);
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 transition rounded-xl ${
                            isAdminItem 
                              ? 'text-purple-700 hover:bg-purple-50 hover:text-purple-600' 
                              : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {IconComponent && <IconComponent className="w-5 h-5" />}
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {item.badge > 0 && (
                            <span className="bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Login / Register</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for profile dropdown */}
      {isProfileDropdownOpen && isAuthenticated && (
        <div
          className="fixed inset-0 z-40 bg-opacity-20"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;