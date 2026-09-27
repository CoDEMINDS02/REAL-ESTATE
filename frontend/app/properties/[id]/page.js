"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (id) api.get(`/properties/${id}`).then((res) => setProperty(res.data)).catch(() => {});
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inquiries", { ...form, property: id });
      setSent(true);
    } catch {
      alert("Could not send inquiry, please try again.");
    }
  };

  if (!property) {
    return (
      <main className="bg-stone min-h-screen">
        <Navbar />
        <p className="pt-40 px-8 text-charcoal/50">Loading property…</p>
      </main>
    );
  }

  const img = property.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";

  return (
    <main className="bg-stone min-h-screen">
      <Navbar />
      <section className="px-8 md:px-16 pt-32 pb-24">
        <img src={img} alt={property.title} className="w-full h-[420px] object-cover rounded-sm mb-10" />

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="uppercase tracking-widest text-xs text-brass mb-3">{property.location?.city}</p>
            <h1 className="font-display text-4xl mb-4">{property.title}</h1>
            <p className="font-display text-2xl text-charcoal mb-6">
              Rs {Number(property.price).toLocaleString()}
            </p>
            <div className="flex gap-6 text-sm text-charcoal/70 mb-8">
              <span>{property.bedrooms} bed</span>
              <span>{property.bathrooms} bath</span>
              <span>{property.areaSqft} sqft</span>
              <span className="capitalize">{property.type}</span>
            </div>
            <p className="text-charcoal/70 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          <div className="bg-white/50 border border-charcoal/10 p-6 rounded-sm h-fit">
            <h3 className="font-display text-xl mb-4">Interested in this property?</h3>
            {sent ? (
              <p className="text-sm text-charcoal/70">
                Thanks — an agent will reach out shortly.
              </p>
            ) : (
              <form onSubmit={submitInquiry} className="space-y-3">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-charcoal/20 px-3 py-2 text-sm rounded-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-charcoal/20 px-3 py-2 text-sm rounded-sm"
                />
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-charcoal/20 px-3 py-2 text-sm rounded-sm"
                />
                <textarea
                  required
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-charcoal/20 px-3 py-2 text-sm rounded-sm h-24"
                />
                <button type="submit" className="w-full bg-charcoal text-stone py-2 text-sm uppercase tracking-wide">
                  Send inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
