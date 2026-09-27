"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inquiries", form);
      setSent(true);
    } catch {
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <main className="bg-stone min-h-screen">
      <Navbar />
      <section className="px-8 md:px-16 pt-36 pb-24 max-w-xl">
        <h1 className="font-display text-4xl mb-4">Get in touch</h1>
        <p className="text-charcoal/70 mb-10">
          Tell us what you're looking for and an agent will follow up within one business day.
        </p>
        {sent ? (
          <p className="text-charcoal/70">Thanks for reaching out — we'll be in touch soon.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50"
            />
            <textarea
              required
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50 h-32"
            />
            <button type="submit" className="bg-charcoal text-stone px-8 py-3 text-sm uppercase tracking-wide">
              Send message
            </button>
          </form>
        )}
      </section>
      <Footer />
    </main>
  );
}
