"use client"

import Sidebar from "@/components/sidebar"
import StatusHeader from "@/components/status-header"
import { Database, Download, Filter, Search } from "lucide-react"

const logData = [
  {
    id: 1,
    timestamp: "2025-06-05 14:32:15",
    type: "ALERT",
    node: "4A",
    message: "Leak detected - Flow anomaly",
    severity: "critical",
  },
  {
    id: 2,
    timestamp: "2025-06-05 14:30:00",
    type: "SYSTEM",
    node: "ALL",
    message: "Scheduled pressure check completed",
    severity: "info",
  },
  {
    id: 3,
    timestamp: "2025-06-05 14:15:22",
    type: "WARNING",
    node: "3B",
    message: "Pressure drop detected",
    severity: "warning",
  },
  {
    id: 4,
    timestamp: "2025-06-05 13:45:10",
    type: "SYSTEM",
    node: "DMA5",
    message: "Valve status updated",
    severity: "info",
  },
  {
    id: 5,
    timestamp: "2025-06-05 12:00:00",
    type: "INFO",
    node: "ALL",
    message: "Daily maintenance window completed",
    severity: "info",
  },
  {
    id: 6,
    timestamp: "2025-06-05 11:30:45",
    type: "WARNING",
    node: "2C",
    message: "Flow rate fluctuation detected",
    severity: "warning",
  },
  {
    id: 7,
    timestamp: "2025-06-05 10:15:30",
    type: "INFO",
    node: "DMA1",
    message: "Sensor calibration completed",
    severity: "info",
  },
  {
    id: 8,
    timestamp: "2025-06-05 09:00:00",
    type: "SYSTEM",
    node: "ALL",
    message: "System startup completed",
    severity: "info",
  },
]

export default function DataLogsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <StatusHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">System Data Logs</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-sm hover:bg-background/80 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary/20 border border-primary/40 rounded-lg text-sm text-primary hover:bg-primary/30 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Node
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Message
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logData.map((log) => (
                    <tr key={log.id} className="border-b border-border/30 hover:bg-background/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            log.type === "ALERT"
                              ? "bg-destructive/20 text-destructive"
                              : log.type === "WARNING"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-foreground">{log.node}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{log.message}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`w-2 h-2 rounded-full inline-block mr-2 ${
                            log.severity === "critical"
                              ? "bg-destructive"
                              : log.severity === "warning"
                                ? "bg-yellow-500"
                                : "bg-accent"
                          }`}
                        />
                        <span className="text-sm text-muted-foreground capitalize">{log.severity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
