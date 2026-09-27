"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import api from "@/lib/api";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ city: "", type: "", minPrice: "", maxPrice: "" });
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await api.get("/properties", { params });
      setProperties(res.data.properties || []);
    } catch {
      setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-stone min-h-screen">
      <Navbar />
      <section className="px-8 md:px-16 pt-36 pb-10">
        <h1 className="font-display text-4xl md:text-5xl mb-10">All properties</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProperties();
          }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <input
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="border border-charcoal/20 bg-white/50 px-4 py-2 text-sm rounded-sm"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border border-charcoal/20 bg-white/50 px-4 py-2 text-sm rounded-sm"
          >
            <option value="">Any type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
          <input
            placeholder="Min price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="border border-charcoal/20 bg-white/50 px-4 py-2 text-sm rounded-sm w-32"
          />
          <input
            placeholder="Max price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="border border-charcoal/20 bg-white/50 px-4 py-2 text-sm rounded-sm w-32"
          />
          <button type="submit" className="bg-charcoal text-stone px-6 py-2 text-sm uppercase tracking-wide">
            Search
          </button>
        </form>

        {loading && <p className="text-charcoal/50 text-sm">Loading...</p>}
        {!loading && properties.length === 0 && (
          <p className="text-charcoal/50 text-sm">
            No properties found. Connect the backend and add listings from the admin panel.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
