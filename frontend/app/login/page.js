"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="bg-stone min-h-screen">
      <Navbar />
      <section className="px-8 pt-40 pb-24 max-w-sm mx-auto">
        <h1 className="font-display text-3xl mb-8 text-center">Agent login</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-charcoal/20 px-4 py-3 text-sm rounded-sm bg-white/50"
          />
          <button type="submit" className="w-full bg-charcoal text-stone py-3 text-sm uppercase tracking-wide">
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}
