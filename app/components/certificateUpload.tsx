"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { submitCertificateClaim } from "@/lib/api";

export default function CertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a certificate image.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Calls the Web2 API endpoint
      const res = await submitCertificateClaim(
        file,
        name,
        orgId,
        event,
        date,
        category
      );

      if (res.success) {
        setSuccessMsg(
          "Certificate submitted successfully! Status: PENDING verification."
        );
        // Reset form
        setFile(null);
        setName("");
        // Keep OrgId as user might submit multiple for same org
        setEvent("");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Submission failed. Please check the Organization ID and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -ml-16 -mb-16 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">
          Upload Certificate
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Submit your credential image for organization verification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organization ID - Critical for Web2 Logic */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Organization ID
            </label>
            <input
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              placeholder="e.g. ORG-123"
              className="w-full bg-black/40 border border-emerald-500/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              required
            />
            <p className="text-[10px] text-slate-500">
              The ID provided by your issuer (e.g. ORG-123).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                Recipient Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                Event / Course Name
              </label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                Date Issued
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Hackathon, Workshop"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Certificate Image
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-6 transition-colors group bg-black/20">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-emerald-500/20 transition-colors">
                  <i className="ph-fill ph-image text-xl text-slate-400 group-hover:text-emerald-400"></i>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  {file ? file.name : "Click to upload image"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-300">
              <i className="ph-fill ph-warning-circle"></i>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
              <i className="ph-fill ph-check-circle"></i>
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <span>Submit Claim</span>
                <i className="ph-bold ph-arrow-right"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
