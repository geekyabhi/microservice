import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, addToCart, addToWishlist, removeFromWishlist } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [wishlistMsg, setWishlistMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data?.data);
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      await addToCart(id, qty);
      setCartMsg("Added to cart!");
      setTimeout(() => setCartMsg(""), 2500);
    } catch {
      setCartMsg("Failed to add to cart.");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
        setWishlistMsg("Removed from wishlist");
      } else {
        await addToWishlist(id);
        setInWishlist(true);
        setWishlistMsg("Added to wishlist!");
      }
      setTimeout(() => setWishlistMsg(""), 2500);
    } catch {
      setWishlistMsg("Failed to update wishlist.");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {product.banner ? (
            <img
              src={product.banner}
              alt={product.name}
              className="w-full rounded-2xl object-cover shadow-lg"
              style={{ maxHeight: "420px" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center"
            style={{ display: product.banner ? "none" : "flex" }}
          >
            <span className="text-9xl">📦</span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <span className="badge bg-blue-50 text-blue-700 mb-2">{product.type}</span>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.desc}</p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {!product.available && (
              <span className="badge bg-red-50 text-red-700">Out of Stock</span>
            )}
          </div>

          {product.supplier || product.suplier ? (
            <p className="text-sm text-gray-500">
              Supplier: <span className="font-medium text-gray-700">{product.supplier || product.suplier}</span>
            </p>
          ) : null}

          {product.available && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Qty:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium border-x border-gray-300">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {cartMsg && (
            <div className={`p-3 rounded-lg text-sm font-medium ${cartMsg.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {cartMsg}
            </div>
          )}
          {wishlistMsg && (
            <div className={`p-3 rounded-lg text-sm font-medium ${wishlistMsg.includes("Failed") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
              {wishlistMsg}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className="btn-primary flex-1"
            >
              {product.available ? "🛒 Add to Cart" : "Out of Stock"}
            </button>
            <button
              onClick={handleWishlist}
              className="btn-secondary px-4"
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
