"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 transition-all duration-500 ${
        scrolled ? "py-4 bg-stone/95 backdrop-blur shadow-sm" : "py-8 bg-transparent"
      }`}
    >
      <Link href="/" className="font-display text-xl tracking-wide text-charcoal">
        Meridian Estates
      </Link>
      <div className="hidden md:flex gap-10 text-sm tracking-wide uppercase text-charcoal">
        <Link href="/properties" className="hover:text-brass transition-colors">Properties</Link>
        <Link href="/contact" className="hover:text-brass transition-colors">Contact</Link>
        <Link href="/login" className="hover:text-brass transition-colors">Agent login</Link>
      </div>
    </nav>
  );
}
