"use client"

import { Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function StatusHeader() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      )
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      )
    }
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-16 bg-card/50 backdrop-blur-md border-b border-border/50 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Smart Water Grid</h1>
        <p className="text-xs text-muted-foreground">Municipal Network Control</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50">
        <Clock className="w-4 h-4 text-primary" />
        <div className="text-sm font-mono">
          <span className="text-foreground">{currentTime}</span>
          <span className="text-muted-foreground mx-2">|</span>
          <span className="text-muted-foreground">{currentDate}</span>
        </div>
      </div>
    </div>
  )
}
