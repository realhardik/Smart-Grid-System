"use client"

import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Gauge, Droplets, Activity } from "lucide-react"
import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface SensorData {
  flowRate: number
  pressure: number
  waterLoss: number
  timestamp: string
}

interface HistoryData {
  time: string
  value: number
}

export default function MetricsPanel() {
  const [isIsolating, setIsIsolating] = useState(false)
  const [currentData, setCurrentData] = useState<SensorData>({
    flowRate: 0,
    pressure: 0,
    waterLoss: 0,
    timestamp: new Date().toISOString(),
  })
  const [pressureData, setPressureData] = useState<HistoryData[]>([])
  const [flowRateData, setFlowRateData] = useState<HistoryData[]>([])
  const [waterLossData, setWaterLossData] = useState<HistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current sensor data
  const fetchCurrentData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sensor/current`)
      if (!response.ok) throw new Error('Failed to fetch sensor data')
      const result = await response.json()
      if (result.success) {
        setCurrentData(result.data)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching current data:', err)
      setError('Unable to connect to sensor')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch historical data for charts
  const fetchHistoryData = async () => {
    try {
      const [pressureRes, flowRes, lossRes] = await Promise.all([
        fetch(`${API_URL}/api/sensor/history?metric=pressure&hours=24`),
        fetch(`${API_URL}/api/sensor/history?metric=flowRate&hours=24`),
        fetch(`${API_URL}/api/sensor/history?metric=waterLoss&hours=24`),
      ])

      if (pressureRes.ok) {
        const pressureResult = await pressureRes.json()
        if (pressureResult.success) {
          setPressureData(pressureResult.data || [])
        }
      }

      if (flowRes.ok) {
        const flowResult = await flowRes.json()
        if (flowResult.success) {
          setFlowRateData(flowResult.data || [])
        }
      }

      if (lossRes.ok) {
        const lossResult = await lossRes.json()
        if (lossResult.success) {
          setWaterLossData(lossResult.data || [])
        }
      }
    } catch (err) {
      console.error('Error fetching history data:', err)
    }
  }

  // Initial fetch and setup polling
  useEffect(() => {
    fetchCurrentData()
    fetchHistoryData()

    // Poll every 4 seconds (between 3-5 seconds as requested)
    const interval = setInterval(() => {
      fetchCurrentData()
      fetchHistoryData()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Calculate status and trends
  const getPressureStatus = () => {
    if (currentData.pressure < 1.0) return { text: 'LOW', color: 'text-destructive', bg: 'bg-destructive/20' }
    if (currentData.pressure > 2.5) return { text: 'HIGH', color: 'text-destructive', bg: 'bg-destructive/20' }
    return { text: 'OK', color: 'text-accent', bg: 'bg-accent/20' }
  }

  const getFlowRateStatus = () => {
    if (currentData.flowRate < 0.5) return { text: 'CRITICAL', color: 'text-destructive', bg: 'bg-destructive/20' }
    if (currentData.flowRate > 2.5) return { text: 'HIGH', color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
    return { text: 'NORMAL', color: 'text-accent', bg: 'bg-accent/20' }
  }

  const getWaterLossStatus = () => {
    if (currentData.waterLoss > 500) return { text: 'URGENT', color: 'text-destructive', bg: 'bg-destructive' }
    if (currentData.waterLoss > 200) return { text: 'WARNING', color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
    return { text: 'OK', color: 'text-accent', bg: 'bg-accent/20' }
  }

  const pressureStatus = getPressureStatus()
  const flowRateStatus = getFlowRateStatus()
  const waterLossStatus = getWaterLossStatus()

  // Calculate trend (simple: compare first and last values)
  const getTrend = (data: HistoryData[]) => {
    if (data.length < 2) return { value: 0, text: '' }
    const first = data[0]?.value || 0
    const last = data[data.length - 1]?.value || 0
    const diff = last - first
    return {
      value: Math.abs(diff),
      text: diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1),
      isPositive: diff >= 0,
    }
  }

  const pressureTrend = getTrend(pressureData)
  const flowTrend = getTrend(flowRateData)
  const lossTrend = getTrend(waterLossData)

  return (
    <div className="w-80 bg-card/30 backdrop-blur-sm border-l border-border/50 p-4 overflow-y-auto flex flex-col gap-3">
      {/* Pressure Metric */}
      <div className="glass-effect rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pressure</span>
          <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold ${pressureStatus.bg} ${pressureStatus.color}`}>
            {pressureStatus.text}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          {isLoading ? (
            <span className="text-4xl font-mono font-bold text-muted-foreground tracking-tight">--</span>
          ) : (
            <>
              <span className="text-4xl font-mono font-bold text-accent tracking-tight">
                {currentData.pressure.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">Bar</span>
            </>
          )}
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={pressureData.length > 0 ? pressureData : [{ time: '00:00', value: 0 }]}>
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
        <p className={`text-[10px] mt-1 ${pressureTrend.isPositive ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
          {pressureTrend.text ? `${pressureTrend.text} Bar over 24h` : 'No data'}
        </p>
      </div>

      {/* Flow Rate Metric */}
      <div className={`glass-effect rounded-lg p-4 ${flowRateStatus.text === 'CRITICAL' ? 'ring-1 ring-destructive/30' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-destructive" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Flow Rate</span>
          <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${flowRateStatus.bg} ${flowRateStatus.color} ${flowRateStatus.text === 'CRITICAL' ? 'animate-pulse' : ''}`}>
            {flowRateStatus.text}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          {isLoading ? (
            <span className="text-4xl font-mono font-bold text-muted-foreground tracking-tight">--</span>
          ) : (
            <>
              <span className="text-4xl font-mono font-bold text-destructive tracking-tight">
                {currentData.flowRate.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">M³/hr</span>
            </>
          )}
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={flowRateData.length > 0 ? flowRateData : [{ time: '00:00', value: 0 }]}>
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
        <p className={`text-[10px] font-medium mt-1 ${flowTrend.isPositive ? 'text-muted-foreground' : 'text-destructive'}`}>
          {flowTrend.text ? `${flowTrend.text} M³/hr ${flowTrend.isPositive ? 'increase' : 'drop'} detected` : 'No data'}
        </p>
      </div>

      {/* Water Loss Metric */}
      <div className={`glass-effect rounded-lg p-4 ${waterLossStatus.text === 'URGENT' ? 'ring-2 ring-destructive/50 bg-destructive/5' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-4 h-4 text-destructive" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Water Loss</span>
          <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${waterLossStatus.bg} ${waterLossStatus.text === 'URGENT' ? 'text-white animate-pulse' : 'text-destructive'}`}>
            {waterLossStatus.text}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          {isLoading ? (
            <span className="text-5xl font-mono font-bold text-muted-foreground tracking-tight">--</span>
          ) : (
            <>
              <span className="text-5xl font-mono font-bold text-destructive tracking-tight">
                {currentData.waterLoss}
              </span>
              <span className="text-lg text-muted-foreground">L</span>
            </>
          )}
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={waterLossData.length > 0 ? waterLossData : [{ time: '00:00', value: 0 }]}>
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
        <p className={`text-[10px] font-semibold mt-1 ${lossTrend.isPositive ? 'text-destructive' : 'text-muted-foreground'}`}>
          {lossTrend.text ? `${lossTrend.isPositive ? '+' : ''}${lossTrend.value.toFixed(0)}L in last 24 hours` : 'No data'}
        </p>
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
