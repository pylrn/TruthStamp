"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QrStampPreview({ hash }: { hash: string }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${hash}`;

  return (
    <div className="absolute top-3 right-3 bg-white p-1 rounded shadow-lg">
      <QRCodeSVG value={url} size={64} />
    </div>
  );
}
