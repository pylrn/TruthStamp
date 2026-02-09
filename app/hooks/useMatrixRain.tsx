import { useEffect } from "react";

export function useMatrixRain(canvasId: string) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    const matrix = () => {
      ctx.fillStyle = "#03040710";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#05fc7d";
      ctx.font = "10pt monospace";

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        ypos[ind] = y > 100 + Math.random() * 10000 ? 0 : y + 20;
      });
    };

    const interval = setInterval(matrix, 50);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasId]);
}
