"use client";

import { useMatrixRain } from "../hooks/useMatrixRain";

export default function MatrixBackground() {
  useMatrixRain("matrix-bg");

  return <canvas id="matrix-bg" className="fixed inset-0 -z-20 opacity-15" />;
}
