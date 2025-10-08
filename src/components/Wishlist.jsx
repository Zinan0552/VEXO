// // export default Wishlist;
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//   const { user, addToCart, removeFromCart, updateCartQuantity } = useAuth();
//   const [loading, setLoading] = useState({});
//   const navigate = useNavigate();

//   const cartItems = user?.cart || [];

//   // Increment quantity
//   const handleAdd = async (product) => {
//     setLoading(prev => ({ ...prev, [product.id]: true }));
//     try {
//       await addToCart(product);
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     } finally {
//       setLoading(prev => ({ ...prev, [product.id]: false }));
//     }
//   };

//   // Decrement quantity
//   const handleRemoveOne = async (product) => {
//     setLoading(prev => ({ ...prev, [product.id]: true }));
//     try {
//       const newQuantity = (product.quantity || 1) - 1;
//       if (newQuantity < 1) {
//         // Remove from cart if quantity is 0
//         await removeFromCart(product.id);
//       } else {
//         await updateCartQuantity(product.id, newQuantity);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(prev => ({ ...prev, [product.id]: false }));
//     }
//   };

//   // Remove completely
//   const handleRemoveAll = async (product) => {
//     setLoading(prev => ({ ...prev, [product.id]: true }));
//     try {
//       await removeFromCart(product.id);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(prev => ({ ...prev, [product.id]: false }));
//     }
//   };

//   if (!user || cartItems.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
//         <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
//         <h2 className="text-2xl font-bold mb-2">Your WishList is Empty</h2>
//         <p className="text-gray-600 mb-4">Add some martial arts gear to your cart!</p>
//         <button
//           onClick={() => navigate('/shop')}
//           className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-6 py-8">
//         <button
//           onClick={() => navigate('/shop')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Shop
//         </button>

//         <h1 className="text-3xl font-bold mb-6">My Cart</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {cartItems.map((product) => (
//             <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded mb-4"
//               />
//               <h3 className="text-lg font-bold mb-1">{product.name}</h3>
//               <p className="text-gray-600 mb-2">${product.price}</p>
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handleRemoveOne(product)}
//                     disabled={loading[product.id]}
//                     className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//                   >
//                     -
//                   </button>
//                   <span>{product.quantity}</span>
//                   <button
//                     onClick={() => handleAdd(product)}
//                     disabled={loading[product.id]}
//                     className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => handleRemoveAll(product)}
//                   disabled={loading[product.id]}
//                   className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Total */}
//         <div className="mt-8 text-right">
//           <h2 className="text-xl font-bold">
//             Total: $
//             {cartItems.reduce(
//               (total, item) => total + item.price * item.quantity,
//               0
//             )}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Wishlist = () => {
  const {
    user,
    addToCart,
    addToWishlist,
    isAuthenticated,
    isInWishlist,
  } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState({});

  const wishlistItems = user?.wishlist || [];

  // 🛒 Move to Cart
  const handleMoveToCart = async (product) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    setLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product);
      await addToWishlist(product); // removes it from wishlist
      alert("Item moved to cart!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // ❤️ Remove from Wishlist
  const handleRemove = async (product) => {
    if (!isAuthenticated) {
      alert("Please login to manage your wishlist!");
      navigate("/login");
      return;
    }

    setLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      await addToWishlist(product); // toggles off
      alert("Item removed from wishlist!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // 🩶 Empty wishlist message
  if (!isAuthenticated || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <Heart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-4">Save your favorite products to view later!</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // 💖 Wishlist grid
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </button>

        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />
                <button
                  onClick={() => handleRemove(product)}
                  disabled={loading[product.id]}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-gray-600 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-red-600 font-bold">${product.price}</span>
                  <span className="text-gray-400 text-sm capitalize">
                    {product.category}
                  </span>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={loading[product.id]}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
