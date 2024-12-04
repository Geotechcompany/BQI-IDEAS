"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { AdminSidebar } from "../components/admin/admin-sidebar"

import { UserButton } from "@clerk/nextjs"
import { AdminBreadcrumbs } from "../components/admin/admin-breadcrumbs"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Show nothing while checking authentication
  if (!isLoaded || !user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 bg-white border-b p-4 flex items-center justify-between">
          <AdminBreadcrumbs />
          <UserButton afterSignOutUrl="/" />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 