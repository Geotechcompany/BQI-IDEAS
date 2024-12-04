"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../../lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  BarChart3,
} from "lucide-react"

interface AdminSidebarProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Ideas",
    icon: Lightbulb,
    href: "/admin/ideas",
  },
  {
    title: "Approvals",
    icon: CheckCircle,
    href: "/admin/approvals",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function AdminSidebar({ isExpanded, onExpandedChange }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-white border-r h-screen transition-all duration-300",
        isExpanded ? "w-64" : "w-[70px]"
      )}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <Link href="/admin" className="flex items-center space-x-2">
          {isExpanded && <span className="font-bold text-xl">Admin</span>}
        </Link>
        <button
          onClick={() => onExpandedChange(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
} 