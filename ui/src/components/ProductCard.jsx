import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, addToWishlist, removeFromWishlist } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product, wishlisted = false, onWishlistChange }) {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState(wishlisted);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        setInWishlist(false);
      } else {
        await addToWishlist(product._id);
        setInWishlist(true);
      }
      onWishlistChange?.();
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative">
          {product.banner ? (
            <img
              src={product.banner}
              alt={product.name}
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-52 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
            style={{ display: product.banner ? "none" : "flex" }}
          >
            <span className="text-6xl">📦</span>
          </div>
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className="text-lg">{inWishlist ? "❤️" : "🤍"}</span>
          </button>
          {!product.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="badge bg-blue-50 text-blue-700 shrink-0">
              {product.type}
            </span>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !product.available}
              className="btn-primary text-sm py-1.5 px-3"
            >
              {addedToCart ? "Added ✓" : addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
