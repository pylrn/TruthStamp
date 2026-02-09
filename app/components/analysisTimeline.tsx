"use client";

const steps = [
  "Extracting frames & audio",
  "Running Deep-Pixel AI",
  "Computing digital fingerprint",
  "Anchoring to public registry",
  "Generating QR stamp",
];

export default function AnalysisTimeline({ step }: { step: number }) {
  return (
    <div className="space-y-2 font-mono text-xs text-slate-400">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              i <= step ? "bg-emerald-400" : "bg-white/20"
            }`}
          />
          <span className={i <= step ? "text-emerald-400" : ""}>{label}</span>
        </div>
      ))}
    </div>
  );
}
