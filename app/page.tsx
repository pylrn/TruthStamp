"use client";

import { useState } from "react";

import MatrixBackground from "./components/matrixBackground";
import PerspectiveGrid from "./components/perspectiveGrid";
import AmbientGlows from "./components/ambientGlows";
import Navbar from "./components/navbar";
import MediaUploadZone from "./components/mediaUploadZone";
import FeatureGrid from "./components/featuresGrid";
import Footer from "./components/footer";
import Hero from "./components/hero";
import ExplorerPanel from "./components/explorerPanel";

import { VerificationResult } from "@/lib/types";

export default function Page() {
  const [result, setResult] = useState<VerificationResult | null>(null);

  return (
    <>
    
      <MatrixBackground />
      <PerspectiveGrid />
      <AmbientGlows />


      <Navbar />


      <main className="relative z-10 px-6">
        <Hero />

        <div id="demo-interface">
          <MediaUploadZone onVerified={setResult} />
        </div>

        {result && (
          <section className="max-w-5xl mx-auto mt-12 glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              TruthStamp Verification Pipeline
            </h2>

            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>AI Sentinel Analysis</span>
                <span className="text-emerald-400">
                  ✔ {result.confidence}% Authentic
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Digital Fingerprint (SHA-256)</span>
                <span className="text-cyan-400">
                  {result.hash.slice(0, 16)}...
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Registry Entry Created</span>
                <span className="text-emerald-400">
                  Block #{result.blockNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Transaction ID</span>
                <span className="text-cyan-400">
                  {result.txHash.slice(0, 16)}...
                </span>
              </div>

              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-violet-400">{result.network}</span>
              </div>
            </div>

            <ExplorerPanel result={result} />
          </section>
        )}

        <FeatureGrid />
      </main>

  
      <Footer />
    </>
  );
}
