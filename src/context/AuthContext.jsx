// import { createContext, useContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const isLoggedIn = localStorage.getItem("isLoggedIn");
    
//     if (isLoggedIn === 'true' && storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing stored user:", error);
//         localStorage.removeItem("user");
//         localStorage.removeItem("isLoggedIn");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // ✅ Login function - compatible with your existing logic
//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`http://localhost:5001/users?email=${email}`);
//       const users = await response.json();
//       const user = users[0];

//       if (!user) throw new Error("User not found");
//       if (user.password !== password) throw new Error("Invalid password");
//       if (user.isBlock) throw new Error("Account is blocked");

//       // Update user login status
//       const updatedUser = { ...user, isLoggedIn: true };
//       await fetch(`http://localhost:5001/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isLoggedIn: true })
//       });

//       // Store in localStorage (matching your existing approach)
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       setUser(updatedUser);
//       return updatedUser;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };

//   // ✅ Logout function
//   const logout = async () => {
//     if (user?.id) {
//       try {
//         await fetch(`http://localhost:5001/users/${user.id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ isLoggedIn: false })
//         });
//       } catch (error) {
//         console.error("Error updating user login status:", error);
//       }
//     }
    
//     localStorage.removeItem("user");
//     localStorage.removeItem("isLoggedIn");
//     setUser(null);
//     setProfileOpen(false);
//   };

//   // ✅ Update user for cart/wishlist
//   const updateUser = async (updatedUserData) => {
//     try {
//       if (user?.id) {
//         await fetch(`http://localhost:5001/users/${user.id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatedUserData)
//         });
//       }
      
//       const mergedUser = { ...user, ...updatedUserData };
//       localStorage.setItem("user", JSON.stringify(mergedUser));
//       setUser(mergedUser);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   // ✅ Add to cart
//   const addToCart = async (product) => {
//     if (!user) throw new Error("Please login to add items to cart");
    
//     const currentCart = user.cart || [];
//     const existingItem = currentCart.find(item => item.id === product.id);
    
//     let updatedCart;
//     if (existingItem) {
//       updatedCart = currentCart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     } else {
//       updatedCart = [...currentCart, { ...product, quantity: 1 }];
//     }
    
//     await updateUser({ cart: updatedCart });
//   };

//   // ✅ Add to wishlist
// const addToWishlist = async (product) => {
//   if (!user) throw new Error("Please login to add items to wishlist");

//   const currentWishlist = user.wishlist || [];
//   const existingItem = currentWishlist.find(item => item.id === product.id);

//   let updatedWishlist;
//   if (existingItem) {
//     updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
//   } else {
//     updatedWishlist = [...currentWishlist, product];
//   }

//   await updateUser({ wishlist: updatedWishlist });
//   return updatedWishlist; // ✅ Return updated state
// };


//   // ✅ Remove from cart
//   const removeFromCart = async (productId) => {
//     if (!user) return;
    
//     const updatedCart = user.cart.filter(item => item.id !== productId);
//     await updateUser({ cart: updatedCart });
//   };

//   // ✅ Update cart quantity
//   const updateCartQuantity = async (productId, quantity) => {
//     if (!user) return;
//     if (quantity < 1) return;
    
//     const updatedCart = user.cart.map(item =>
//       item.id === productId ? { ...item, quantity } : item
//     );
    
//     await updateUser({ cart: updatedCart });
//   };

//   // ✅ Counts
//   const wishlistCount = user?.wishlist?.length || 0;
//   const cartCount = user?.cart?.reduce((total, item) => total + item.quantity, 0) || 0;

//   // ✅ Check if product is in wishlist
//   const isInWishlist = (productId) => {
//     return user?.wishlist?.some(item => item.id === productId) || false;
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     updateUser,
//     addToCart,
//     addToWishlist,
//     removeFromCart,
//     updateCartQuantity,
//     isInWishlist,
//     wishlistCount,
//     cartCount,
//     profileOpen,
//     setProfileOpen,
//     mobileMenuOpen,
//     setMobileMenuOpen,
//     loading,
//     isAuthenticated: !!user
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };



