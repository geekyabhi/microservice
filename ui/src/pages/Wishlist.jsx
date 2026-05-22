import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist, addToCart } from "../api";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ id: null, text: "" });

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data?.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      setMsg({ id, text: "Failed to remove." });
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item._id, 1);
      setMsg({ id: item._id, text: "Added to cart!" });
      setTimeout(() => setMsg({ id: null, text: "" }), 2000);
    } catch {
      setMsg({ id: item._id, text: "Failed to add to cart." });
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">❤️ Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-gray-600 font-medium mb-4">Your wishlist is empty</p>
          <Link to="/" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id} className="card">
              <div className="w-full h-36 rounded-lg bg-gradient-to-br from-pink-50 to-red-100 flex items-center justify-center mb-4">
                {item.banner ? (
                  <img src={item.banner} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-5xl">📦</span>
                )}
              </div>
              <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-1 line-clamp-1">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 line-clamp-1 mb-2">{item.desc}</p>
              <p className="font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>

              {msg.id === item._id && (
                <p className={`text-xs mb-2 ${msg.text.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
                  {msg.text}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`btn-primary text-sm flex-1 ${!item.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!item.available}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="btn-secondary text-sm px-3"
                  title="Remove from wishlist"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
