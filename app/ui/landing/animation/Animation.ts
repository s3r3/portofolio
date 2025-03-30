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
//animation scramble text
export const scrambleText = (
  element: HTMLElement,
  text: string,
  duration: number
) => {
  const chars = "!1€5@#][6&$(=)£AF/&(234$$2N€O=(!@[";
  let scrambled = text
    .split("")
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");

  let iteration = 0;
  const interval = setInterval(() => {
    scrambled = scrambled
      .split("")
      .map((char, index) =>
        index < iteration
          ? text[index]
          : chars[Math.floor(Math.random() * chars.length)]
      )
      .join("");

    element.innerText = scrambled;

    if (iteration >= text.length) clearInterval(interval);
    iteration++;
  }, duration / text.length);
};

//  animationfor icon
export const iconAnimation = () => {
  useEffect(() => {
    gsap.from(".social-icon", {
      y: -50,
      stagger: 0.2,
      duration: 1,
      ease: "bounce.out",
    });
  }, []);
  return null;
};

export const borderAnimation = () => {
  useEffect(() => {
    gsap.from(".border-animate", {
      height: 0,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);
  return null;
};
//button animation
export const codeButtonAnimation = (element: HTMLElement) => {
  gsap.fromTo(element, {
    opacity: 0,
    scale: 0.5,
  }, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "power1.inOut",
  });
};