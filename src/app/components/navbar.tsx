"use client";

export default function Navbar() {
  return (
    <header className="w-full flex justify-between items-center px-10 py-6 font-sans uppercase text-sm tracking-wider">
      {/* Logo */}
      <div className="font-extrabold text-lg">MUHAMMAD<br />FARID</div>

      {/* Navigation */}
      <nav className="flex gap-10">
        <a href="#about" className="hover:opacity-60">[ About Me ]</a>
        <a href="#works" className="hover:opacity-60">[ Works ]</a>
        <a href="#services" className="hover:opacity-60">[ Services ]</a>
        <a href="#connect" className="hover:opacity-60">[ Connect ]</a>
      </nav>

      {/* Contact */}
      <a
        href="#contact"
        className="text-xs border-b border-black uppercase hover:opacity-60"
      >
        Contact Me ↗
      </a>
    </header>
  );
}
