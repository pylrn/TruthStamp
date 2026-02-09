"use client";

import { VerificationResult } from "@/lib/types";
import { burnPdfStamp } from "@/lib/burnPdfStamp";

export default function PublicVerificationStatus({
  result,
}: {
  result: VerificationResult;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-emerald-400">
        ✔ Verified Authentic
      </h1>

      <p className="mt-4 text-slate-400 max-w-md">
        This credential has been verified by TruthStamp and recorded in the
        public registry.
      </p>

      <div className="mt-5 grid gap-4 text-left text-xs text-slate-300 max-w-xl w-full">
        <div className="glass-panel rounded-xl border border-slate-700/80 p-4">
          <h2 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
            Issuer & Subject
          </h2>
          <div className="font-mono space-y-1">
            <div>
              Issuer:{" "}
              <span className="text-emerald-400">
                {result.issuerName ?? "Unknown Issuer"}
              </span>
            </div>
            <div>
              Subject:{" "}
              <span className="text-slate-100">
                {result.subjectName ?? "—"}
              </span>
            </div>
            <div>Organization: {result.organization ?? "—"}</div>
            <div>Event: {result.event ?? "—"}</div>
            <div>Category: {result.category ?? "—"}</div>
            <div>Date: {result.certificateDate ?? "—"}</div>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-slate-700/80 p-4">
          <h2 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
            Registry Proof
          </h2>
          <div className="font-mono space-y-1">
            <div>Fingerprint: {result.hash}</div>
            <div>Status: {result.revoked ? "REVOKED" : result.status}</div>
            <div>Confidence: {result.confidence}%</div>
            <div>Issued: {result.timestamp}</div>
            <div>Network: {result.network}</div>
            <div>Block: #{result.blockNumber}</div>
            <div>Tx: {result.txHash}</div>
            {result.shortCode && <div>Short Code: {result.shortCode}</div>}
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(result.hash)}
            className="mt-3 px-3 py-1.5 rounded-lg border border-slate-600 text-[11px] text-slate-200 hover:border-emerald-500/70 hover:text-emerald-300 transition-colors"
          >
            Copy Fingerprint
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {/* 🔥 PDF STAMP BUTTON */}
        <button
          onClick={() => burnPdfStamp(result)}
          className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition text-sm"
        >
          Download Stamped PDF
        </button>

        <button
          onClick={() => {
            const payload = {
              type: "TruthStampCredential",
              hash: result.hash,
              status: result.status,
              timestamp: result.timestamp,
              network: result.network,
              txHash: result.txHash,
              blockNumber: result.blockNumber,
              issuerName: result.issuerName,
              subjectName: result.subjectName,
              organization: result.organization,
              event: result.event,
              category: result.category,
              certificateDate: result.certificateDate,
              shortCode: result.shortCode,
              revoked: result.revoked ?? false,
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `truthstamp-${result.hash}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 bg-slate-900 text-slate-100 font-bold rounded-lg border border-slate-600 hover:border-sky-500/80 hover:text-sky-200 transition text-sm"
        >
          Download JSON Credential
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500 max-w-md">
        The stamped PDF includes a QR code bound to this fingerprint. Any
        attempt to edit the file after stamping will cause verification to
        fail.
      </p>
    </div>
  );
}
