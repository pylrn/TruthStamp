"use client";

import { useState } from "react";
import AnalysisTimeline from "../components/analysisTimeline";
import { useRouter } from "next/navigation";

export default function VerifyMediaPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const startVerification = async () => {
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setStep(i);
    }
    router.push("/result");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <AnalysisTimeline step={step} />
      <button
        onClick={startVerification}
        className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg"
      >
        Start Verification
      </button>
    </div>
  );
}
