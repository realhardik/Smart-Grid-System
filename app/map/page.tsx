"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import MapView from "@/components/map-view"
import MetricsPanel from "@/components/metrics-panel"
import StatusHeader from "@/components/status-header"

export default function MapPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <StatusHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <MapView />
        <MetricsPanel />
      </div>
    </div>
  )
}
