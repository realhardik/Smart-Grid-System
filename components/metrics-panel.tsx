"use client"

import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Gauge, Droplets, Activity } from "lucide-react"
import { useState } from "react"

const pressureData = [
  { time: "00:00", value: 2.1 },
  { time: "04:00", value: 2.0 },
  { time: "08:00", value: 1.9 },
  { time: "12:00", value: 1.8 },
  { time: "16:00", value: 1.6 },
  { time: "20:00", value: 1.5 },
]

const flowRateData = [
  { time: "00:00", value: 2.5 },
  { time: "04:00", value: 2.2 },
  { time: "08:00", value: 2.0 },
  { time: "12:00", value: 1.2 },
  { time: "16:00", value: 0.6 },
  { time: "20:00", value: 0.1 },
]

const waterLossData = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 120 },
  { time: "08:00", value: 245 },
  { time: "12:00", value: 420 },
  { time: "16:00", value: 615 },
  { time: "20:00", value: 785 },
]

export default function MetricsPanel() {
  const [isIsolating, setIsIsolating] = useState(false)

  return (
    <div className="w-80 bg-card/30 backdrop-blur-sm border-l border-border/50 p-4 overflow-y-auto flex flex-col gap-3">
      {/* Pressure Metric */}
      <div className="glass-effect rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pressure</span>
          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent">OK</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-4xl font-mono font-bold text-accent tracking-tight">1.5</span>
          <span className="text-sm text-muted-foreground">Bar</span>
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={pressureData}>
            <defs>
              <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 2.5]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fill="url(#pressureGrad)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-1">-0.6 Bar over 24h</p>
      </div>

      {/* Flow Rate Metric */}
      <div className="glass-effect rounded-lg p-4 ring-1 ring-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-destructive" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Flow Rate</span>
          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/20 text-destructive animate-pulse">
            CRITICAL
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-4xl font-mono font-bold text-destructive tracking-tight">0.1</span>
          <span className="text-sm text-muted-foreground">M³/hr</span>
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={flowRateData}>
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 3]} />
            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#flowGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-destructive font-medium mt-1">-2.4 M³/hr drop detected</p>
      </div>

      {/* Water Loss Metric */}
      <div className="glass-effect rounded-lg p-4 ring-2 ring-destructive/50 bg-destructive/5">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-4 h-4 text-destructive" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Water Loss</span>
          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive text-white animate-pulse">
            URGENT
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-5xl font-mono font-bold text-destructive tracking-tight">785</span>
          <span className="text-lg text-muted-foreground">L</span>
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={waterLossData}>
            <defs>
              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 900]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              fill="url(#lossGrad)"
              strokeWidth={2.5}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-destructive font-semibold mt-1">+170L in last 4 hours</p>
      </div>

      {/* Quick actions section */}
      <div className="mt-auto pt-3 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Quick Actions</p>
        <div className="flex flex-col gap-2">
          <button className="w-full bg-destructive hover:bg-destructive/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm uppercase tracking-wide">
            Auto-Isolate Segment
          </button>
          <button className="w-full bg-primary/15 hover:bg-primary/25 text-primary font-medium py-2 px-4 rounded-lg transition-colors text-xs border border-primary/30">
            Alert Emergency Crew
          </button>
        </div>
      </div>
    </div>
  )
}
