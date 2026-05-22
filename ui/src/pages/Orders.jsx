import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api";

const STATUS_COLORS = {
  Completed: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Failed: "bg-red-50 text-red-700",
  Processing: "bg-blue-50 text-blue-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrders();
        setOrders(res.data?.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-600 font-medium mb-4">No orders yet</p>
          <Link to="/" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-500">
                    Order ID: <span className="text-gray-700">{order.orderId || order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Date: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-50 text-gray-700"}`}>
                    {order.status || "Pending"}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name || `Item ${i + 1}`}</span>
                        <span>×{item.unit || 1}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
                    )}
                  </div>
                </div>
              )}

              {order.txnId && (
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  Txn: {order.txnId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
