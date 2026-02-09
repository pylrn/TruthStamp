const API_BASE = "http://localhost:8000";

export async function verifyMedia(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/verify/media`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Verification failed");
  }

  return res.json();
}
export async function fetchVerification(hash: string) {
  const res = await fetch(`${API_BASE}/verify/${hash}`);
  if (!res.ok) throw new Error("Not verified");
  return res.json();
}

// Certificate / credential APIs

interface CertificateClaimPayload {
  file: File;
  name: string;
  org: string;
  event: string;
  date: string;
  category: string;
}

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

  const res = await fetch("http://localhost:8000/credentials/claim", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Submit error:", errText);
    throw new Error("Failed to submit claim");
  }

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

