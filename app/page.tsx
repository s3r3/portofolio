"use client";
import { useEffect, useRef } from "react";

import Header from "./ui/landing/header";
export default function Page() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="px-[171px] bg-[#282C33]">
      <Header />
    </div>
  );
}
