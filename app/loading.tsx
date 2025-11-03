// Root loading (server components fetch) fallback: centered bouncing dots
export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 animate-dots-fade">
      <div className="flex gap-3" role="status" aria-label="Cargando">
        {[0,1,2].map(i => (
          <span
            key={i}
            className="h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-[#e8114b] animate-dot-bounce"
            style={{ animationDelay: `${i*180}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
