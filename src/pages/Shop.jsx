// import React, { useState, useEffect } from "react";
// import { ShoppingCart, Heart, Eye, Star, Zap, X, SlidersHorizontal } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// const Shop = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState("featured");
//   const [inStockOnly, setInStockOnly] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const navigate = useNavigate();

//   const {
//     user,
//     addToCart,
//     addToWishlist,
//     isInWishlist,
//     isAuthenticated,
//   } = useAuth();

//   // Get unique categories
//   const categories = ["all", ...new Set(products.map(product => product.category))];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/db.json");
//         const data = await response.json();
//         setProducts(data.products || []);
//         setFilteredProducts(data.products || []);
        
//         // Set max price from actual products
//         const maxPrice = Math.max(...data.products.map(p => p.price));
//         setPriceRange([0, Math.ceil(maxPrice)]);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Apply filters whenever filter criteria change
//   useEffect(() => {
//     applyFilters();
//   }, [products, selectedCategory, priceRange, minRating, sortBy, inStockOnly]);

//   const applyFilters = () => {
//     let filtered = products.filter((product) => {
//       const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
//       const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
//       const matchesRating = product.rating >= minRating;
//       const matchesStock = !inStockOnly || product.inStock;

//       return matchesCategory && matchesPrice && matchesRating && matchesStock;
//     });

//     // Apply sorting
//     filtered = sortProducts(filtered, sortBy);
    
//     setFilteredProducts(filtered);
//   };

//   const sortProducts = (products, sortType) => {
//     switch (sortType) {
//       case "price-low":
//         return [...products].sort((a, b) => a.price - b.price);
//       case "price-high":
//         return [...products].sort((a, b) => b.price - a.price);
//       case "rating":
//         return [...products].sort((a, b) => b.rating - a.rating);
//       case "name":
//         return [...products].sort((a, b) => a.name.localeCompare(b.name));
//       case "reviews":
//         return [...products].sort((a, b) => b.reviews - a.reviews);
//       default:
//         return products; // featured - original order
//     }
//   };

//   const handleAddToCart = async (product) => {
//     if (!isAuthenticated) {
//       toast.warning("Please login to add items to cart!");
//       return;
//     }

//     try {
//       await addToCart(product);
//       toast.success("🎉 Item added to cart!");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to add item to cart!");
//     }
//   };

//   const handleAddToWishlist = async (product) => {
//     if (!isAuthenticated) {
//       toast.warning("Please login to add items to wishlist!");
//       return;
//     }

//     try {
//       const updatedWishlist = await addToWishlist(product);
//       const nowInWishlist = updatedWishlist.some(item => item.id === product.id);
//       toast.success(nowInWishlist ? "❤️ Added to wishlist!" : "💔 Removed from wishlist!");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to update wishlist!");
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedCategory("all");
//     setPriceRange([0, Math.max(...products.map(p => p.price))]);
//     setMinRating(0);
//     setSortBy("featured");
//     setInStockOnly(false);
//   };

//   const getActiveFilterCount = () => {
//     let count = 0;
//     if (selectedCategory !== "all") count++;
//     if (priceRange[0] > 0 || priceRange[1] < Math.max(...products.map(p => p.price))) count++;
//     if (minRating > 0) count++;
//     if (inStockOnly) count++;
//     if (sortBy !== "featured") count++;
//     return count;
//   };

//   if (loadingProducts) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
//           <p className="text-gray-600 font-medium">Loading amazing products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Header with Filters */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             {/* Left Side - Sort and Category */}
//             <div className="flex items-center space-x-4">
//               {/* Sort Dropdown */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white"
//               >
//                 <option value="featured">Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="rating">Highest Rated</option>
//                 <option value="reviews">Most Reviews</option>
//                 <option value="name">Name: A to Z</option>
//               </select>

//               {/* Category Filter */}
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white"
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>
//                     {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//           </div>

