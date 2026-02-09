export default function VerificationSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-pulse">
        <div className="h-6 w-1/2 bg-white/10 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-3 bg-white/10 rounded w-4/6" />
        </div>
        <div className="mt-6 h-8 bg-white/10 rounded" />
      </div>
    </div>
  );
}
