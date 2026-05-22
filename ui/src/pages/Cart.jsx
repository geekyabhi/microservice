import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, startPayment } from "../api";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data?.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch {
      setMsg("Failed to remove item.");
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) return;
    setCheckingOut(true);
    try {
      const items = cart.items.map((item) => ({
        products: { price: item.price },
        unit: item.unit,
      }));
      const res = await startPayment(items);
      setMsg("Payment order created! Complete the payment to finalize.");
      setTimeout(() => navigate("/orders"), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Checkout failed.");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.unit || 1), 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🛒 Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-600 font-medium mb-4">Your cart is empty</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => (
              <div key={item._id || i} className="card flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0">
                  {item.banner ? (
                    <img src={item.banner} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {formatPrice(item.price)} × {item.unit}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice((item.price || 0) * (item.unit || 1))}</p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card h-fit space-y-4 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.length})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {msg && (
              <div className={`p-3 rounded-lg text-sm ${msg.includes("failed") || msg.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                {msg}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary w-full"
            >
              {checkingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