//           {/* Expanded Filters Panel */}
//           {showFilters && (
//             <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-slideDown">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Price Range Filter */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-3">
//                     Price Range: ${priceRange[0]} - ${priceRange[1]}
//                   </label>
//                   <div className="space-y-3">
//                     <input
//                       type="range"
//                       min="0"
//                       max={Math.max(...products.map(p => p.price))}
//                       value={priceRange[1]}
//                       onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                       className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
//                     />
//                     <div className="flex justify-between text-sm text-gray-600">
//                       <span>$0</span>
//                       <span>${Math.max(...products.map(p => p.price))}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Rating Filter */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-3">
//                     Minimum Rating
//                   </label>
//                   <div className="flex space-x-2">
//                     {[0, 3, 4, 4.5].map(rating => (
//                       <button
//                         key={rating}
//                         onClick={() => setMinRating(rating)}
//                         className={`flex items-center space-x-1 px-3 py-2 rounded-2xl border transition-all duration-300 ${
//                           minRating === rating
//                             ? "bg-red-500 text-white border-red-500"
//                             : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
//                         }`}
//                       >
//                         <Star className={`w-4 h-4 ${minRating === rating ? 'fill-current' : ''}`} />
//                         <span>{rating === 0 ? "Any" : `${rating}+`}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="bg-white p-4 rounded-2xl border border-gray-200">
//                   <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
//                   <div className="space-y-2 text-sm text-gray-600">
//                     <div className="flex justify-between">
//                       <span>Total Products:</span>
//                       <span className="font-semibold">{products.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Showing:</span>
//                       <span className="font-semibold text-red-500">{filteredProducts.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>In Stock:</span>
//                       <span className="font-semibold text-green-600">
//                         {products.filter(p => p.inStock).length}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Results Summary */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex items-center justify-between mb-6">
//           <p className="text-gray-600">
//             Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
//             {getActiveFilterCount() > 0 && (
//               <span className="text-red-500 ml-2">
//                 ({getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied)
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Products Grid */}
//         <section className="py-6">
//           <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {filteredProducts.map((product) => (
//                 <div 
//                   key={product.id} 
//                   className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden"
//                   onMouseEnter={() => setHoveredProduct(product.id)}
//                   onMouseLeave={() => setHoveredProduct(null)}
//                 >
//                   {/* Premium Background Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
//                   {/* Image Container with Shine Effect */}
//                   <div className="relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
//                     {/* Shine Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
                    
//                     <img 
//                       src={product.image} 
//                       alt={product.name} 
//                       className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
//                     />

//                     {/* Premium Badges */}
//                     <div className="absolute top-4 left-4 z-30">
//                       <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
//                         HOT
//                       </span>
//                     </div>

//                     {/* Rating Badge */}
//                     <div className="absolute top-4 right-4 z-30">
//                       <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold">
//                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                         <span>{product.rating}</span>
//                       </div>
//                     </div>

//                     {/* Wishlist Button - Enhanced */}
//                     <button
//                       onClick={() => handleAddToWishlist(product)}
//                       className={`absolute top-16 right-4 z-30 p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 transform hover:scale-110 ${
//                         isInWishlist(product.id)
//                           ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30"
//                           : "bg-white/90 border-white/50 text-gray-600 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30"
//                       }`}
//                     >
//                       <Heart 
//                         className={`w-5 h-5 transition-all duration-300 ${
//                           isInWishlist(product.id) ? 'fill-current scale-110' : ''
//                         }`} 
//                       />
//                     </button>

//                     {/* Quick View Button - Appears on Hover */}
//                     <button
//                       onClick={() => navigate(`/product/${product.id}`)}
//                       className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-2xl font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:scale-105 border border-white/50"
//                     >
//                       Quick View
//                     </button>
//                   </div>

//                   {/* Product Info - Enhanced */}
//                   <div className="relative z-10 p-6 bg-white">
//                     {/* Category Tag */}
//                     <div className="mb-3">
//                       <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
//                         {product.category}
//                       </span>
//                     </div>

//                     {/* Product Name */}
//                     <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
//                       {product.name}
//                     </h3>

//                     {/* Product Description */}
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
//                       {product.description}
//                     </p>

//                     {/* Price and Actions */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex flex-col">
//                         <span className="text-2xl font-bold text-red-600">
//                           ${product.price}
//                         </span>
//                         <span className="text-sm text-gray-500 line-through">
//                           ${(product.price * 1.2).toFixed(2)}
//                         </span>
//                       </div>

//                       {/* Add to Cart Button - Enhanced */}
//                       <button
//                         onClick={() => handleAddToCart(product)}
//                         disabled={!product.inStock}
//                         className={`group relative bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 overflow-hidden ${
//                           !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         {/* Animated Background */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
//                         {/* Button Content */}
//                         <span className="relative z-10 flex items-center space-x-2">
//                           <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//                           <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
//                         </span>

//                         {/* Sparkle Effect */}
//                         <div className="absolute inset-0 overflow-hidden rounded-2xl">
//                           <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
//                         </div>
//                       </button>
//                     </div>

//                     {/* Stock Status */}
//                     <div className="mt-4 flex items-center justify-between text-xs">
//                       <span className={`flex items-center space-x-1 ${
//                         product.inStock ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         <div className={`w-2 h-2 rounded-full ${
//                           product.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'
//                         }`}></div>
//                         <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
//                       </span>
//                       <span className="text-gray-500">{product.reviews} reviews</span>
//                     </div>
//                   </div>

//                   {/* Border Glow Effect */}
//                   <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
//                     <div className="absolute inset-[2px] rounded-3xl bg-white z-10"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Empty State */}
//             {filteredProducts.length === 0 && (
//               <div className="text-center py-20">
//                 <div className="max-w-md mx-auto">
//                   <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                     <Zap className="w-10 h-10 text-red-500" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                     No products found
//                   </h3>
//                   <p className="text-gray-600 mb-6">
//                     Try adjusting your filter criteria to find what you're looking for.
//                   </p>
//                   <button
//                     onClick={clearAllFilters}
//                     className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Custom CSS for range slider */}
//       <style jsx>{`
//         .slider::-webkit-slider-thumb {
//           appearance: none;
//           height: 20px;
//           width: 20px;
//           border-radius: 50%;
//           background: #ef4444;
//           cursor: pointer;
//           border: 2px solid white;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//         }
        
