"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

import MatrixBackground from "../components/matrixBackground";
import PerspectiveGrid from "../components/perspectiveGrid";
import AmbientGlows from "../components/ambientGlows";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { submitCertificateClaim } from "@/lib/api";

export default function CertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your certificate PDF.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitCertificateClaim({
        file,
        name,
        org,
        event,
        date,
        category,
      });
      setHash(res.hash);
      setClaimId(res.claimId ?? null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit certificate for approval.");
    } finally {
      setSubmitting(false);
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
            <span>Back to main landing</span>
          </Link>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Mode B · Achievement Locker — Student view
          </span>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="glass-panel max-w-2xl w-full p-8 rounded-2xl border border-emerald-500/30 mx-auto">
            <h1 className="text-2xl font-semibold text-emerald-400 mb-2">
              Submit Certificate for Verification
            </h1>
            <p className="text-sm text-slate-300 mb-6">
              Your issuing organization will see this claim in their TruthStamp
              dashboard. Once they approve, your certificate will be anchored on
              chain and stamped with a QR code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Your Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Organization
                  </label>
                  <input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Event / Program
                  </label>
                  <input
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Date on Certificate
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Category (e.g. Hackathon, Scholarship, Employment)
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Certificate PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                  className="w-full text-xs text-slate-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </button>
            </form>

            {hash && (
              <div className="mt-6 text-xs text-emerald-300 font-mono space-y-1">
                <div>
                  Status: <span className="font-bold">PENDING REVIEW</span>
                </div>
                <div>Fingerprint: {hash}</div>
                {claimId && <div>Claim ID: {claimId}</div>}
                <p className="text-[11px] text-slate-500 mt-2">
                  Share this fingerprint with your issuing organization so they
                  can locate and approve your claim in their TruthStamp
                  dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

