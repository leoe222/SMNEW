"use client";
import React from 'react'

interface Props { className?: string; size?: number }

/* SVG stroke-draw logo loader. */
const LogoTraceLoader: React.FC<Props> = ({ className='', size=64 }) => {
  const box = 100;
  return (
    <div className={`flex items-center justify-center ${className}`} aria-label="Cargando" role="status">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${box} ${box}`}
        fill="none"
        className="text-primary animate-[logo-spin_3.6s_linear_infinite]"
      >
        <circle
          cx={50}
          cy={50}
            r={40}
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray={Math.PI * 2 * 40}
          className="origin-center animate-[logo-draw_2s_ease-in-out_infinite]"
        />
        <path
          d="M32 52 L46 66 L70 36"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={60}
          className="animate-[logo-draw-short_1.8s_ease-in-out_infinite]"
        />
      </svg>
    </div>
  )
}
export default LogoTraceLoader
