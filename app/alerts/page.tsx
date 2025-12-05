"use client"

import Sidebar from "@/components/sidebar"
import StatusHeader from "@/components/status-header"
import { AlertTriangle, Bell, CheckCircle, Clock, XCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    title: "Critical Leak Detected",
    location: "Node 4A - DMA 5",
    time: "14:32",
    status: "active",
    severity: "critical",
    waterLoss: "785 L",
    description: "Significant flow anomaly detected. Immediate attention required.",
  },
  {
    id: 2,
    title: "Pressure Warning",
    location: "Node 3B - DMA 3",
    time: "14:15",
    status: "acknowledged",
    severity: "warning",
    waterLoss: "N/A",
    description: "Pressure below threshold. Monitoring in progress.",
  },
  {
    id: 3,
    title: "Sensor Malfunction",
    location: "Node 2C - DMA 2",
    time: "11:30",
    status: "resolved",
    severity: "info",
    waterLoss: "N/A",
    description: "Sensor recalibrated successfully.",
  },
]

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StatusHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Alert Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/40">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-destructive font-semibold">1 Active Critical</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`glass-effect rounded-xl p-5 ${
                  alert.severity === "critical" && alert.status === "active" ? "ring-2 ring-destructive/50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.severity === "critical"
                          ? "bg-destructive/20"
                          : alert.severity === "warning"
                            ? "bg-yellow-500/20"
                            : "bg-primary/20"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.severity === "critical"
                            ? "text-destructive"
                            : alert.severity === "warning"
                              ? "text-yellow-500"
                              : "text-primary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground font-mono">{alert.location}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                        {alert.waterLoss !== "N/A" && (
                          <span className="text-xs text-destructive font-semibold">Loss: {alert.waterLoss}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                        alert.status === "active"
                          ? "bg-destructive/20 text-destructive"
                          : alert.status === "acknowledged"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-accent/20 text-accent"
                      }`}
                    >
                      {alert.status}
                    </span>
                    {alert.status === "active" && (
                      <button className="p-2 rounded-lg bg-destructive hover:bg-destructive/80 transition-colors">
                        <XCircle className="w-4 h-4 text-white" />
                      </button>
                    )}
                    {alert.status === "acknowledged" && (
                      <button className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                        <CheckCircle className="w-4 h-4 text-accent-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
