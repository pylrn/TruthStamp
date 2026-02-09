"use client";

import { useState, useEffect } from "react";

type View = "upload" | "processing" | "result";

export default function VerificationDemo() {
  const [view, setView] = useState<View>("upload");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (view !== "processing") return;

    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => setView("result"), 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [view]);

  return (
    <section id="demo-interface" className="max-w-4xl mx-auto mt-24">
      <div className="glass-panel rounded-2xl min-h-[600px] p-12 flex items-center justify-center">
        {view === "upload" && (
          <div
            onClick={() => setView("processing")}
            className="cursor-pointer text-center"
          >
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-bold">Drop Image Source Media </h3>
          </div>
        )}

        {view === "processing" && (
          <div className="text-center">
            <p className="font-mono text-emerald-400">SCANNING… {progress}%</p>
          </div>
        )}

        {view === "result" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-400">
              Authenticity Verified
            </h2>
            <p className="font-mono text-xs mt-2">Hash anchored on-chain</p>
          </div>
        )}
      </div>
      <div className="glass-panel rounded-2xl min-h-[600px] p-12 flex items-center justify-center">
        {view === "upload" && (
          <div
            onClick={() => setView("processing")}
            className="cursor-pointer text-center"
          >
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-bold">Drop Audio Source Media </h3>
          </div>
        )}

        {view === "processing" && (
          <div className="text-center">
            <p className="font-mono text-emerald-400">SCANNING… {progress}%</p>
          </div>
        )}

        {view === "result" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-400">
              Authenticity Verified
            </h2>
            <p className="font-mono text-xs mt-2">Hash anchored on-chain</p>
          </div>
        )}
      </div>
      <div className="glass-panel rounded-2xl min-h-[600px] p-12 flex items-center justify-center">
        {view === "upload" && (
          <div
            onClick={() => setView("processing")}
            className="cursor-pointer text-center"
          >
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-bold">Drop Video Source Media </h3>
          </div>
        )}

        {view === "processing" && (
          <div className="text-center">
            <p className="font-mono text-emerald-400">SCANNING… {progress}%</p>
          </div>
        )}

        {view === "result" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-400">
              Authenticity Verified
            </h2>
            <p className="font-mono text-xs mt-2">Hash anchored on-chain</p>
          </div>
        )}
      </div>
    </section>
  );
}
