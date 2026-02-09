"use client";

export default function AmbientGlows() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      
      <div
        className="absolute top-[-20%] left-[20%] w-240 h-240 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse"
        style={{ animationDuration: "7s" }}
      />
    </div>
  );
}
