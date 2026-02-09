export type VerificationStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "anchoring"
  | "stamping"
  | "verified"
  | "flagged";

export interface VerificationResult {
  hash: string;
  confidence: number;
  status: string;
  timestamp: string;
  network: string;
  txHash: string;
  blockNumber: number;
  // Extended certificate / credential metadata
  issuerName?: string;
  issuerLogoUrl?: string;
  subjectName?: string;
  organization?: string;
  event?: string;
  category?: string;
  certificateDate?: string;
  shortCode?: string;
  revoked?: boolean;
}
