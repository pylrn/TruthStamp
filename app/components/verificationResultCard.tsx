import { VerificationResult } from "@/lib/types";

export default function VerificationResultCard({
  result,
}: {
  result: VerificationResult;
}) {
  return (
    <div className="glass-panel p-8 rounded-2xl max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-emerald-400 mb-2">
        {result.status === "VERIFIED_REAL" ? "Verified Real" : "Flagged Fake"}
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Confidence: {result.confidence}%
      </p>

      <div className="text-xs font-mono text-slate-500 space-y-1">
        <div>Fingerprint: {result.hash}</div>
        <div>Issued: {result.timestamp}</div>
        <div>Network: {result.network}</div>
      </div>

      <button className="mt-6 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg">
        Download Verified Copy
      </button>
    </div>
  );
}
