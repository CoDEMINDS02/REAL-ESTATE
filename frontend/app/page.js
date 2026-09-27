"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero3DHouse from "@/components/Hero3DHouse";
import PropertyCard from "@/components/PropertyCard";
import api from "@/lib/api";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    api
      .get("/properties/featured")
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  useEffect(() => {
    (async () => {
      const mod = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(mod.ScrollTrigger);
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
        });
      }
    })();
  }, [properties]);

  return (
    <main className="bg-stone">
      <Navbar />
      <Hero3DHouse />

      <section className="px-8 md:px-16 py-24 bg-charcoal text-stone">
        <p className="uppercase tracking-[0.3em] text-xs text-brass mb-4">Featured</p>
        <h2 className="font-display text-3xl md:text-5xl max-w-2xl mb-16">
          A short list of addresses worth your attention
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.length === 0 && (
            <p className="text-stone/50 col-span-3 text-sm">
              No properties yet — add some from the admin panel, or connect the backend to see live listings here.
            </p>
          )}
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      </section>

      <section className="px-8 md:px-16 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-brass mb-4">Why Meridian</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">
            We show fewer homes, so each one gets more of our attention
          </h2>
          <p className="text-charcoal/70 leading-relaxed">
            Every listing on Meridian is verified in person, photographed properly, and priced
            against real comparables — not wishful thinking. Our agents know each neighbourhood
            street by street.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
          className="rounded-sm w-full h-96 object-cover"
          alt="Interior"
        />
      </section>

      <Footer />
    </main>
  );
}
