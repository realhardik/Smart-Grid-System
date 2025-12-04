"use client"

import { MapPin, Database, AlertTriangle, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: MapPin, label: "Map", href: "/map" },
  { icon: Database, label: "Data Logs", href: "/data-logs" },
  { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-16 bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-6 gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative p-3 rounded-lg transition-all group ${
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            }`}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />}
            <div className="absolute left-full ml-3 px-2 py-1 bg-card border border-border text-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {item.label}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
