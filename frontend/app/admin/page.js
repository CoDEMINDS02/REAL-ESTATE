"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

const empty = {
  title: "",
  description: "",
  price: "",
  type: "house",
  status: "sale",
  bedrooms: "",
  bathrooms: "",
  areaSqft: "",
  featured: false,
  location: { city: "", area: "" },
  images: [{ url: "" }],
};

export default function AdminPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProperties = async () => {
    const res = await api.get("/properties", { params: { limit: 100 } });
    setProperties(res.data.properties || []);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        areaSqft: Number(form.areaSqft) || 0,
      };
      if (editingId) {
        await api.put(`/properties/${editingId}`, payload);
      } else {
        await api.post("/properties", payload);
      }
      setForm(empty);
      setEditingId(null);
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const edit = (p) => {
    setForm({ ...empty, ...p, location: p.location || { city: "", area: "" }, images: p.images?.length ? p.images : [{ url: "" }] });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this property?")) return;
    await api.delete(`/properties/${id}`);
    fetchProperties();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="bg-stone min-h-screen">
      <Navbar />
      <section className="px-8 md:px-16 pt-32 pb-24">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-3xl">Admin dashboard</h1>
          <button onClick={logout} className="text-sm uppercase tracking-wide underline">
            Log out
          </button>
        </div>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 bg-white/50 border border-charcoal/10 p-6 rounded-sm mb-16">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input required type="number" placeholder="Price (Rs)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input required placeholder="City" value={form.location.city} onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input placeholder="Area / neighbourhood" value={form.location.area} onChange={(e) => setForm({ ...form, location: { ...form.location, area: e.target.value } })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm">
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
          <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input type="number" placeholder="Area (sqft)" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <input placeholder="Image URL" value={form.images[0]?.url || ""} onChange={(e) => setForm({ ...form, images: [{ url: e.target.value }] })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-charcoal/20 px-3 py-2 text-sm rounded-sm md:col-span-2 h-24" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Feature on homepage
          </label>
          <button type="submit" className="bg-charcoal text-stone py-3 text-sm uppercase tracking-wide md:col-span-2">
            {editingId ? "Update property" : "Add property"}
          </button>
        </form>

        <h2 className="font-display text-2xl mb-6">All listings ({properties.length})</h2>
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p._id} className="flex justify-between items-center bg-white/50 border border-charcoal/10 px-5 py-3 rounded-sm">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-charcoal/50">{p.location?.city} · Rs {Number(p.price).toLocaleString()}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <button onClick={() => edit(p)} className="underline">Edit</button>
                <button onClick={() => remove(p._id)} className="underline text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
