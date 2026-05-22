import { useState, useEffect } from "react";
import { getProfile, updateProfile, addAddress } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user: authUser, login: authLogin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    password: "", sms_notification: false, email_notification: false,
  });
  const [addressForm, setAddressForm] = useState({
    street: "", city: "", postalCode: "", country: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        const p = res.data?.data;
        setProfile(p);
        setForm({
          name: p?.name || "",
          email: p?.email || "",
          phone: p?.phone || "",
          password: "",
          sms_notification: p?.sms_notification || false,
          email_notification: p?.email_notification || false,
        });
      } catch {
        setMsg({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        sms_notification: form.sms_notification,
        email_notification: form.email_notification,
      };
      if (form.password) payload.password = form.password;
      const res = await updateProfile(payload);
      const p = res.data?.data;
      setProfile(p);
      authLogin({ ...authUser, name: p.name, email: p.email }, localStorage.getItem("token"));
      setEditMode(false);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Update failed." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress(addressForm);
      const res = await getProfile();
      setProfile(res.data?.data);
      setShowAddAddress(false);
      setAddressForm({ street: "", city: "", postalCode: "", country: "" });
      setMsg({ type: "success", text: "Address added!" });
    } catch {
      setMsg({ type: "error", text: "Failed to add address." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">👤 My Profile</h1>

      {msg.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {profile?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{profile?.name}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary text-sm"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" placeholder="Leave blank to keep current" />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.sms_notification} onChange={(e) => setForm(f => ({ ...f, sms_notification: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">SMS Notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.email_notification} onChange={(e) => setForm(f => ({ ...f, email_notification: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Email Notifications</span>
              </label>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{profile?.email || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{profile?.phone || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">SMS Notifications</p>
              <p className="font-medium text-gray-900">{profile?.sms_notification ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <p className="text-gray-500">Email Notifications</p>
              <p className="font-medium text-gray-900">{profile?.email_notification ? "Enabled" : "Disabled"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">📍 Addresses</h2>
          <button onClick={() => setShowAddAddress(!showAddAddress)} className="btn-secondary text-sm">
            {showAddAddress ? "Cancel" : "+ Add Address"}
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <input type="text" placeholder="Street address" value={addressForm.street} onChange={(e) => setAddressForm(f => ({ ...f, street: e.target.value }))} className="input-field" required />
              </div>
              <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm(f => ({ ...f, city: e.target.value }))} className="input-field" required />
              <input type="text" placeholder="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm(f => ({ ...f, postalCode: e.target.value }))} className="input-field" required />
              <div className="sm:col-span-2">
                <input type="text" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm(f => ({ ...f, country: e.target.value }))} className="input-field" required />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? "Adding..." : "Save Address"}
            </button>
          </form>
        )}

        {profile?.address?.length > 0 ? (
          <div className="space-y-3">
            {profile.address.map((addr, i) => (
              <div key={addr._id || i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg mt-0.5">📍</span>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{addr.street}</p>
                  <p>{addr.city}, {addr.postalCode}</p>
                  <p>{addr.country}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No addresses saved yet.</p>
        )}
      </div>
    </div>
  );
}
