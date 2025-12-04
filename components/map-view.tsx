"use client"

import { useState, useEffect } from "react"

export default function MapView() {
  const [leakBlink, setLeakBlink] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setLeakBlink((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 bg-background p-4 overflow-hidden">
      <div className="h-full glass-effect rounded-xl overflow-hidden relative">
        <svg viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Street grid pattern */}
            <pattern id="street-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="#0a0f1a" />
              <rect x="0" y="45" width="100" height="10" fill="#141c2e" rx="1" />
              <rect x="45" y="0" width="10" height="100" fill="#141c2e" rx="1" />
            </pattern>

            {/* Building blocks */}
            <pattern id="buildings" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="35" height="35" fill="#0d1321" stroke="#1a2235" strokeWidth="0.5" rx="2" />
              <rect x="60" y="5" width="35" height="35" fill="#0d1321" stroke="#1a2235" strokeWidth="0.5" rx="2" />
              <rect x="5" y="60" width="35" height="35" fill="#0d1321" stroke="#1a2235" strokeWidth="0.5" rx="2" />
              <rect x="60" y="60" width="35" height="35" fill="#0d1321" stroke="#1a2235" strokeWidth="0.5" rx="2" />
            </pattern>

            {/* Glow effects */}
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Leak pulse animation gradient */}
            <radialGradient id="leak-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={leakBlink ? 0.9 : 0.5} />
              <stop offset="50%" stopColor="#ef4444" stopOpacity={leakBlink ? 0.4 : 0.2} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            {/* Pipe gradient */}
            <linearGradient id="pipe-green" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Base layer - dark background */}
          <rect width="1200" height="800" fill="#060a12" />

          {/* Street grid */}
          <rect width="1200" height="800" fill="url(#street-grid)" opacity="0.8" />

          {/* Building blocks overlay */}
          <rect width="1200" height="800" fill="url(#buildings)" opacity="0.5" />

          {/* Major roads */}
          <g fill="none" stroke="#1e293b" strokeWidth="24" strokeLinecap="round">
            <path d="M 0 200 H 1200" />
            <path d="M 0 400 H 1200" />
            <path d="M 0 600 H 1200" />
            <path d="M 200 0 V 800" />
            <path d="M 600 0 V 800" />
            <path d="M 1000 0 V 800" />
          </g>

          {/* Road markings */}
          <g fill="none" stroke="#2d3a4f" strokeWidth="1" strokeDasharray="20 15">
            <path d="M 0 200 H 1200" />
            <path d="M 0 400 H 1200" />
            <path d="M 0 600 H 1200" />
            <path d="M 200 0 V 800" />
            <path d="M 600 0 V 800" />
            <path d="M 1000 0 V 800" />
          </g>

          {/* DMA Zone boundaries */}
          <g fill="none" strokeDasharray="8 4" strokeWidth="1.5" opacity="0.6">
            <rect x="40" y="40" width="280" height="280" stroke="#3b82f6" rx="8" />
            <rect x="360" y="40" width="280" height="280" stroke="#3b82f6" rx="8" />
            <rect x="680" y="40" width="280" height="280" stroke="#3b82f6" rx="8" />
            <rect x="40" y="360" width="280" height="280" stroke="#3b82f6" rx="8" />
            <rect x="360" y="360" width="280" height="280" stroke="#ef4444" rx="8" />
            <rect x="680" y="360" width="280" height="280" stroke="#3b82f6" rx="8" />
          </g>

          {/* DMA Labels */}
          <g fontSize="11" fontFamily="monospace" fontWeight="600" opacity="0.7">
            <text x="60" y="65" fill="#3b82f6">
              DMA-01
            </text>
            <text x="380" y="65" fill="#3b82f6">
              DMA-02
            </text>
            <text x="700" y="65" fill="#3b82f6">
              DMA-03
            </text>
            <text x="60" y="385" fill="#3b82f6">
              DMA-04
            </text>
            <text x="380" y="385" fill="#ef4444">
              DMA-05
            </text>
            <text x="700" y="385" fill="#3b82f6">
              DMA-06
            </text>
          </g>

          {/* Main pipeline network - trunk lines */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-green)">
            {/* Horizontal main lines */}
            <path d="M 80 200 H 1120" stroke="#22c55e" strokeWidth="8" opacity="0.9" />
            <path d="M 80 400 H 1120" stroke="#22c55e" strokeWidth="8" opacity="0.9" />
            <path d="M 80 600 H 1120" stroke="#22c55e" strokeWidth="8" opacity="0.9" />

            {/* Vertical trunk lines */}
            <path d="M 200 80 V 720" stroke="#22c55e" strokeWidth="8" opacity="0.9" />
            <path d="M 600 80 V 720" stroke="#22c55e" strokeWidth="8" opacity="0.9" />
            <path d="M 1000 80 V 720" stroke="#22c55e" strokeWidth="8" opacity="0.9" />
          </g>

          {/* Secondary distribution lines */}
          <g fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.7">
            {/* Horizontal secondaries */}
            <path d="M 200 120 H 600" />
            <path d="M 600 120 H 1000" />
            <path d="M 200 300 H 600" />
            <path d="M 600 300 H 1000" />
            <path d="M 200 500 H 600" />
            <path d="M 600 500 H 1000" />
            <path d="M 200 700 H 600" />
            <path d="M 600 700 H 1000" />

            {/* Vertical secondaries */}
            <path d="M 400 200 V 400" />
            <path d="M 400 400 V 600" />
            <path d="M 800 200 V 400" />
            <path d="M 800 400 V 600" />
          </g>

          {/* Tertiary lines */}
          <g fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity="0.5">
            <path d="M 120 200 V 400" />
            <path d="M 280 200 V 400" />
            <path d="M 520 200 V 400" />
            <path d="M 680 200 V 400" />
            <path d="M 920 200 V 400" />
            <path d="M 1080 200 V 400" />
          </g>

          {/* LEAK LOCATION - Center of DMA-05 */}
          <g transform="translate(500, 500)">
            {/* Outer pulse rings */}
            <circle r={leakBlink ? 50 : 40} fill="url(#leak-pulse)" />
            <circle
              r="35"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              opacity={leakBlink ? 0.6 : 0.3}
              strokeDasharray="6 3"
            />
            <circle r="25" fill="none" stroke="#ef4444" strokeWidth="2" opacity={leakBlink ? 0.8 : 0.4} />

            {/* Leak point */}
            <circle r="12" fill="#ef4444" filter="url(#glow-red)" opacity={leakBlink ? 1 : 0.7} />
            <circle r="6" fill="#fff" opacity="0.9" />
          </g>

          {/* Affected pipe segment - highlighted red */}
          <path
            d="M 400 500 H 600"
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
            opacity={leakBlink ? 1 : 0.6}
            filter="url(#glow-red)"
          />

          {/* Junction nodes */}
          <g>
            {/* Main intersections - green */}
            {[
              [200, 200],
              [200, 400],
              [200, 600],
              [600, 200],
              [600, 600],
              [1000, 200],
              [1000, 400],
              [1000, 600],
              [400, 200],
              [400, 600],
              [800, 200],
              [800, 400],
              [800, 600],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="8" fill="#0a0f1a" stroke="#22c55e" strokeWidth="3" />
                <circle cx={x} cy={y} r="3" fill="#22c55e" />
              </g>
            ))}

            {/* Critical node at leak location */}
            <g transform="translate(600, 400)">
              <circle r="10" fill="#0a0f1a" stroke="#ef4444" strokeWidth="3" />
              <circle r="4" fill="#ef4444" />
            </g>
          </g>

          {/* Leak callout label */}
          <g transform="translate(500, 500)">
            <line x1="30" y1="-30" x2="80" y2="-80" stroke="#ef4444" strokeWidth="2" />
            <rect x="80" y="-110" width="160" height="55" rx="6" fill="#0a0f1a" stroke="#ef4444" strokeWidth="2" />
            <text
              x="160"
              y="-85"
              fill="#ef4444"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="monospace"
            >
              LEAK DETECTED
            </text>
            <text x="160" y="-67" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              Node 4A | DMA-05
            </text>
          </g>

          {/* Map legend */}
          <g transform="translate(40, 720)">
            <rect x="0" y="0" width="320" height="45" rx="6" fill="#0a0f1a" fillOpacity="0.9" stroke="#1e293b" />
            <circle cx="20" cy="22" r="5" fill="#22c55e" />
            <text x="35" y="27" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
              Operational
            </text>
            <circle cx="130" cy="22" r="5" fill="#ef4444" />
            <text x="145" y="27" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
              Critical
            </text>
            <rect
              x="220"
              y="17"
              width="20"
              height="10"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              rx="2"
            />
            <text x="250" y="27" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
              DMA
            </text>
          </g>

          {/* Scale indicator */}
          <g transform="translate(1040, 740)">
            <line x1="0" y1="0" x2="100" y2="0" stroke="#4b5563" strokeWidth="2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#4b5563" strokeWidth="2" />
            <line x1="100" y1="-5" x2="100" y2="5" stroke="#4b5563" strokeWidth="2" />
            <text x="50" y="20" fill="#6b7280" fontSize="10" textAnchor="middle" fontFamily="monospace">
              500m
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}
