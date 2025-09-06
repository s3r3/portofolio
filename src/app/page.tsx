"use client";
import { useEffect, useState } from "react";
import SplashScreen from "./components/loading";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Navbar from "./components/navbar";
import About from "./components/about";
import Header  from "./components/Header";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Hero animations
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power4.out",
      });

      gsap.from(".hero-services p", {
        x: -50,
        opacity: 0,
        stagger: 0.2,
        delay: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-img", {
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.6,
        ease: "power4.out",
      });

      // Scroll animations for other sections
      gsap.from(".section", {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".section",
          start: "top 80%",
        },
      });
    }
  }, [loading]);

  return (
    <>
      {loading && <SplashScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <main className="bg-white text-black font-sans flex flex-col ">
          {/* Navbar */}
          <Navbar />
          <section>
            <Header />
          </section>
          <section>
            <About />
          </section>
          {/* Section berikutnya untuk tes scroll animasi */}
          
        </main>
      )}
    </>
  );
}