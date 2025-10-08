
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../context/AuthContext";
// import { ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";

// const Checkout = () => {
//   const { user, updateUser } = useAuth();
//   const navigate = useNavigate();

//   const cartItems = user?.cart || [];

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: user?.email || "",
//     address: "",
//     city: "",
//     postalCode: "",
//     paymentMethod: "cod",
//   });

//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     if (!formData.fullName || !formData.address || !formData.city) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const newOrder = {
//         id: Date.now(),
//         items: cartItems,
//         totalAmount,
//         paymentMethod: formData.paymentMethod,
//         shippingDetails: formData,
//         status: "Processing",
//         date: new Date().toLocaleString(),
//       };

//       const updatedOrders = [...(user.orders || []), newOrder];

//       await updateUser({
//         cart: [],
//         orders: updatedOrders,
//       });

//       setOrderSuccess(true);

//       // Redirect after success
//       setTimeout(() => navigate("/orders"), 2000);
//     } catch (error) {
//       console.error(error);
//       alert("Error placing order. Try again!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user || cartItems.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
//         <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
//         <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
//         <p className="text-gray-600 mb-4">Add some products to continue checkout!</p>
//         <button
//           onClick={() => navigate("/shop")}
//           className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gray-50 overflow-hidden">
//       <div className="container mx-auto px-6 py-10">
//         <button
//           onClick={() => navigate("/cart")}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Cart
//         </button>

//         <h1 className="text-3xl font-bold mb-6">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* 🧾 Order Summary */}
//           <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between border-b py-3"
//               >
//                 <div>
//                   <h3 className="font-semibold">{item.name}</h3>
//                   <p className="text-sm text-gray-500">
//                     Qty: {item.quantity} × ${item.price}
//                   </p>
//                 </div>
//                 <span className="font-semibold">
//                   ${(item.price * item.quantity).toFixed(2)}
//                 </span>
//               </div>
//             ))}

//             <div className="border-t mt-4 pt-4">
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span>${totalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span>Shipping</span>
//                 <span>$5.00</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg mt-2">
//                 <span>Total</span>
//                 <span>${(totalAmount + 5).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* 📦 Shipping Form */}
//           <form
//             onSubmit={handlePlaceOrder}
//             className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
//           >
//             <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-600 mb-1">Full Name *</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 mb-1">Email *</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-gray-600 mb-1">Address *</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 mb-1">City *</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 mb-1">Postal Code *</label>
//                 <input
//                   type="text"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleChange}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//             </div>

//             {/* 💳 Payment */}
//             <h2 className="text-xl font-semibold mt-6 mb-3">Payment Method</h2>
//             <div className="flex space-x-6">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="cod"
//                   checked={formData.paymentMethod === "cod"}
//                   onChange={handleChange}
//                 />
//                 <span>Cash on Delivery</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="online"
//                   checked={formData.paymentMethod === "online"}
//                   onChange={handleChange}
//                 />
//                 <span>Online Payment</span>
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold text-lg disabled:opacity-50"
//             >
//               {loading ? "Placing Order..." : "Place Order"}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* ✅ Success Animation */}
//       <AnimatePresence>
//         {orderSuccess && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 120 }}
//               className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center"
//             >
//               <CheckCircle2 className="text-green-500 w-20 h-20 mb-3 animate-bounce" />
//               <h2 className="text-2xl font-bold text-green-600">
//                 Payment Successful!
//               </h2>
//               <p className="text-gray-600 mt-2 text-center">
//                 Redirecting to your orders...
//               </p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const cartItems = user?.cart || [];

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.00;
  const finalTotal = totalAmount + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!formData.fullName || !formData.address || !formData.city) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder = {
        id: Date.now(),
        items: cartItems,
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        shippingDetails: formData,
        status: "Processing",
        date: new Date().toLocaleString(),
      };

      const updatedOrders = [...(user.orders || []), newOrder];

      await updateUser({
        cart: [],
        orders: updatedOrders,
      });

      // Show success message
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Error placing order. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-4">Add some products to continue checkout!</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-3"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ${item.price}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Payment */}
            <h2 className="text-xl font-semibold mt-6 mb-3">Payment Method</h2>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="text-red-600 focus:ring-red-500"
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleChange}
                  className="text-red-600 focus:ring-red-500"
                />
                <span>Online Payment</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold text-lg disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Order...
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Simple Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm mx-4 text-center animate-pop-in">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase!
            </p>
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Items:</span>
                <span>{cartItems.length} product(s)</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Redirecting to orders...</p>
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Checkout;