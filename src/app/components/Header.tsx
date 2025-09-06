"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import p1 from "../../../public/fadhil-abhimantra-vS7GjQ3lY3M-unsplash.jpg";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Header() {
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const toggleBurger = () => setIsBurgerActive((p) => !p);

  const headerTriggersRef = useRef<ScrollTrigger[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  // Smooth scroll
  const smoothScrollToId = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerEl = document.querySelector(".header") as HTMLElement;
    const offsetY = headerEl ? headerEl.offsetHeight : 0;

    gsap.to(window, {
      duration: 0.8,
      ease: "power3.out",
      scrollTo: { y: target, offsetY, autoKill: true },
      overwrite: "auto",
    });
  };

  // Efek warna header saat dark-zone
  useEffect(() => {
    const setColor = (color: string) =>
      gsap.to([".header-logo", ".burger"], {
        color,
        duration: 0.3,
        overwrite: "auto",
      });

    const killOwn = () => {
      headerTriggersRef.current.forEach((t) => t.kill());
      headerTriggersRef.current = [];
    };

    const create = () => {
      const zones = document.querySelectorAll(".dark-zone");
      if (!zones.length) return;

      setColor("#000");
      killOwn();

      zones.forEach((zone) => {
        const t = ScrollTrigger.create({
          trigger: zone,
          start: "top 5%",
          end: "bottom top",
          onEnter: () => !isBurgerActive && setColor("#fff"),
          onEnterBack: () => !isBurgerActive && setColor("#fff"),
          onLeave: () => !isBurgerActive && setColor("#000"),
          onLeaveBack: () => !isBurgerActive && setColor("#000"),
        });
        headerTriggersRef.current.push(t);
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    create();
    return () => killOwn();
  }, [isBurgerActive]);

  // Animasi intro
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title span", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
      })
        .from(
          ".hero-sub span",
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 },
          "-=0.4"
        )
        .from(
          ".hero-services p",
          { x: -40, opacity: 0, stagger: 0.2, duration: 0.6 },
          "-=0.3"
        )
        .from(
          ".hero-img",
          { scale: 1.2, opacity: 0, duration: 1 },
          "-=0.5"
        )
        .from(
          ".hero-description",
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      className={`header relative ${isBurgerActive ? "burger-active" : ""}`}
      ref={heroRef}
    >
      <section className="px-6 md:px-12 flex flex-col md:flex-row justify-between gap-10 items-center relative">
        {/* Left Side - Title */}
        <div className="relative flex flex-col items-center md:items-start pb-5">
          <h1 className="hero-title text-[12vw] md:text-[8vw] font-extrabold leading-[0.9] uppercase header-logo">
            {"CREATIVE".split("").map((c, i) => (
              <span key={`c-${i}`} className="inline-block hero-letter">
                {c}
              </span>
            ))}
            <br />
            {"DESIGNER".split("").map((c, i) => (
              <span key={`d-${i}`} className="inline-block hero-letter">
                {c}
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-4 text-xs md:text-sm tracking-[0.5em] uppercase absolute bottom-0 right-0">
            {"Based in Aceh Darussalam".split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-1">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Right Side - Services + Image */}
        <div className="flex relative items-end">
          <div className="hero-services space-y-2 text-base md:text-lg font-medium w-[15rem] h-[20rem] flex flex-col justify-end p-2 bg-gray-200">
            <p>/ Art Direction</p>
            <p>/ Web Design (UX/UI)</p>
            <p>/ Web Development</p>
          </div>
          <Image
            src={p1}
            alt="Profile"
            className="hero-img w-[200px] md:w-[300px] h-[280px] md:h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Description */}
      <section className="hero-description mt-8 text-base md:text-lg max-w-2xl text-center mx-auto">
        I’m an experienced web and UX/UI designer, who designs memorable web
        experiences for brands of all sizes.
      </section>
    </header>
  );
}
