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

// animation scramble text
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
  let isAnimated = false; // Flag untuk menandai apakah animasi sudah pernah dijalankan
  let lastScrollY = 0; // Flag untuk menandai posisi scroll sebelumnya
  let interval = setInterval(() => {
    if (!isAnimated) {
      scrambled = scrambled
        .split("")
        .map((char, index) =>
          index < iteration
            ? text[index]
            : chars[Math.floor(Math.random() * chars.length)]
        )
        .join("");

      element.innerText = scrambled;

      if (iteration >= text.length) {
        clearInterval(interval);
        isAnimated = true; // Set flag ke true setelah animasi selesai
      }
      iteration++;
    }
  }, duration / text.length);

  // Listener untuk menangkap event scroll
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const offsetTop = element.offsetTop;
    if (currentScrollY < offsetTop && currentScrollY < lastScrollY) {
      // Jika user sedang scroll ke atas dan mencapai bagian animasi
      iteration = 0; // Reset iteration
      isAnimated = false; // Reset flag
      interval = setInterval(() => {
        // Jalankan animasi lagi
        scrambled = scrambled
          .split("")
          .map((char, index) =>
            index < iteration
              ? text[index]
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("");

        element.innerText = scrambled;

        if (iteration >= text.length) {
          clearInterval(interval);
          isAnimated = true;
        }
        iteration++;
      }, duration / text.length);
    }

    lastScrollY = currentScrollY;
  });
};

//  animation for icon
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

// button animation
export const codeButtonAnimation = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.5,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power1.inOut",
    }
  );
};

// skills animation
export const skillsSvgAnimation = () => {
  useEffect(() => {
    gsap.to(".skills-svg", {
      yoyo: true,
      repeat: 0,
      duration: 5,
      ease: "power1.inOut",
    });

    gsap.to(".dotss", {
      x: 20,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });

    gsap.to(".logos", {
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });
  }, []);
  return null;
};
