import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ShoppingBag, CheckCircle2, CreditCard, Shield, IndianRupee } from "lucide-react";
import api from "../Api/Api";

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
    phone: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.0;
  const tax = totalAmount * 0.18; // 18% GST
  const finalTotal = totalAmount + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPaymentError(""); // Clear error when user makes changes
  };

  const createOrder = async (paymentMethod = "cod") => {
    const orderData = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        itemTotal: item.price * item.quantity
      })),
      subtotal: parseFloat(totalAmount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      totalAmount: parseFloat(finalTotal.toFixed(2)),
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      shippingDetails: { ...formData },
      status: paymentMethod === "cod" ? "processing" : "confirmed",
      date: new Date().toISOString(),
      trackingNumber: `TRK${Date.now()}`
    };

    try {
      // Save order to JSON Server
      const response = await api.post("/orders", orderData);
      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating order in JSON Server:", error);
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      orders.push(orderData);
      localStorage.setItem('userOrders', JSON.stringify(orders));
      return orderData;
    }
  };

  const updateUserCart = async () => {
    try {
      // Update user's cart in JSON Server
      await api.patch(`/users/${user.id}`, { 
        cart: []
      });
      
      // Update context
      updateUser({
        ...user,
        cart: []
      });
    } catch (error) {
      console.error("Error updating user cart:", error);
      // Fallback to context update only
      updateUser({
        ...user,
        cart: []
      });
    }
  };

  const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const requiredFields = ["fullName", "email", "address", "city", "postalCode"];
  const missingFields = requiredFields.filter((field) => !formData[field]?.trim());

  if (missingFields.length > 0) {
    alert("Please fill all required fields!");
    return;
  }

  setLoading(true);
  setPaymentError("");

  try {
    if (formData.paymentMethod === "online") {
      // ✅ Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_RWokbFwV8ZpuKJ", // 🔹 Replace with your Razorpay Test Key ID
        amount: Math.round(finalTotal * 100), // in paise (₹1 = 100 paise)
        currency: "USD",
        name: "Vexo E-Commerce",
        description: "Order Payment",
        image: "https://yourstore.com/logo.png", // optional
        handler: async function (response) {
          // ✅ Payment successful
          console.log("Payment Success:", response);
          await createOrder("online");
          await updateUserCart();
          setShowSuccess(true);
          setTimeout(() => navigate("/orders"), 3000);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#f43f5e", // Tailwind red-500
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentError("Payment was cancelled by the user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // ✅ Cash on Delivery
      await createOrder("cod");
      await updateUserCart();
      setShowSuccess(true);
      setTimeout(() => navigate("/orders"), 3000);
    }
  } catch (error) {
    console.error("Order error:", error);
    setPaymentError("Error placing order. Please try again.");
    setLoading(false);
  }
};


  // Redirect if cart is empty
  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-4">Add some products to continue checkout!</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Payment Error Alert */}
        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600 font-medium">Payment Error</div>
                <div className="ml-3 text-red-700 text-sm">{paymentError}</div>
              </div>
              <button 
                onClick={() => setPaymentError("")}
                className="text-red-600 hover:text-red-800 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                <span>Total</span>
                <span className="flex items-center">
                  $
                  {finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="+91 9876543210"
                  required
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Full street address"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Your city"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  placeholder="560001"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Payment Method */}
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === "cod" 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-200 hover:border-red-300"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="text-red-600 focus:ring-red-500"
                  disabled={loading}
                />
                <div>
                  <CreditCard className="w-6 h-6 text-gray-600 mb-1" />
                  <span className="font-medium">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">Pay when you receive</p>
                </div>
              </label>
              
              <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === "online" 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-200 hover:border-red-300"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleChange}
                  className="text-red-600 focus:ring-red-500"
                  disabled={loading}
                />
                <div>
                  <Shield className="w-6 h-6 text-green-600 mb-1" />
                  <span className="font-medium">Online Payment</span>
                  <p className="text-sm text-gray-500">Secure payment gateway</p>
                </div>
              </label>
            </div>

            {/* Payment Security Note */}
            {formData.paymentMethod === "online" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700 mb-2">
                  Your payment is secured with industry-standard encryption.
                </p>
                <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                  <strong>Note:</strong> You will be redirected to a secure payment page.
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {formData.paymentMethod === "online" ? "Processing Payment..." : "Placing Order..."}
                </>
              ) : (
                <>
                  {formData.paymentMethod === "online" ? (
                    <>
                      <IndianRupee className="w-5 h-5 mr-1" />
                      Pay ${finalTotal.toFixed(2)}
                    </>
                  ) : (
                    `Place Order - ${finalTotal.toFixed(2)}`
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-pop-in">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  {finalTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Items:</span>
                <span>{cartItems.length} product(s)</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">Payment:</span>
                <span className="capitalize">{formData.paymentMethod}</span>
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