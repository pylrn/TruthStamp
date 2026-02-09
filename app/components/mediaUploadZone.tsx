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
      const result = await verifyMedia(file, type as "image" | "video");

      const mappedResult: VerificationResult = {
        hash: result.hash,
        confidence: result.confidence,
        status: result.status,
        timestamp: result.timestamp || new Date().toUTCString(),
        network: result.network || "Polygon Public Registry",
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        watermarked_file: result.watermarked_file,
        verification_page: result.verification_page,
      };

      setVerificationResult(mappedResult);
      onVerified(mappedResult); // Pass up to parent for timeline/explorer display if needed
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Verification failed. Please try again.");
      setVerificationResult(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Video stamping (Client-side fallback) ---------- */
  const handleStampVideo = async () => {
    if (!mediaFile || mediaType !== "video" || !verificationResult) return;

    // Use backend generated file if available, otherwise fallback to client-side burning
    if (verificationResult.watermarked_file) {
      window.open(verificationResult.watermarked_file, "_blank");
    } else {
      const stampedFrame = await burnVideoFrame(
        mediaFile,
        verificationResult.hash
      );
      const url = URL.createObjectURL(stampedFrame);
      window.open(url);
    }
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

          {/* Audio Zone */}
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
          <div className="mt-12 text-center flex flex-col items-center">
            <p className="text-emerald-400 text-sm mb-2 font-mono">
              ✔ VERIFIED · {verificationResult.confidence}%
            </p>

            <p className="text-xs text-slate-500 mb-4 font-mono">
              Hash: {verificationResult.hash}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {/* PRIMARY ACTION: VIEW PUBLIC PAGE */}
              {verificationResult.verification_page && (
                <a
                  href={verificationResult.verification_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
                >
                  <span>🔗</span>
                  View Public Proof Page
                </a>
              )}

              {/* SECONDARY ACTION: DOWNLOAD/PREVIEW WATERMARK */}
              {mediaType === "video" && (
                <button
                  onClick={handleStampVideo}
                  className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
                >
                  View Watermarked Video
                </button>
              )}

              {mediaType === "image" && verificationResult.watermarked_file && (
                <a
                  href={verificationResult.watermarked_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition border border-slate-500"
                >
                  Download Watermarked Image
                </a>
              )}
            </div>

            <p className="mt-8 text-xs text-slate-500 max-w-lg">
              Verification is backed by a cryptographic fingerprint and public
              registry. The "Public Proof Page" link contains the official
              hosted verification report with the QR code.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
