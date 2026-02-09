import QRCode from "qrcode";

export async function burnVideoFrame(
  videoFile: File,
  hash: string
): Promise<Blob> {
  return new Promise(async (resolve) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.crossOrigin = "anonymous";
    video.muted = true;

    video.onloadeddata = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      // Generate QR
      const qrImg = new Image();
      qrImg.src = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${hash}`
      );

      qrImg.onload = () => {
        const size = canvas.width * 0.15;

        // 🔥 Burn QR
        ctx.drawImage(qrImg, canvas.width - size - 20, 20, size, size);

        // 🔥 Burn hash text
        ctx.fillStyle = "#10b981";
        ctx.font = "20px monospace";
        ctx.fillText(`Verified: ${hash}`, 20, canvas.height - 30);

        canvas.toBlob((blob) => resolve(blob!), "image/png");
      };
    };
  });
}
