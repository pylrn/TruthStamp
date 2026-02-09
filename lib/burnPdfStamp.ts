import jsPDF from "jspdf";
import QRCode from "qrcode";
import { VerificationResult } from "./types";

export async function burnPdfStamp(result: VerificationResult) {
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(18);
  pdf.text("TruthStamp – Verified Certificate", 20, 20);

  // Body
  pdf.setFontSize(12);
  pdf.text(`Fingerprint: ${result.hash}`, 20, 40);
  pdf.text(`Status: ${result.status}`, 20, 50);
  pdf.text(`Confidence: ${result.confidence}%`, 20, 60);
  pdf.text(`Issued: ${result.timestamp}`, 20, 70);
  pdf.text(`Network: ${result.network}`, 20, 80);

  // Generate QR
  const qrDataUrl = await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${result.hash}`
  );

  // 🔥 Burn QR into PDF
  pdf.addImage(qrDataUrl, "PNG", 150, 20, 40, 40);

  // Watermark
  pdf.setTextColor(150);
  pdf.setFontSize(10);
  pdf.text("✔ Verified by TruthStamp", 150, 65);

  pdf.save(`truthstamp-${result.hash}.pdf`);
}
