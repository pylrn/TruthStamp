import jsPDF from "jspdf";
import { VerificationResult } from "./types";

export function downloadReport(result: VerificationResult) {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("TruthStamp Verification Report", 20, 20);

  pdf.setFontSize(12);
  pdf.text(`Fingerprint: ${result.hash}`, 20, 40);
  pdf.text(`Status: ${result.status}`, 20, 50);
  pdf.text(`Confidence: ${result.confidence}%`, 20, 60);
  pdf.text(`Issued: ${result.timestamp}`, 20, 70);
  pdf.text(`Network: ${result.network}`, 20, 80);

  pdf.text(
    "This document certifies that the above media was verified\nusing TruthStamp’s AI Sentinel and recorded\non a public immutable registry.",
    20,
    100
  );

  pdf.save(`truthstamp-${result.hash}.pdf`);
}
