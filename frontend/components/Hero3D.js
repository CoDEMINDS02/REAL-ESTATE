"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero3D() {
  const sectionRef = useRef(null);
  const layersRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    let ScrollTrigger;
    (async () => {
      const mod = await import("gsap/ScrollTrigger");
      ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const layers = layersRef.current;

      gsap.set(sectionRef.current, { transformPerspective: 1200 });

      // Building floors rise + rotate in 3D as the hero pins and scrolls
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
        },
      })
        .to(layers[2], { yPercent: -20, rotateX: 8, z: -100, ease: "none" }, 0)
        .to(layers[1], { yPercent: -45, rotateX: 14, z: -220, ease: "none" }, 0)
        .to(layers[0], { yPercent: -75, rotateX: 20, z: -340, ease: "none" }, 0)
        .to(titleRef.current, { yPercent: -120, opacity: 0, ease: "none" }, 0)
        .to(sectionRef.current, { backgroundColor: "#1c1b19", ease: "none" }, 0);

      // gentle entrance
      gsap.from(titleRef.current, { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
    })();

    return () => {
      if (ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden perspective bg-stone"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={(el) => (layersRef.current[0] = el)}
        className="absolute inset-0 flex items-end justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600"
          className="w-full h-full object-cover opacity-90"
          alt="Modern architecture"
        />
      </div>

      <div
        ref={(el) => (layersRef.current[1] = el)}
        className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"
      />

      <div
        ref={(el) => (layersRef.current[2] = el)}
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-charcoal/20 backdrop-blur-sm"
      />

      <div ref={titleRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-stone mb-6">
          Meridian Estates
        </p>
        <h1 className="font-display text-5xl md:text-8xl text-stone leading-[1.05] max-w-4xl">
          Homes built for how you actually live
        </h1>
        <p className="text-stone/70 mt-6 max-w-md text-sm md:text-base">
          Scroll to step through a curated collection of Karachi's finest addresses.
        </p>
      </div>
    </section>
  );
}
