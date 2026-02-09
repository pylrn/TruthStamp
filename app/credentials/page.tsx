"use client";

import Link from "next/link";

import MatrixBackground from "../components/matrixBackground";
import PerspectiveGrid from "../components/perspectiveGrid";
import AmbientGlows from "../components/ambientGlows";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { useIssuerAuth } from "../hooks/useIssuerAuth";

export default function CredentialsHomePage() {
  const { address, role, isConnected, loading, connect, disconnect } =
    useIssuerAuth();

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
            Achievement Locker · Bridge between students and issuers
          </span>
        </div>

        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(0,2fr)]">
          <div className="glass-panel border border-emerald-500/20 rounded-2xl p-8 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-emerald-400">
              Achievement Locker
            </h1>
            <p className="text-sm text-slate-300">
              Upload a certificate (PDF) plus your achievement details. We
              create a tamper-proof{" "}
              <span className="font-mono">TruthStamp</span> fingerprint that
              your school, company, or hackathon organizer can independently
              verify.
            </p>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>Upload your official certificate as a PDF</li>
              <li>Fill in name, org, event, date, and category</li>
              <li>Share the fingerprint with your issuing organization</li>
            </ul>
            <Link
              href="/certificates"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 text-black font-semibold px-4 py-2 text-sm hover:bg-emerald-400 transition-colors"
            >
              Upload Certificate
            </Link>
          </div>

          <div className="glass-panel border border-sky-500/20 rounded-2xl p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-sky-400">
                  Issuer / Admin Console
                </h2>
                <p className="text-xs text-slate-400">
                  Sign in with MetaMask as an issuing organization to review and
                  approve claims.
                </p>
              </div>
              <button
                onClick={isConnected ? disconnect : connect}
                className="px-3 py-1.5 rounded-lg border border-sky-500/60 text-sky-100 text-xs font-semibold hover:bg-sky-500/10 transition-colors"
              >
                {loading
                  ? "Connecting..."
                  : isConnected
                  ? "Disconnect"
                  : "Connect Wallet"}
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 font-mono bg-black/30 rounded-lg p-3 border border-slate-800">
              <div>
                Address:{" "}
                {address ? (
                  <span className="text-emerald-400">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                ) : (
                  <span className="text-slate-500">Not connected</span>
                )}
              </div>
              <div>
                Role:{" "}
                <span className="uppercase tracking-wide text-sky-400">
                  {role}
                </span>
              </div>
              <div>
                Permissions:{" "}
                {role === "approver"
                  ? "Review + approve + revoke"
                  : role === "reviewer"
                  ? "Review and recommend"
                  : "View only"}
              </div>
            </div>

            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>See a queue of pending achievement claims</li>
              <li>Approve / reject with reason, or request re-upload</li>
              <li>
                Approved claims are anchored on-chain and stamped with a QR code
              </li>
            </ul>

            <Link
              href="/credentials/admin"
              className="mt-2 inline-flex items-center justify-center rounded-lg border border-sky-500/60 text-sky-200 font-semibold px-4 py-2 text-sm hover:bg-sky-500/10 transition-colors"
            >
              Open Admin Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

