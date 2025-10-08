// import React, { useState, useEffect } from 'react';
// import { 
//   Menu, 
//   X, 
//   ShoppingCart, 
//   Heart, 
//   User, 
//   Search,
//   Phone,
//   MapPin,
//   LogOut,
//   Package
// } from 'lucide-react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const navigate = useNavigate();

//   // Use AuthContext to get real cart and wishlist counts
//   const { user, cartCount, wishlistCount, isAuthenticated, logout } = useAuth();

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navigationItems = [
//     { name: 'Shop', path: '/shop' },
//     { name: 'About', path: '/about' },
//     { name: 'Contact', path: '/contact' },
//   ];

//   const profileItems = [
//     { name: 'My Profile', path: '/profile', icon: User },
//     { name: 'Order History', path: '/orders', icon: Package },
//     { name: 'Logout', path: '/logout', icon: LogOut },
//   ];

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery('');
//       setShowSearch(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsProfileDropdownOpen(false);
//       navigate('/');
//       // toast.success('Logged out successfully!'); // You can add toast notification if needed
//     } catch (error) {
//       console.error('Logout failed:', error);
//       // toast.error('Failed to logout!');
//     }
//   };

//   const handleProfileClick = () => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }
//     setIsProfileDropdownOpen(!isProfileDropdownOpen);
//   };

//   return (
//     <>
//       {/* Top Bar */}
//       <div className="bg-red-600 text-white py-2 px-4 text-sm">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center space-x-6">
//             <div className="flex items-center space-x-1">
//               <Phone className="w-3 h-3" />
//               <span>(555) 123-4567</span>
//             </div>
//             <div className="hidden md:flex items-center space-x-1">
//               <MapPin className="w-3 h-3" />
//               <span>Free Shipping on Orders Over $75</span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <span>30-Day Money Back Guarantee</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation */}
//       <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'shadow-xl' : ''
//       }`}>
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center py-4">
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link to="/" className="flex items-center">
//                 <h1 className="text-2xl font-bold text-red-600">VEXO ICONIC</h1>
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center space-x-8">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`font-medium transition duration-200 ${
//                     item.current 
//                       ? 'text-red-600 border-b-2 border-red-600' 
//                       : 'text-gray-700 hover:text-red-600'
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>

//             {/* Desktop Search - Hidden by default, shown when icon clicked */}
//             {showSearch && (
//               <div className="hidden md:flex flex-1 max-w-lg mx-8 animate-slideDown">
//                 <form onSubmit={handleSearch} className="relative w-full">
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     autoFocus
//                   />
//                   <button
//                     type="submit"
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
//                   >
//                     <Search className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowSearch(false)}
//                     className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Action Icons */}
//             <div className="flex items-center space-x-6">
//               {/* Search Icon - Desktop */}
//               <div className="hidden md:block">
//                 <button
//                   onClick={() => setShowSearch(!showSearch)}
//                   className="flex items-center text-gray-700 hover:text-red-600 transition relative"
//                 >
//                   <Search className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Wishlist */}
//               <div className="relative">
//                 <Link
//                   to="/wishlist"
//                   className="flex items-center text-gray-700 hover:text-red-600 transition relative"
//                 >
//                   <Heart className="w-6 h-6" />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
//                       {wishlistCount}
//                     </span>
//                   )}
//                 </Link>
//               </div>

//               {/* Cart */}
//               <div className="relative">
//                 <Link
//                   to="/cart"
//                   className="flex items-center text-gray-700 hover:text-red-600 transition relative"
//                 >
//                   <ShoppingCart className="w-6 h-6" />
//                   {cartCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
//                       {cartCount}
//                     </span>
//                   )}
//                 </Link>
//               </div>

//               {/* Profile */}
//               <div className="relative">
//                 <button
//                   onClick={handleProfileClick}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
//                 >
//                   <img
//                     src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
//                     alt={user?.firstName || 'User'}
//                     className="w-8 h-8 rounded-full border-2 border-gray-300"
//                   />
//                   <span className="hidden lg:block font-medium">
//                     {isAuthenticated 
//                       ? (user?.firstName ? `${user.firstName} ${user.lastName}` : 'User')
//                       : 'Login'
//                     }
//                   </span>
//                 </button>

//                 {/* Profile Dropdown - Only show when user is authenticated */}
//                 {isAuthenticated && isProfileDropdownOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="font-semibold text-gray-900">
//                         {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
//                       </p>
//                       <p className="text-sm text-gray-500 truncate">
//                         {user?.email || 'No email provided'}
//                       </p>
//                     </div>
                    
//                     {profileItems.map((item) => {
//                       const IconComponent = item.icon;
//                       return (
//                         <div key={item.name}>
//                           {item.name === 'Logout' ? (
//                             <button
//                               onClick={handleLogout}
//                               className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100 last:border-b-0"
//                             >
//                               {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
//                               {item.name}
//                             </button>
//                           ) : (
//                             <Link
//                               to={item.path}
//                               className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100 last:border-b-0"
//                               onClick={() => setIsProfileDropdownOpen(false)}
//                             >
//                               {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
//                               {item.name}
//                             </Link>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="lg:hidden text-gray-700 hover:text-red-600 transition"
//               >
//                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Search Bar - Always visible on mobile */}
//           <div className="md:hidden pb-4">
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
//               >
//                 <Search className="w-5 h-5" />
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden bg-white border-t border-gray-200">
//             <div className="container mx-auto px-4 py-4">
//               <div className="flex flex-col space-y-4">
//                 {navigationItems.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className="font-medium text-gray-700 hover:text-red-600 transition py-2 border-b border-gray-100"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}

//                 {/* Mobile Action Links */}
//                 <div className="pt-4 border-t border-gray-200">
//                   {isAuthenticated ? (
//                     <>
//                       <div className="px-2 py-3 border-b border-gray-100 mb-2">
//                         <p className="font-semibold text-gray-900">
//                           {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate">
//                           {user?.email || 'No email provided'}
//                         </p>
//                       </div>
//                       <Link
//                         to="/profile"
//                         className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
//                         onClick={() => setIsMobileMenuOpen(false)}
//                       >
//                         <User className="w-5 h-5 mr-3" />
//                         My Profile
//                       </Link>
//                       <Link
//                         to="/orders"
//                         className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
//                         onClick={() => setIsMobileMenuOpen(false)}
//                       >
//                         <Package className="w-5 h-5 mr-3" />
//                         Order History
//                       </Link>
//                     </>
//                   ) : (
//                     <Link
//                       to="/login"
//                       className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                     >
//                       <User className="w-5 h-5 mr-3" />
//                       Login
//                     </Link>
//                   )}
                  
//                   <Link
//                     to="/wishlist"
//                     className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     <Heart className="w-5 h-5 mr-3" />
//                     Wishlist
//                     {wishlistCount > 0 && (
//                       <span className="ml-auto bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
//                         {wishlistCount}
//                       </span>
//                     )}
//                   </Link>
//                   <Link
//                     to="/cart"
//                     className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     <ShoppingCart className="w-5 h-5 mr-3" />
//                     Cart
//                     {cartCount > 0 && (
//                       <span className="ml-auto bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
//                         {cartCount}
//                       </span>
//                     )}
//                   </Link>
                  
//                   {isAuthenticated && (
//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         setIsMobileMenuOpen(false);
//                       }}
//                       className="flex items-center w-full font-medium text-gray-700 hover:text-red-600 transition py-2"
//                     >
//                       <LogOut className="w-5 h-5 mr-3" />
//                       Logout
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Overlay for profile dropdown */}
//       {isProfileDropdownOpen && isAuthenticated && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setIsProfileDropdownOpen(false)}
//         />
//       )}

