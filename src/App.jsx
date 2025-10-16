// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // Pages
// import Home from "./pages/Home";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Shop from "./pages/Shop";
// import Navbar from "./components/Navbar";
// import Contact from "./pages/Contact";
// import About from "./pages/About";
// import Cart from "./components/Cart";
// import Wishlist from "./components/Wishlist";
// import Checkout from "./components/Checkout";
// import Orders from "./components/Orders";
// import ProductDetail from "./components/ProductDetail";
// import Profile from "./pages/Profile";

// export default function App() {
//   return (
//     <>
//       {/* Global Navbar */}
//       <Navbar />
//             <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       {/* All Routes */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/shop" element={<Shop />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/wishlist" element={<Wishlist />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/product/:id" element={<ProductDetail />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </>
//   );
// }


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import ProductDetail from "./components/ProductDetail";
import Profile from "./pages/Profile";

// Admin Components - Import Admino (not Admin)
import Admino from "./pages/admin/ Admino";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          {/* Conditional Navbar - Don't show for admin routes */}
          <Routes>
            <Route path="/admino/*" element={<Admino />} />
            <Route path="*" element={<Navbar />} />
          </Routes>

          {/* All Routes */}
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}