import axios from "axios";

const BASE = "/api";

const client = axios.create({ baseURL: BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth
export const signup = (data) => client.post("/customer/signup", data);
export const login = (data) => client.post("/customer/login", data);

// Profile
export const getProfile = () => client.get("/customer/profile");
export const updateProfile = (data) => client.put("/customer/profile", data);
export const addAddress = (data) => client.post("/customer/address", data);

// Products
export const getProducts = (params = {}) => client.get("/", { params });
export const getProduct = (id) => client.get(`/products/${id}`);

// Wishlist
export const getWishlist = () => client.get("/customer/wishlist");
export const addToWishlist = (id) => client.put(`/products/wishlist/${id}`);
export const removeFromWishlist = (id) =>
  client.delete(`/products/wishlist/${id}`);

// Cart
export const getCart = () => client.get("/shopping/cart");
export const addToCart = (id, qty = 1) =>
  client.put(`/products/cart/${id}`, { qty });
export const removeFromCart = (id) => client.delete(`/products/cart/${id}`);

// Orders
export const getOrders = () => client.get("/shopping/orders");

// Payments
export const startPayment = (items) =>
  client.post("/payments/start", { items });
export const completePayment = (data) => client.post("/payments/complete", data);
export const getPayments = () => client.get("/payments/");
