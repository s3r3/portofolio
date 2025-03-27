// biodata/app/ui/landing/Animation.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
// This is the animation for the dots in the landing page

export function EffectSVG() {
  useEffect(() => {
    gsap.to(".dots, .logo", {
      y: 20,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });
  }, []);

  return null;
}

export const scrambleText = (element: HTMLElement, text: string, duration: number) => {
  const chars = "!1€5@#][6&$(=)£AF/&(234$$2N€O=(!@[";
  let scrambled = text.split("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");

  let iteration = 0;
  const interval = setInterval(() => {
    scrambled = scrambled
      .split("")
      .map((char, index) => (index < iteration ? text[index] : chars[Math.floor(Math.random() * chars.length)]))
      .join("");

    element.innerText = scrambled;

    if (iteration >= text.length) clearInterval(interval);
    iteration++;
  }, duration / text.length);
};

// Cara pakai

