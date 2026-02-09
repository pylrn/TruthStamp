const API_BASE = "http://localhost:8000";

// Updated Type Definition to match Backend Response
export interface VerificationResponse {
  hash: string;
  confidence: number;
  status: "VERIFIED_REAL" | "FLAGGED_FAKE";
  timestamp: string;
  network: string;
  txHash: string;
  blockNumber: number;
  watermarked_file?: string;
  verification_page?: string;
}

export async function verifyMedia(
  file: File,
  type: "image" | "video"
): Promise<VerificationResponse> {
  const form = new FormData();
  form.append("file", file);

  // Dynamic routing based on media type
  // Matches backend routes: @app.post("/verify/image") and @app.post("/verify/video")
  const res = await fetch(`${API_BASE}/verify/${type}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Verification failed:", errorText);
    throw new Error(`System Alert: Verification failed - ${res.statusText}`);
  }

  return res.json();
}

export async function fetchVerification(hash: string) {
  // Note: Ensure your backend implements GET /verify/{hash} if you use this.
  // The current backend main.py primarily uses /verdict/{id} for HTML reports.
  const res = await fetch(`${API_BASE}/verify/${hash}`);
  if (!res.ok) throw new Error("Not verified");
  return res.json();
}

// Certificate / credential APIs

export async function submitCertificateClaim(
  file: File,
  name: string,
  org: string,
  event: string,
  date: string,
  category: string
) {
  const form = new FormData();
  form.append("file", file);
  form.append("name", name);
  form.append("org", org);
  form.append("event", event);
  form.append("date", date);
  form.append("category", category);

  const res = await fetch(`${API_BASE}/credentials/claim`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Claim submission failed");
  return res.json();
}

export async function fetchClaims(status?: string) {
  const url = status
    ? `${API_BASE}/admin/claims?status=${encodeURIComponent(status)}`
    : `${API_BASE}/admin/claims`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load claims");
  return res.json();
}

export async function adminActOnClaim(
  claimId: string,
  action: "approve" | "reject" | "revoke" | "request_reupload",
  options?: { reason?: string; signature?: string; from?: string }
) {
  const res = await fetch(`${API_BASE}/admin/claims/${claimId}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options ?? {}),
  });
  if (!res.ok) throw new Error("Action failed");
  return res.json();
}

export async function recheckCertificateFile(
  hash: string,
  file: File
): Promise<{ matches: boolean }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/verify/certificate/${hash}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Re-check failed");
  return res.json();
}
