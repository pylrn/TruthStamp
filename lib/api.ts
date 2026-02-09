const API_BASE = "http://localhost:8000";

// --- Media Verification (Original) ---
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

  const res = await fetch(`${API_BASE}/verify/${type}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`System Alert: Verification failed - ${res.statusText}`);
  }

  return res.json();
}

// --- Certificate Claims (New Web2 Logic) ---

export interface Claim {
  id: string;
  name: string;
  org_id: string;
  org_name: string;
  event: string;
  date: string;
  category: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  original_image_url: string;
  watermarked_image_url?: string;
  created_at: string;
  verification_url?: string;
}

export async function submitCertificateClaim(
  file: File,
  name: string,
  orgId: string,
  event: string,
  date: string,
  category: string
) {
  const form = new FormData();
  form.append("file", file);
  form.append("name", name);
  form.append("org_id", orgId); // Changed key to match backend
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

export async function fetchOrgClaims(orgId: string) {
  const res = await fetch(`${API_BASE}/credentials/org/${orgId}/claims`);
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}

export async function adminActionOnClaim(
  claimId: string,
  action: "approve" | "reject"
) {
  const res = await fetch(`${API_BASE}/credentials/claim/${claimId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) throw new Error("Action failed");
  return res.json();
}
