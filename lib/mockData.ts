import { VerificationResult } from "./types";

export const mockVerification: VerificationResult = {
  hash: "0x8f2a9c1e45ab",
  confidence: 99.2,
  status: "VERIFIED_REAL",
  timestamp: new Date().toUTCString(),
  network: "Polygon Public Registry",
  txHash: "0x1234abcd...mock",
  blockNumber: 12345678,
  issuerName: "TruthStamp Demo University",
  issuerLogoUrl: "",
  subjectName: "Jane Doe",
  organization: "Facebook Hackathon",
  event: "Facebook Global Hackathon 2026",
  category: "AI Safety",
  certificateDate: new Date().toISOString().slice(0, 10),
  shortCode: "TS-8F2A9C",
  revoked: false,
};