import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const Navigate = useNavigate();
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === 'true' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Enhanced Login function - Uses localStorage
  const login = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:5001/users?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const users = await response.json();
      const user = users[0];

      if (!user) throw new Error("User not found");
      if (user.password !== password) throw new Error("Invalid password");
      if (user.isBlock) throw new Error("Account is blocked");

      // Create user object with localStorage structure
      const updatedUser = { 
        ...user, 
        isLoggedIn: true,
        cart: user.cart || [],
        wishlist: user.wishlist || []
      };

      // Store in localStorage (Primary storage)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Optional: Update server (secondary)
      try {
        await fetch(`http://localhost:5001/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isLoggedIn: true })
        });
      } catch (error) {
        console.warn("Failed to update server login status:", error);
      }

      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // ✅ Enhanced Logout function - Clears localStorage
  const logout = async () => {
    // Clear localStorage first
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    
    // Optional: Update server
    if (user?.id) {
      try {
        await fetch(`http://localhost:5001/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isLoggedIn: false })
        });
      } catch (error) {
        console.warn("Error updating user login status on server:", error);
      }
    }
    
    // Clear state
    setUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    Navigate("/login");
  };

  // ✅ Enhanced Update User function - Updates localStorage
  const updateUser = async (updatedUserData) => {
    try {
      const mergedUser = { ...user, ...updatedUserData };
      
      // Update localStorage (Primary)
      localStorage.setItem("user", JSON.stringify(mergedUser));
      
      // Update state
      setUser(mergedUser);
      
      // Optional: Update server (secondary)
      if (user?.id) {
        try {
          await fetch(`http://localhost:5001/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
          });
        } catch (error) {
          console.warn("Failed to update user on server:", error);
        }
      }
      
      return mergedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // ✅ Enhanced Register function - Adds to localStorage
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          isLoggedIn: false,
          isBlock: false,
          cart: [],
          wishlist: [],
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error("Failed to create user");

      const newUser = await response.json();
      
      // Auto-login after registration - Store in localStorage
      const loggedInUser = {
        ...newUser,
        isLoggedIn: true,
        cart: [],
        wishlist: []
      };
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      
      return loggedInUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // ✅ Enhanced Add to Cart function - Updates localStorage
  const addToCart = async (product) => {
    if (!user) throw new Error("Please login to add items to cart");
    
    const currentCart = user.cart || [];
    const existingItem = currentCart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    await updateUser({ cart: updatedCart });
    return updatedCart;
  };

  // ✅ Enhanced Add to Wishlist function - Updates localStorage
  const addToWishlist = async (product) => {
    if (!user) throw new Error("Please login to add items to wishlist");

    const currentWishlist = user.wishlist || [];
    const existingItem = currentWishlist.find(item => item.id === product.id);

    let updatedWishlist;
    if (existingItem) {
      updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
    } else {
      updatedWishlist = [...currentWishlist, product];
    }

    await updateUser({ wishlist: updatedWishlist });
    return updatedWishlist;
  };

  // ✅ Enhanced Remove from Cart function - Updates localStorage
  const removeFromCart = async (productId) => {
    if (!user) throw new Error("Please login to manage cart");
    
    const updatedCart = (user.cart || []).filter(item => item.id !== productId);
    await updateUser({ cart: updatedCart });
    return updatedCart;
  };

  // ✅ Enhanced Update Cart Quantity function - Updates localStorage
  const updateCartQuantity = async (productId, quantity) => {
    if (!user) throw new Error("Please login to manage cart");
    if (quantity < 1) {
      return await removeFromCart(productId);
    }
    
    const updatedCart = (user.cart || []).map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    
    await updateUser({ cart: updatedCart });
    return updatedCart;
  };

  // ✅ Clear Cart function - Updates localStorage
  const clearCart = async () => {
    if (!user) throw new Error("Please login to manage cart");
    await updateUser({ cart: [] });
  };

  // ✅ Update Profile function - Updates localStorage
  const updateProfile = async (profileData) => {
    if (!user) throw new Error("Please login to update profile");
    
    const updatedUserData = {
      firstName: profileData.firstName || user.firstName,
      lastName: profileData.lastName || user.lastName,
      email: profileData.email || user.email,
      phone: profileData.phone || user.phone,
      avatar: profileData.avatar || user.avatar
    };

    await updateUser(updatedUserData);
    return updatedUserData;
  };

  // ✅ Helper functions for localStorage operations
  const syncUserToLocalStorage = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") === 'true';
  };

  // ✅ Computed values
  const getCartTotal = () => {
    if (!user?.cart) return 0;
    return user.cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const getCartItemCount = () => {
    if (!user?.cart) return 0;
    return user.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getWishlistCount = () => {
    return user?.wishlist?.length || 0;
  };

  const isInWishlist = (productId) => {
    return user?.wishlist?.some(item => item.id === productId) || false;
  };

  const isInCart = (productId) => {
    return user?.cart?.some(item => item.id === productId) || false;
  };

  const getCartQuantity = (productId) => {
    const item = user?.cart?.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    // User state
    user,
    loading,
    isAuthenticated: !!user,
    
    // Auth functions
    login,
    logout,
    register,
    updateProfile,
    
    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartQuantity,
    
    // Wishlist functions
    addToWishlist,
    isInWishlist,
    
    // UI state
    profileOpen,
    setProfileOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    
    // Computed values
    wishlistCount: getWishlistCount(),
    cartCount: getCartItemCount(),
    
    // Enhanced update function
    updateUser,
    
    // LocalStorage helpers
    syncUserToLocalStorage,
    getUserFromLocalStorage,
    isUserLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Enhanced custom hook with error boundary
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};