// import { createContext, useContext, useState, useEffect } from 'react';

// const CartContext = createContext();
// export function useCart() { return useContext(CartContext); }
// const CART_KEY = 'xtremex_cart_v1';

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY)) || {});
//   useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

//   function addToCart(product, qty=1) {
//     setCart(prev => {
//       const next = { ...prev };
//       next[product.id] = { product, qty: (prev[product.id]?.qty || 0) + qty };
//       return next;
//     });
//   }
//   function updateQty(id, qty) { setCart(prev => ({ ...prev, [id]: { ...prev[id], qty } })); }
//   function removeFromCart(id) { setCart(prev => { const next={...prev}; delete next[id]; return next; }); }
//   function clearCart(){ setCart({}); }

//   return (
//     <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
