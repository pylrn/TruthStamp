"use client";

import Link from "next/link";
import MatrixBackground from "../components/matrixBackground";
import PerspectiveGrid from "../components/perspectiveGrid";
import AmbientGlows from "../components/ambientGlows";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function CredentialsHomePage() {
  return (
    <>
      <MatrixBackground />
      <PerspectiveGrid />
      <AmbientGlows />
      <Navbar />

      <main className="relative z-10 px-6 pt-24 pb-24">
        <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-300 glass-button px-3 py-1.5 rounded-lg"
          >
            <span className="text-lg">←</span>
            <span>Back to main landing</span>
          </Link>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Achievement Locker
          </span>
        </div>

        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
          {/* STUDENT SECTION */}
          <div className="glass-panel border border-emerald-500/20 rounded-2xl p-8 flex flex-col gap-4 hover:border-emerald-500/40 transition">
            <h1 className="text-2xl font-semibold text-emerald-400">
              For Students & Recipients
            </h1>
            <p className="text-sm text-slate-300">
              Upload an image of your certificate. We will send it to your
              organization for verification. Once approved, it gets digitally
              stamped with a QR code.
            </p>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>Upload certificate image (JPG/PNG)</li>
              <li>Provide Organization ID</li>
              <li>Get a verifiable QR-stamped version</li>
            </ul>
            <Link
              href="/certificates"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 text-black font-semibold px-4 py-3 text-sm hover:bg-emerald-400 transition-colors"
            >
              Start Claim Process
            </Link>
          </div>

          {/* ORGANIZATION SECTION */}
          <div className="glass-panel border border-sky-500/20 rounded-2xl p-8 flex flex-col gap-4 hover:border-sky-500/40 transition">
            <h2 className="text-xl font-semibold text-sky-400">
              For Organizations
            </h2>
            <p className="text-sm text-slate-300">
              Login with your Organization ID to view pending claims. Approve
              valid certificates to instantly apply the TruthStamp verification
              seal.
            </p>

            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>View pending image uploads</li>
              <li>One-click Approve & Stamp</li>
              <li>No blockchain wallet required</li>
            </ul>

            <Link
              href="/credentials/admin"
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-sky-500/60 text-sky-200 font-semibold px-4 py-3 text-sm hover:bg-sky-500/10 transition-colors"
            >
              Organization Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