//       {/* Overlay for search (on mobile when search is expanded) */}
//       {showSearch && (
//         <div
//           className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
//           onClick={() => setShowSearch(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

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
  Package
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // Use AuthContext to get real cart and wishlist counts
  const { user, cartCount, wishlistCount, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const profileItems = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Order History', path: '/orders', icon: Package },
    { name: 'Logout', path: '/logout', icon: LogOut },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    // Check if user exists in localStorage directly for immediate response
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
    
    if (!isLoggedIn || !storedUser) {
      navigate('/login');
      return;
    }
    
    // User is authenticated, toggle dropdown
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Check authentication status directly from localStorage
  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
    return isLoggedIn && storedUser;
  };

  const isUserAuthenticated = checkAuthStatus();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>(555) 123-4567</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Free Shipping on Orders Over $75</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>30-Day Money Back Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-red-600">VEXO ICONIC</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition duration-200 ${
                    item.current 
                      ? 'text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Search - Hidden by default, shown when icon clicked */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-lg mx-8 animate-slideDown">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              {/* Search Icon - Desktop */}
              <div className="hidden md:block">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center text-gray-700 hover:text-red-600 transition relative"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>

              {/* Wishlist */}
              <div className="relative">
                <Link
                  to="/wishlist"
                  className="flex items-center text-gray-700 hover:text-red-600 transition relative"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart */}
              <div className="relative">
                <Link
                  to="/cart"
                  className="flex items-center text-gray-700 hover:text-red-600 transition relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                    alt={user?.username || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                  />
                  <span className="hidden lg:block font-medium">
                    {isUserAuthenticated 
                      ? (user?.username || 'User')
                      : 'Login'
                    }
                  </span>
                </button>

                {/* Profile Dropdown - Only show when user is authenticated */}
                {isUserAuthenticated && isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email }
                      </p>
                    </div>
                    
                    {profileItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.name}>
                          {item.name === 'Logout' ? (
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100 last:border-b-0"
                            >
                              {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100 last:border-b-0"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                              {item.name}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-red-600 transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Always visible on mobile */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="font-medium text-gray-700 hover:text-red-600 transition py-2 border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Action Links */}
                <div className="pt-4 border-t border-gray-200">
                  {isUserAuthenticated ? (
                    <>
                      <div className="px-2 py-3 border-b border-gray-100 mb-2">
                        <p className="font-semibold text-gray-900">
                          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || 'No email provided'}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5 mr-3" />
                        Order History
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Login
                    </Link>
                  )}
                  
                  <Link
                    to="/wishlist"
                    className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center font-medium text-gray-700 hover:text-red-600 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  {isUserAuthenticated && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full font-medium text-gray-700 hover:text-red-600 transition py-2"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for profile dropdown */}
      {isProfileDropdownOpen && isUserAuthenticated && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}

      {/* Overlay for search (on mobile when search is expanded) */}
      {showSearch && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowSearch(false)}
        />
      )}
    </>
  );
};

export default Navbar;