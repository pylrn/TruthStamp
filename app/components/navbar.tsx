"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030407]/70 backdrop-blur-xl select-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
            <div className="relative w-full h-full rounded-lg bg-black border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
              <img src="/icon.png" alt="Logo" width={56} height={56} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg text-center font-bold text-white/90">TRUTHSTAMP</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/verify-media"
            className="hidden md:inline-flex glass-button px-4 py-2 rounded-lg items-center gap-2 border-beam-box"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white/90">
              Media Reality Check
            </span>
          </Link>
          <Link
            href="/credentials"
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 border-beam-box"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-bold text-white/90">
              Achievement Locker
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
