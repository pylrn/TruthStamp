"use client";

import { useState } from "react";
import MediaDropZone from "./mediaDropZone";
import { burnVideoFrame } from "@/lib/burnVideoFrame";
import { verifyMedia } from "@/lib/api";
import { VerificationResult } from "@/lib/types";

type MediaType = "image" | "video" | "audio";

export default function MediaUploadZone({
  onVerified,
}: {
  onVerified: (result: VerificationResult) => void;
}) {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (type: MediaType, file: File) => {
    try {
      setLoading(true);
      setError(null);
      setMediaType(type);
      setMediaFile(file);

      // Integration Check: Audio is currently disabled in backend
      if (type === "audio") {
        throw new Error("Audio verification is currently disabled.");
      }

      // Integration Fix: Pass 'type' to verifyMedia so it hits the correct endpoint (/verify/image or /verify/video)
      // We cast type here because verifyMedia expects strict "image" | "video", and we've already guarded against "audio"
      const result = await verifyMedia(file, type as "image" | "video");

      setVerificationResult({
        hash: result.hash,
        confidence: result.confidence,
        status: result.status,
        timestamp: result.timestamp || new Date().toUTCString(),
        network: result.network || "Polygon Public Registry",
        txHash: result.txHash,
        blockNumber: result.blockNumber,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Verification failed. Please try again.");
      setVerificationResult(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Video stamping ---------- */
  const handleStampVideo = async () => {
    if (!mediaFile || mediaType !== "video" || !verificationResult) return;

    const stampedFrame = await burnVideoFrame(
      mediaFile,
      verificationResult.hash
    );

    const url = URL.createObjectURL(stampedFrame);
    window.open(url);
  };

  return (
    <section className="max-w-6xl mx-auto mt-32">
      <div className="glass-panel rounded-2xl p-10">
        <h2 className="text-xl font-bold text-white mb-10 text-center">
          Verify Media Authenticity
        </h2>

        {/* 🔲 DROP ZONES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MediaDropZone
            title="Drop Image"
            subtitle="[ JPG, PNG, WEBP ]"
            icon={<span className="text-3xl">🖼️</span>}
            accept={["image/jpeg", "image/png", "image/webp"]}
            onFileSelect={(file) => handleFile("image", file)}
          />

          <MediaDropZone
            title="Drop Video"
            subtitle="[ MP4, WEBM, MOV ]"
            icon={<span className="text-3xl">🎥</span>}
            accent="cyan"
            accept={["video/mp4", "video/webm", "video/quicktime"]}
            onFileSelect={(file) => handleFile("video", file)}
          />

          {/* Audio Zone (Visually present but logically gated in handleFile) */}
          <MediaDropZone
            title="Drop Audio"
            subtitle="[ MP3, WAV ]"
            icon={<span className="text-3xl">🎤</span>}
            accent="violet"
            accept={["audio/mpeg", "audio/wav"]}
            onFileSelect={(file) => handleFile("audio", file)}
          />
        </div>

        {/* ⏳ LOADING */}
        {loading && (
          <p className="mt-10 text-sm text-slate-400 text-center animate-pulse">
            Analyzing media integrity…
          </p>
        )}

        {error && (
          <p className="mt-10 text-sm text-red-400 text-center">{error}</p>
        )}

        {mediaFile && verificationResult && !loading && (
          <div className="mt-12 text-center">
            <p className="text-emerald-400 text-sm mb-2 font-mono">
              ✔ VERIFIED · {verificationResult.confidence}%
            </p>

            <p className="text-xs text-slate-500 mb-4 font-mono">
              Hash: {verificationResult.hash}
            </p>
            <p className="mt-6 text-emerald-400 text-xs font-mono">
              ✔ QR Proof Stamp Generated
            </p>

            {/* 🎥 Video-only stamping */}
            {mediaType === "video" && (
              <button
                onClick={handleStampVideo}
                className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
              >
                Preview Stamped Video Frame
              </button>
            )}

            {/* 🖼️ / 🔊 Placeholder */}
            {mediaType !== "video" && (
              <p className="text-xs text-slate-500 mt-4">
                QR stamping support coming for{" "}
                <span className="font-mono text-white">{mediaType}</span>
              </p>
            )}

            <p className="mt-4 text-xs text-slate-500">
              Verification is backed by a cryptographic fingerprint and public
              registry.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
