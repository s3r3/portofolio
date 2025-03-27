'use client'
import { useEffect, useRef } from "react";

import Header from "./components/header";
export default function Page() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  

  return (
    <div className="px-[171px] ">
      <Header />
    </div>
  );
}