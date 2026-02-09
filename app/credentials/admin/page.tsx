"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MatrixBackground from "../../components/matrixBackground";
import PerspectiveGrid from "../../components/perspectiveGrid";
import AmbientGlows from "../../components/ambientGlows";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { useIssuerAuth } from "../../hooks/useIssuerAuth";
import { adminActOnClaim, fetchClaims } from "@/lib/api";

type ClaimStatus = "PENDING" | "VERIFIED" | "REJECTED" | "REVOKED";

interface Claim {
  id: string;
  hash: string;
  status: ClaimStatus;
  name: string;
  org: string;
  event: string;
  date: string;
  category: string;
  createdAt: string;
}

export default function CredentialsAdminPage() {
  const {
    address,
    role,
    isConnected,
    loading,
    connect,
    canApprove,
    canReview,
  } = useIssuerAuth();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeStatus, setActiveStatus] = useState<ClaimStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [busyClaim, setBusyClaim] = useState<string | null>(null);

  useEffect(() => {
    loadClaims("PENDING");
  }, []);

  const loadClaims = async (status: ClaimStatus) => {
    try {
      const data = await fetchClaims(status);
      setClaims(data.claims ?? []);
    } catch (e) {
      console.error(e);
      alert("Failed to load claims.");
    }
  };

  const handleTabChange = (status: ClaimStatus) => {
    setActiveStatus(status);
    loadClaims(status);
  };

  const signAndAct = async (
    claim: Claim,
    action: "approve" | "reject" | "revoke" | "request_reupload"
  ) => {
    if (!address) {
      alert("Connect your issuer wallet first.");
      return;
    }
    if (action === "approve" && !canApprove) {
      alert("Only approvers can finalize approvals.");
      return;
    }
    if (
      (action === "reject" || action === "request_reupload") &&
      !canReview
    ) {
      alert("You do not have review permissions.");
      return;
    }

    const reason =
      action === "reject" || action === "request_reupload"
        ? window.prompt("Add an optional reason for this action:") ?? undefined
        : undefined;

    setBusyClaim(claim.id);
    try {
      let signature: string | undefined;
      if (window.ethereum) {
        const message = `TruthStamp admin action\nAction: ${action}\nClaim: ${
          claim.id
        }\nHash: ${claim.hash}\nFrom: ${address}\nTime: ${new Date().toISOString()}`;
        const hexMessage = `0x${Buffer.from(message, "utf8").toString("hex")}`;
        try {
          signature = await window.ethereum.request({
            method: "personal_sign",
            params: [hexMessage, address],
          });
        } catch (e) {
          console.warn("Signature cancelled or unavailable", e);
        }
      }

      await adminActOnClaim(claim.id, action, {
        reason,
        signature,
        from: address,
      });
      await loadClaims(activeStatus);
    } catch (e) {
      console.error(e);
      alert("Action failed.");
    } finally {
      setBusyClaim(null);
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
            href="/credentials"
            className="inline-flex items-center gap-2 text-xs text-slate-300 glass-button px-3 py-1.5 rounded-lg"
          >
            <span className="text-lg">←</span>
            <span>Back to Achievement Locker</span>
          </Link>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Mode B · Achievement Locker — Issuer view
          </span>
        </div>

        <div className="max-w-5xl mx-auto glass-panel p-8 rounded-2xl border border-sky-500/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-sky-400 mb-1">
                Issuer Admin Console
              </h1>
              <p className="text-xs text-slate-400">
                Review and approve Achievement Locker claims. Approvals are
                signed with your MetaMask wallet and anchored on-chain.
              </p>
            </div>
            <button
              onClick={connect}
              disabled={loading || isConnected}
              className="self-start px-3 py-1.5 rounded-lg border border-sky-500/60 text-sky-100 text-xs font-semibold hover:bg-sky-500/10 transition-colors disabled:opacity-60"
            >
              {isConnected
                ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                : loading
                ? "Connecting..."
                : "Connect MetaMask"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 mb-4 text-xs text-slate-300 font-mono bg-black/30 rounded-lg p-3 border border-slate-800">
            <div>
              Role:{" "}
              <span className="uppercase tracking-wide text-sky-400">
                {role}
              </span>
            </div>
            <div>
              Permissions:{" "}
              {canApprove
                ? "Review + approve + revoke"
                : canReview
                ? "Review only"
                : "View only"}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {(["PENDING", "VERIFIED", "REJECTED", "REVOKED"] as ClaimStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleTabChange(status)}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    activeStatus === status
                      ? "border-sky-500 bg-sky-500/10 text-sky-100"
                      : "border-slate-700 text-slate-300 hover:border-sky-500/60"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mb-3">
            <input
              placeholder="Search by name, org, event, hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-slate-700 bg-black/40 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>

          <div className="mt-2 max-h-[420px] overflow-y-auto rounded-lg border border-slate-800 divide-y divide-slate-800">
            {claims
              .filter((c) => {
                const q = search.toLowerCase();
                if (!q) return true;
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.org.toLowerCase().includes(q) ||
                  c.event.toLowerCase().includes(q) ||
                  c.hash.toLowerCase().includes(q)
                );
              })
              .map((claim) => (
                <div
                  key={claim.id}
                  className="p-3 text-xs text-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {claim.name} ·{" "}
                      <span className="text-slate-400">{claim.org}</span>
                    </div>
                    <div className="text-slate-400">
                      {claim.event} · {claim.category} · {claim.date}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {claim.hash}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() => signAndAct(claim, "request_reupload")}
                          disabled={busyClaim === claim.id}
                          className="px-2 py-1 rounded-md border border-amber-500/60 text-amber-300 text-[11px] hover:bg-amber-500/10 disabled:opacity-60"
                        >
                          Request Re-upload
                        </button>
                        <button
                          onClick={() => signAndAct(claim, "reject")}
                          disabled={busyClaim === claim.id}
                          className="px-2 py-1 rounded-md border border-red-500/60 text-red-300 text-[11px] hover:bg-red-500/10 disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => signAndAct(claim, "approve")}
                          disabled={busyClaim === claim.id || !canApprove}
                          className="px-2 py-1 rounded-md border border-emerald-500/60 text-emerald-300 text-[11px] hover:bg-emerald-500/10 disabled:opacity-60"
                        >
                          {busyClaim === claim.id
                            ? "Signing..."
                            : "Approve & Stamp"}
                        </button>
                      </>
                    )}
                    {activeStatus === "VERIFIED" && (
                      <button
                        onClick={() => signAndAct(claim, "revoke")}
                        disabled={busyClaim === claim.id || !canApprove}
                        className="px-2 py-1 rounded-md border border-red-500/60 text-red-300 text-[11px] hover:bg-red-500/10 disabled:opacity-60"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            {claims.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">
                No claims in this state yet. Ask your students or participants
                to submit certificates via the Achievement Locker.
              </div>
            )}
          </div>

          <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
            Every approval is signed with your wallet and can be verified
            off-chain. Approved claims are anchored on the Polygon testnet and
            result in a QR-stamped proof PDF that exposes tampering attempts.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

