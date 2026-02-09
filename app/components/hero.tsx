"use client";

export default function Hero() {
  const scrollToDemo = () => {
    document
      .getElementById("demo-interface")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center text-center mb-32 relative pt-32 select-none">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1]">
        <span className="gradient-text-anim block">Verify Reality.</span>
        <span className="gradient-accent-anim block">Immutable Truth.</span>
      </h1>

      <p className="text-lg text-slate-400 max-w-2xl mb-8">
        AI and Cryptographic sealing for the age of synthetic media, news, and
        human achievements.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          onClick={scrollToDemo}
          className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
        >
          Verify Breaking News Video
        </button>
        <a
          href="/credentials"
          className="px-6 py-3 rounded-lg border border-sky-500/60 text-sky-200 font-semibold text-sm hover:bg-sky-500/10 transition-colors"
        >
          Stamp a Certificate
        </a>
      </div>

      <p className="text-xs text-slate-500">
        TruthStamp is the SSL certificate for reality – for media and for
        verifiable credentials.
      </p>
    </section>
  );
}