//         .slider::-moz-range-thumb {
//           height: 20px;
//           width: 20px;
//           border-radius: 50%;
//           background: #ef4444;
//           cursor: pointer;
//           border: 2px solid white;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Shop;


import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, Star, Zap, X, SlidersHorizontal, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {
    user,
    addToCart,
    addToWishlist,
    isInWishlist,
    isAuthenticated,
  } = useAuth();

  // Get unique categories
  const categories = ["all", ...new Set(products.map(product => product.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        
        // Set max price from actual products
        const maxPrice = Math.max(...data.products.map(p => p.price));
        setPriceRange([0, Math.ceil(maxPrice)]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, priceRange, minRating, sortBy, inStockOnly, searchQuery]);

  const applyFilters = () => {
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.inStock;
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesStock && matchesSearch;
    });

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);
    
    setFilteredProducts(filtered);
  };

  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating);
      case "name":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "reviews":
        return [...products].sort((a, b) => b.reviews - a.reviews);
      default:
        return products; // featured - original order
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items to cart!");
      return;
    }

    try {
      await addToCart(product);
      toast.success("🎉 Item added to cart!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add item to cart!");
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items to wishlist!");
      return;
    }

    try {
      const updatedWishlist = await addToWishlist(product);
      const nowInWishlist = updatedWishlist.some(item => item.id === product.id);
      toast.success(nowInWishlist ? "❤️ Added to wishlist!" : "💔 Removed from wishlist!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update wishlist!");
    }
  };

  // Fixed Quick View function - Navigate to ProductDetails page
  const handleQuickView = (product) => {
    // Navigate to product detail page with product data
    navigate(`/product/${product.id}`, { 
      state: { product } // Pass the entire product object via navigation state
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, Math.max(...products.map(p => p.price))]);
    setMinRating(0);
    setSortBy("featured");
    setInStockOnly(false);
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < Math.max(...products.map(p => p.price))) count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    if (sortBy !== "featured") count++;
    if (searchQuery !== "") count++;
    return count;
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header with Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Left Side - Sort and Category */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Side - Search Bar */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-12 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white w-64"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-2xl hover:border-red-500 transition-all duration-300 bg-white"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max={Math.max(...products.map(p => p.price))}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>${Math.max(...products.map(p => p.price))}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Minimum Rating
                  </label>
                  <div className="flex space-x-2">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-2xl border transition-all duration-300 ${
                          minRating === rating
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${minRating === rating ? 'fill-current' : ''}`} />
                        <span>{rating === 0 ? "Any" : `${rating}+`}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-semibold">{products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Showing:</span>
                      <span className="font-semibold text-red-500">{filteredProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Stock:</span>
                      <span className="font-semibold text-green-600">
                        {products.filter(p => p.inStock).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            {getActiveFilterCount() > 0 && (
              <span className="text-red-500 ml-2">
                ({getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied)
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Premium Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Image Container with Shine Effect */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Shine Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
                    
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Premium Badges */}
                    <div className="absolute top-4 left-4 z-30">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        HOT
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Wishlist Button - Enhanced */}
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className={`absolute top-16 right-4 z-30 p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 transform hover:scale-110 ${
                        isInWishlist(product.id)
                          ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30"
                          : "bg-white/90 border-white/50 text-gray-600 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30"
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isInWishlist(product.id) ? 'fill-current scale-110' : ''
                        }`} 
                      />
                    </button>

                    {/* Quick View Button - Fixed to navigate to ProductDetails */}
                    <button
                      onClick={() => handleQuickView(product)}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-2xl font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:scale-105 border border-white/50"
                    >
                      Quick View
                    </button>
                  </div>

                  {/* Product Info - Enhanced */}
                  <div className="relative z-10 p-6 bg-white">
                    {/* Category Tag */}
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Product Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-red-600">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${(product.price * 1.2).toFixed(2)}
                        </span>
                      </div>

                      {/* Add to Cart Button - Enhanced */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`group relative bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 flex items-center space-x-2 overflow-hidden ${
                          !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Button Content */}
                        <span className="relative z-10 flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </span>

                        {/* Sparkle Effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
                        </div>
                      </button>
                    </div>

                    {/* Stock Status */}
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className={`flex items-center space-x-1 ${
                        product.inStock ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          product.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </span>
                      <span className="text-gray-500">{product.reviews} reviews</span>
                    </div>
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                    <div className="absolute inset-[2px] rounded-3xl bg-white z-10"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filter criteria to find what you're looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Custom CSS for range slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Shop;