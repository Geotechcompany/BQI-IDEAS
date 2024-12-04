"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    const label = path.charAt(0).toUpperCase() + path.slice(1)
    const isLast = index === paths.length - 1

    return {
      href,
      label: label === "Admin" ? "Dashboard" : label,
      isLast
    }
  })

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm text-gray-600"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          {breadcrumb.isLast ? (
            <span className="font-medium text-indigo-600">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-indigo-600 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  )
} 