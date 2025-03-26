'use client'
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Page() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headingRef.current && paragraphRef.current) {
      gsap.from(headingRef.current, { y: -50, opacity: 0, duration: 1 });
      gsap.from(paragraphRef.current, { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    }
  }, []);

  return (
    <div
      className={` flex flex-col items-center justify-center h-screen`}
    >
      <h1 ref={headingRef} className="text-4xl font-bold">
        Hello, world!
      </h1>
      <p ref={paragraphRef} className="text-lg">
        This is a new page.
      </p>
      <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-soft">Responsive</button>
    </div>
  );
}