
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
  Shield,
} from "lucide-react";

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
  const tax = totalAmount * 0.18;
  const finalTotal = totalAmount + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPaymentError("");
  };

  // ✅ Create order matching your JSON structure
  const createOrder = async (paymentMethod = "cod") => {
    const now = new Date();
    const orderId = Date.now(); // Simple numeric ID like your existing orders

    // Determine status based on payment method
    let status = "Processing";
    let paymentStatus = "pending";
    
    if (paymentMethod === "online") {
      status = "Confirmed";
      paymentStatus = "paid";
    }

    const orderData = {
      id: orderId,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        category: item.category || "",
        image: item.image,
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        inStock: item.inStock !== undefined ? item.inStock : true,
        quantity: item.quantity
      })),
      totalAmount: parseFloat(finalTotal.toFixed(2)),
      paymentMethod: paymentMethod,
      shippingDetails: {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        paymentMethod: paymentMethod
      },
      status: status,
      date: now.toLocaleString(), // Match your date format "10/10/2025, 23:31:07"
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      // Optional fields that might be added later
      ...(paymentMethod === "online" && { paymentStatus: paymentStatus }),
      ...(status === "Shipped" && { 
        trackingNumber: `TRK${orderId}`,
        shippedDate: now.toLocaleString().split(',')[0] // Just the date part
      })
    };

    try {
      // 1. Save order to global orders endpoint
      const orderResponse = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error("Failed to save order to orders collection");

      // 2. Update user's orders array
      const userResponse = await fetch(`http://localhost:3000/users/${user.id}`);
      if (!userResponse.ok) throw new Error("Failed to fetch user data");

      const userData = await userResponse.json();
      const updatedOrders = [...(userData.orders || []), orderData];

      const updateUserResponse = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orders: updatedOrders,
          cart: [] // Clear cart
        }),
      });

      if (!updateUserResponse.ok) throw new Error("Failed to update user orders");

      // Update local state
      updateUser({ ...user, orders: updatedOrders, cart: [] });

      return orderData;
    } catch (error) {
      console.error("Error creating order:", error);
      
      // Fallback: Save to localStorage
      const localOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
      localOrders.push(orderData);
      localStorage.setItem("userOrders", JSON.stringify(localOrders));
      
      // Update local user state
      const updatedOrders = [...(user.orders || []), orderData];
      updateUser({ ...user, orders: updatedOrders, cart: [] });
      
      return orderData;
    }
  };

  // ✅ Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const requiredFields = [
      "fullName",
      "email",
      "address",
      "city",
      "postalCode",
      "phone",
    ];
    const missingFields = requiredFields.filter((f) => !formData[f]?.trim());

    if (missingFields.length > 0) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    setPaymentError("");

    try {
      if (formData.paymentMethod === "online") {
        if (!window.Razorpay) {
          throw new Error("Razorpay is not available");
        }

        const options = {
          key: "rzp_test_RWokbFwV8ZpuKJ",
          amount: Math.round(finalTotal * 100),
          currency: "INR",
          name: "Vexo E-Commerce",
          description: "Order Payment",
          handler: async function (response) {
            console.log("Payment Success:", response);
            await createOrder("online");
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
            color: "#f43f5e",
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setPaymentError("Payment was cancelled by user.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on Delivery
        await createOrder("cod");
        setShowSuccess(true);
        setTimeout(() => navigate("/orders"), 3000);
      }
    } catch (error) {
      console.error("Order error:", error);
      setPaymentError(error.message || "Error placing order. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Empty cart check
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

  // ✅ UI layout (same as before)
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

        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-red-700 text-sm">{paymentError}</div>
              <button
                onClick={() => setPaymentError("")}
                className="text-red-600 hover:text-red-800 font-bold text-lg"
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
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 border-t pt-3">
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {["fullName", "email", "phone", "address", "city", "postalCode"].map((field) => (
                <div
                  key={field}
                  className={field === "address" ? "md:col-span-2" : ""}
                >
                  <label className="block text-gray-600 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")} *
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { value: "cod", label: "Cash on Delivery", icon: CreditCard },
                { value: "online", label: "Online Payment", icon: Shield },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === opt.value
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={formData.paymentMethod === opt.value}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div>
                      <Icon className="w-6 h-6 text-gray-600 mb-1" />
                      <span className="font-medium">{opt.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {formData.paymentMethod === "online"
                    ? "Processing Payment..."
                    : "Placing Order..."}
                </>
              ) : (
                `Place Order - $${finalTotal.toFixed(2)}`
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
              Thank you for your purchase. You will receive a confirmation email
              shortly.
            </p>
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4 text-sm">
              <div className="flex justify-between mb-1">
                <span>Total:</span>
                <strong>${finalTotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between mb-1">
                <span>Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="capitalize">{formData.paymentMethod}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Redirecting to orders...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
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