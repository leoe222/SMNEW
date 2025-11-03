"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Overlay dots for every client route change
export default function PageTransitionDots() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (prev.current !== pathname) {
      prev.current = pathname;
  setVisible(true);
  const t = setTimeout(() => setVisible(false), 1200); // extended display (~1.2s)
      return () => clearTimeout(t);
    }
  }, [pathname]);

  if (!mounted || !visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-dots-fade">
      <div className="flex gap-3" role="status" aria-label="Cargando">
        {[0,1,2].map(i => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-[#e8114b] animate-dot-bounce"
            style={{ animationDelay: `${i*180}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
