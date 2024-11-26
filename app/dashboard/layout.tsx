"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sidebar } from "../components/sidebar"
import { NotificationsDropdown } from "../components/notifications-dropdown"
import { Breadcrumbs } from "../components/breadcrumbs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-[70px]'}
        `}
      >
        <div className="md:hidden absolute right-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 md:hidden bg-white border-b p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <NotificationsDropdown />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex justify-between items-center p-4 bg-white border-b">
          <Breadcrumbs />
          <div className="flex items-center gap-4">
            <NotificationsDropdown />
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 