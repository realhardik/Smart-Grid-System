"use client"

import Sidebar from "@/components/sidebar"
import StatusHeader from "@/components/status-header"
import { Bell, Database, Shield, Sliders, User, Wifi } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <StatusHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">System Settings</h1>
            </div>

            <div className="space-y-4">
              {/* Alert Settings */}
              <div className="glass-effect rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Alert Configuration</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Critical Alert Threshold</p>
                      <p className="text-xs text-muted-foreground">
                        Flow rate drop percentage to trigger critical alert
                      </p>
                    </div>
                    <input
                      type="number"
                      defaultValue={80}
                      className="w-20 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Auto-Isolate on Critical</p>
                      <p className="text-xs text-muted-foreground">Automatically isolate segment on critical leak</p>
                    </div>
                    <button className="w-12 h-6 bg-accent rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Network Settings */}
              <div className="glass-effect rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Network Configuration</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Sensor Polling Interval</p>
                      <p className="text-xs text-muted-foreground">How often to query network sensors</p>
                    </div>
                    <select className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm">
                      <option>5 seconds</option>
                      <option>10 seconds</option>
                      <option>30 seconds</option>
                      <option>1 minute</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Database Settings */}
              <div className="glass-effect rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Data Management</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Data Retention Period</p>
                      <p className="text-xs text-muted-foreground">How long to keep historical data</p>
                    </div>
                    <select className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User Settings */}
              <div className="glass-effect rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">User Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive email for critical alerts</p>
                    </div>
                    <button className="w-12 h-6 bg-accent rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Sound Alerts</p>
                      <p className="text-xs text-muted-foreground">Play sound on new alerts</p>
                    </div>
                    <button className="w-12 h-6 bg-muted rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="glass-effect rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Security</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg text-sm text-primary hover:bg-primary/30 transition-colors">
                    Change Password
                  </button>
                  <button className="px-4 py-2 bg-background/50 border border-border rounded-lg text-sm hover:bg-background/80 transition-colors">
                    View Audit Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
