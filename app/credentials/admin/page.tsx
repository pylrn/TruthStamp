"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MatrixBackground from "../../components/matrixBackground";
import PerspectiveGrid from "../../components/perspectiveGrid";
import AmbientGlows from "../../components/ambientGlows";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { fetchOrgClaims, adminActionOnClaim, Claim } from "@/lib/api";

export default function CredentialsAdminPage() {
  // --- State Management ---
  // Auth State (Replaces Wallet Connection)
  const [orgId, setOrgId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Data State
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    if (isLoggedIn && orgId) {
      loadClaims();
      // Optional: Poll for new claims every 10 seconds
      const interval = setInterval(loadClaims, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, orgId]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (orgId.trim().length > 0) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter a valid Organization ID");
    }
  };

  const loadClaims = async () => {
    try {
      setLoading(true);
      const data = await fetchOrgClaims(orgId);
      setClaims(data.claims || []);
    } catch (e) {
      console.error("Failed to load claims:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    claimId: string,
    action: "approve" | "reject"
  ) => {
    setProcessingId(claimId);
    try {
      await adminActionOnClaim(claimId, action);
      await loadClaims(); // Refresh list to show updated status
    } catch (e) {
      alert("Action failed. See console details.");
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  // --- Render ---
  return (
    <>
      <MatrixBackground />
      <PerspectiveGrid />
      <AmbientGlows />
      <Navbar />

      <main className="relative z-10 px-6 pt-24 pb-24 min-h-screen">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-sky-400">
              Organization Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Manage certificate requests (Web2 Mode)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/credentials"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back
            </Link>
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setClaims([]);
                }}
                className="text-xs text-red-400 hover:underline border border-red-900/30 px-3 py-1 rounded-full bg-red-900/10"
              >
                Logout ({orgId})
              </button>
            )}
          </div>
        </div>

        {/* LOGIN SCREEN (Replaces MetaMask Connect) */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl border border-sky-500/30 mt-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Organization Login
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Enter your Organization ID to view and verify student certificate
              claims.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-sky-300 font-bold mb-1">
                  Organization ID
                </label>
                <input
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  placeholder="e.g. ORG-123"
                  className="w-full px-4 py-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                />
                <p className="text-[10px] text-slate-500 mt-2">
                  Tip: Use <code className="text-sky-400">ORG-123</code> for
                  demo data.
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-sky-500/20 transition-all"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD GRID (Replaces List View) */
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && claims.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 animate-pulse">
                Loading claims...
              </div>
            )}

            {claims.map((claim) => (
              <div
                key={claim.id}
                className={`glass-panel p-5 rounded-xl border flex flex-col ${
                  claim.status === "VERIFIED"
                    ? "border-emerald-500/30 bg-emerald-900/5"
                    : "border-slate-700 bg-slate-900/40"
                }`}
              >
                {/* Header Status */}
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded ${
                      claim.status === "VERIFIED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : claim.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {claim.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Image Preview */}
                <div className="relative h-48 w-full mb-4 bg-black/60 rounded-lg overflow-hidden border border-white/5 group">
                  <img
                    src={`http://localhost:8000${claim.original_image_url}`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    alt="Certificate"
                  />
                  {claim.status === "VERIFIED" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <i className="ph-fill ph-seal-check text-4xl text-emerald-400 drop-shadow-lg"></i>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 mb-6 flex-grow">
                  <h3
                    className="font-bold text-white text-lg truncate"
                    title={claim.name}
                  >
                    {claim.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {claim.event}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                      {claim.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  {claim.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAction(claim.id, "approve")}
                        disabled={!!processingId}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === claim.id
                          ? "Processing..."
                          : "APPROVE"}
                      </button>
                      <button
                        onClick={() => handleAction(claim.id, "reject")}
                        disabled={!!processingId}
                        className="flex-1 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-lg text-xs font-bold border border-red-800 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {claim.status === "VERIFIED" && claim.verification_url && (
                    <a
                      href={claim.verification_url}
                      target="_blank"
                      className="flex-1 py-2 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/50 text-sky-300 text-center rounded-lg text-xs font-bold transition-colors"
                    >
                      View Verified Page
                    </a>
                  )}
                  {claim.status === "REJECTED" && (
                    <div className="w-full text-center text-[10px] text-red-400 italic py-2">
                      Rejected by admin
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!loading && claims.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                <p className="text-lg font-semibold mb-2">No Claims Found</p>
                <p className="text-xs">
                  No pending certificates for Organization ID:{" "}
                  <span className="text-sky-400 font-mono">{orgId}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
