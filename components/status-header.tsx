"use client"

import { Clock, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export default function StatusHeader() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const isDark = theme === "dark"

  return (
    <div className="h-16 bg-card/50 backdrop-blur-md border-b border-border/50 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Smart Water Grid</h1>
        <p className="text-xs text-muted-foreground">Municipal Network Control</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50">
          <Clock className="w-4 h-4 text-primary" />
          <div className="text-sm font-mono">
            <span className="text-foreground">{currentTime}</span>
            <span className="text-muted-foreground mx-2">|</span>
            <span className="text-muted-foreground">{currentDate}</span>
          </div>
        </div>

        {mounted && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle theme"
            />
            <Moon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
