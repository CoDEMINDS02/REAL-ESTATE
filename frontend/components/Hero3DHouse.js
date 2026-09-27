"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const FEATURES = [
  {
    title: "Verified listings",
    text: "Every property visited and photographed in person before it goes live.",
  },
  {
    title: "Virtual walkthroughs",
    text: "Step through a home from your phone before booking a physical visit.",
  },
  {
    title: "Instant agent contact",
    text: "Message a local agent directly from any listing, no middlemen.",
  },
  {
    title: "Smart price insights",
    text: "See how a property's asking price compares to real neighbourhood sales.",
  },
];

export default function Hero3DHouse() {
  const wrapRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const featureRefs = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    let width = wrap.clientWidth;
    let height = window.innerHeight;

    // ---------- scene setup ----------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ede6d6");
    scene.fog = new THREE.Fog("#ede6d6", 8, 22);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(6, 3.4, 7);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // ---------- lights ----------
    const hemi = new THREE.HemisphereLight("#fff3e0", "#4a4238", 0.9);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff1d6", 1.4);
    sun.position.set(6, 9, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const interiorLight = new THREE.PointLight("#ffd9a0", 0, 8, 2);
    interiorLight.position.set(0, 2, 0);
    scene.add(interiorLight);

    // ---------- ground ----------
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 48),
      new THREE.MeshStandardMaterial({ color: "#cfc4a6", roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ---------- house group ----------
    const house = new THREE.Group();
    scene.add(house);

    const wallMat = new THREE.MeshStandardMaterial({ color: "#f3ead9", roughness: 0.85 });
    const roofMat = new THREE.MeshStandardMaterial({ color: "#b08d57", roughness: 0.6 });
    const doorMat = new THREE.MeshStandardMaterial({ color: "#1c1b19", roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: "#ffd9a0",
      emissive: "#ffb84d",
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 3), wallMat);
    walls.position.y = 1.1;
    walls.castShadow = true;
    walls.receiveShadow = true;
    house.add(walls);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.15, 1.7, 4), roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 3.05;
    roof.castShadow = true;
    house.add(roof);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.08), doorMat);
    door.position.set(0, 0.65, 1.54);
    house.add(door);

    const windowGeo = new THREE.BoxGeometry(0.55, 0.55, 0.06);
    const winPositions = [
      [-1.2, 1.4, 1.54],
      [1.2, 1.4, 1.54],
      [2.02, 1.4, -0.6],
      [2.02, 1.4, 0.6],
      [-2.02, 1.4, -0.6],
      [-2.02, 1.4, 0.6],
    ];
    winPositions.forEach(([x, y, z]) => {
      const win = new THREE.Mesh(windowGeo, glassMat);
      win.position.set(x, y, z);
      house.add(win);
    });

    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1, 0.35),
      new THREE.MeshStandardMaterial({ color: "#8a6a4a" })
    );
    chimney.position.set(1.1, 3.4, -0.3);
    house.add(chimney);

    // ---------- interior (revealed once walls go transparent) ----------
    const interior = new THREE.Group();
    interior.visible = false;

    const sofa = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.5, 0.6),
      new THREE.MeshStandardMaterial({ color: "#7f77dd" })
    );
    sofa.position.set(-1, 0.35, 0.6);
    interior.add(sofa);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.35, 0.5),
      new THREE.MeshStandardMaterial({ color: "#3c3489" })
    );
    table.position.set(0.9, 0.2, -0.4);
    interior.add(table);

    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(1, 24),
      new THREE.MeshStandardMaterial({ color: "#d85a30" })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-0.2, 0.02, 0.2);
    interior.add(rug);

    house.add(interior);

    house.scale.set(0.001, 0.001, 0.001);

    // ---------- animation loop ----------
    let rafId;
    let idleT = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const dt = clock.getDelta();
      idleT += dt;
      if (!scrollActiveRef.current) {
        house.rotation.y += dt * 0.15;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };
    const scrollActiveRef = { current: false };
    render();

    gsap.to(house.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: "back.out(1.4)", delay: 0.2 });

    // ---------- resize ----------
    const onResize = () => {
      width = wrap.clientWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // ---------- scroll-driven scrollytelling ----------
    let scrollTrigger;
    (async () => {
      const mod = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(mod.ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=350%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            scrollActiveRef.current = self.progress > 0.01;
          },
        },
      });
      scrollTrigger = tl.scrollTrigger;

      // phase 1: turntable spin + title fades
      tl.to(house.rotation, { y: Math.PI * 2, duration: 1, ease: "none" }, 0)
        .to(titleRef.current, { opacity: 0, y: -40, duration: 0.35, ease: "none" }, 0.05);

      // phase 2: camera moves in, roof lifts, walls go transparent, interior revealed
      tl.to(camera.position, { x: 2.4, y: 2.1, z: 3.6, duration: 0.9, ease: "none" }, 0.55)
        .to(roof.position, { y: 4.4, duration: 0.9, ease: "none" }, 0.55)
        .to(chimney.position, { y: 4.75, duration: 0.9, ease: "none" }, 0.55)
        .call(() => { wallMat.transparent = true; interior.visible = true; }, null, 0.55)
        .to(wallMat, { opacity: 0.1, duration: 0.9, ease: "none" }, 0.55)
        .to(interiorLight, { intensity: 1.4, duration: 0.9, ease: "none" }, 0.6);

      // phase 3: camera pushes further in, scene fades, feature copy reveals
      tl.to(camera.position, { x: 0.3, y: 1.6, z: 1.4, duration: 1, ease: "none" }, 1.5)
        .to(canvasWrapRef.current, { opacity: 0, duration: 0.5, ease: "none" }, 1.85)
        .to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "none" }, "<");

      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "none" },
          2.0 + i * 0.35
        );
      });
    })();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (scrollTrigger) scrollTrigger.kill();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-screen w-full overflow-hidden bg-stone">
      <div ref={canvasWrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div ref={titleRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-charcoal/70 mb-6">
          Meridian Estates
        </p>
        <h1 className="font-display text-4xl md:text-7xl text-charcoal leading-[1.05] max-w-3xl">
          Step inside before you visit
        </h1>
        <p className="text-charcoal/60 mt-6 max-w-md text-sm md:text-base">
          Scroll to walk through the house, then the features that make finding it easy.
        </p>
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 bg-charcoal text-stone opacity-0 flex flex-col items-center justify-center px-8"
      >
        <p className="uppercase tracking-[0.3em] text-xs text-brass mb-10">What Meridian gives you</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (featureRefs.current[i] = el)}
              className="opacity-0"
            >
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-stone/60 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
