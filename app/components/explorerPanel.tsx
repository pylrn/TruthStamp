interface ExplorerProps {
  result: {
    hash: string;
    txHash: string;
    blockNumber: number;
    network: string;
    status: string;
  };
}

export default function ExplorerPanel({ result }: ExplorerProps) {
  return (
    <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
      <div className="flex justify-between">
        <span className="text-slate-400">Transaction</span>
        <span className="text-emerald-400">Confirmed</span>
      </div>

      <div className="mt-6 space-y-2 text-left">
        <div>Transaction Hash: {result.txHash}</div>
        <div>Block Number: #{result.blockNumber}</div>
        <div>Network: {result.network}</div>
        <div>Status: {result.status}</div>
      </div>

      <a
        href={`https://amoy.polygonscan.com/tx/${result.txHash}`}
        target="_blank"
        className="text-cyan-400 underline text-xs"
      >
        View on Explorer
      </a>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-emerald-400 text-xs">Transaction Confirmed</span>
      </div>
    </div>
  );
}
