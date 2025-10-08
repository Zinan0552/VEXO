
import React from "react";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const orders = user?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="text-gray-600 mb-4">Your placed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-2">
              Order #{order.id} — <span className="text-green-600">{order.status}</span>
            </h2>
            <p className="text-sm text-gray-500 mb-4">{order.date}</p>
            <ul className="border-t pt-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-1 text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-3 pt-2 font-semibold flex justify-between">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
