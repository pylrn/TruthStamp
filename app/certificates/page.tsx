"use client";

import Link from "next/link";
import CertificateUpload from "../components/certificateUpload";
import MatrixBackground from "../components/matrixBackground";
import PerspectiveGrid from "../components/perspectiveGrid";
import AmbientGlows from "../components/ambientGlows";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function CertificatePage() {
  return (
    <>
      <MatrixBackground />
      <PerspectiveGrid />
      <AmbientGlows />
      <Navbar />

      <main className="relative z-10 px-6 pt-24 pb-24 min-h-screen flex flex-col">
        {/* Navigation Header */}
        <div className="max-w-5xl w-full mx-auto mb-8 flex justify-between items-center gap-3">
          <Link
            href="/credentials"
            className="inline-flex items-center gap-2 text-xs text-slate-300 glass-button px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">←</span>
            <span>Back</span>
          </Link>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Student View · Upload Certificate Image
          </span>
        </div>

        {/* Upload Form Component */}
        <div className="flex-grow flex flex-col justify-center">
          <CertificateUpload />
        </div>
      </main>

      <Footer />
    </>
  );
}
