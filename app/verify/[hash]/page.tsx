"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import MatrixBackground from "../../components/matrixBackground";
import PerspectiveGrid from "../../components/perspectiveGrid";
import AmbientGlows from "../../components/ambientGlows";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import PublicVerificationStatus from "@/app/components/publicVerificationStatus";
import VerificationSkeleton from "@/app/components/verificationSkeleton";
import { mockVerification } from "@/lib/mockData";
import { fetchVerification, recheckCertificateFile } from "@/lib/api";
import { VerificationResult } from "@/lib/types";

export default function PublicVerifyPage() {
  const params = useParams();
  const hash = params?.hash as string | undefined;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [recheckFile, setRecheckFile] = useState<File | null>(null);
  const [recheckStatus, setRecheckStatus] = useState<
    "idle" | "checking" | "match" | "mismatch" | "error"
  >("idle");

  useEffect(() => {
    if (!hash) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchVerification(hash);
        if (!cancelled) {
          setResult(data as VerificationResult);
          setNotFound(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [hash]);

  if (!hash) {
    return (
      <>
        <MatrixBackground />
        <PerspectiveGrid />
        <AmbientGlows />
        <Navbar />
        <main className="relative z-10 px-6 pt-24 pb-24">
          <div className="min-h-[60vh] flex items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-red-500">
              ⚠️ Invalid Verification Link
            </h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <MatrixBackground />
        <PerspectiveGrid />
        <AmbientGlows />
        <Navbar />
        <VerificationSkeleton />
        <Footer />
      </>
    );
  }

  if (notFound || !result) {
    return (
      <>
        <MatrixBackground />
        <PerspectiveGrid />
        <AmbientGlows />
        <Navbar />
        <main className="relative z-10 px-6 pt-24 pb-24">
          <div className="max-w-5xl mx-auto mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-slate-300 glass-button px-3 py-1.5 rounded-lg"
            >
              <span className="text-lg">←</span>
              <span>Back to TruthStamp</span>
            </Link>
          </div>

          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="glass-panel p-10 rounded-2xl max-w-lg text-center border border-red-500/30">
              <h1 className="text-3xl font-bold text-red-500 mb-3">
                Verification Failed
              </h1>

              <p className="text-slate-400 mb-6">
                This media does not correspond to any verified record in the
                TruthStamp public registry.
              </p>

              <div className="font-mono text-xs text-slate-500 space-y-1 text-left">
                <div>Fingerprint: {hash}</div>
                <div>Status: NOT FOUND</div>
                <div>Registry: Public Ledger</div>
                <div>Reason: Possible file modification</div>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                Authentic files verified by TruthStamp can always be
                independently checked using their embedded QR code.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleRecheck = async () => {
    if (!recheckFile || !hash) return;
    setRecheckStatus("checking");
    try {
      const res = await recheckCertificateFile(hash, recheckFile);
      setRecheckStatus(res.matches ? "match" : "mismatch");
    } catch (e) {
      console.error(e);
      setRecheckStatus("error");
    }
  };

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
            <span>Back to TruthStamp</span>
          </Link>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Public verification — scan result
          </span>
        </div>

        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-10">
          <PublicVerificationStatus result={result ?? mockVerification} />

          <div className="max-w-xl w-full glass-panel p-6 rounded-2xl border border-slate-700/80 text-xs text-slate-200">
            <h2 className="text-sm font-semibold mb-2 text-slate-100">
              File Re-check (Anti-Photoshop)
            </h2>
            <p className="text-slate-400 mb-3">
              Upload the certificate file again. We recompute its fingerprint
              and confirm it still matches the anchored hash. Any pixel-level
              edit breaks the match.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setRecheckFile(f);
                    setRecheckStatus("idle");
                  }
                }}
                className="flex-1 text-[11px] text-slate-300"
              />
              <button
                onClick={handleRecheck}
                disabled={!recheckFile || recheckStatus === "checking"}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-[11px] hover:bg-emerald-400 transition-colors disabled:opacity-60"
              >
                {recheckStatus === "checking" ? "Checking..." : "Re-check File"}
              </button>
            </div>
            {recheckStatus === "match" && (
              <p className="mt-3 text-emerald-400">
                ✔ This file perfectly matches the anchored fingerprint.
              </p>
            )}
            {recheckStatus === "mismatch" && (
              <p className="mt-3 text-red-400">
                ⚠ This file does NOT match the anchored fingerprint. It may
                have been edited or corrupted.
              </p>
            )}
            {recheckStatus === "error" && (
              <p className="mt-3 text-amber-400">
                Could not re-check this file. Please try again.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
