"use client";

export default function Hero() {
  const scrollToDemo = () => {
    document
      .getElementById("demo-interface")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center text-center mb-32 relative pt-32">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1]">
        <span className="gradient-text-anim block">Verify Reality.</span>
        <span className="gradient-accent-anim block">Immutable Truth.</span>
      </h1>

      <p className="text-lg text-slate-400 max-w-2xl mb-12">
        AI and Cryptographic sealing for the age of synthetic media.
      </p>

      <div className="flex gap-6">
        <button
          onClick={scrollToDemo}
          className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition"
        >
          INITIALIZE SCAN
        </button>

        <button className="glass-button px-8 py-4 rounded-xl text-sm font-bold">
          VIEW LEDGER
        </button>
      </div>
    </section>
  );
}
