"use client";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-32 py-16 bg-[#030407] relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(0deg,transparent_24%,#ffffff_25%,#ffffff_26%,transparent_27%,transparent_74%,#ffffff_75%,#ffffff_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,#ffffff_25%,#ffffff_26%,transparent_27%,transparent_74%,#ffffff_75%,#ffffff_76%,transparent_77%,transparent)] bg-[length:30px_30px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
  
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center border border-white/10">
                <img src="/icon.png" alt="Logo" width={50} height={50} />
          </div>

          <div>
            <span className="text-sm font-bold tracking-tight text-white block">
              TRUTHSTAMP
            </span>
            <span className="text-[10px] text-slate-500">
              Decentralized Verification Protocol
            </span>
          </div>
        </div>

 
       


        <div className="flex gap-6 text-slate-500">
          <a
            href="#"
            className="hover:text-white transition-colors text-xs font-medium"
          >
            what do we do ?
            
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors text-xs font-medium"
          >
            why us ?
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors text-xs font-medium"
          >
            faqs
            
          </a>
        </div>
      </div>
    </footer>
  );
}
