"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Lightbulb,
  Building2,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";

interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function Sidebar({ isExpanded, onExpandedChange }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const clerk = useClerk();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Lightbulb, label: "Ideas", href: "/dashboard/ideas" },
    { icon: Building2, label: "Departments", href: "/dashboard/departments" },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Image
                src="/logo/bqilogo-light.png"
                alt="Logo"
                width={42}
                height={42}
                className="rounded-md"
              />
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xl font-bold text-white"
              >
                Ideas Portal
              </motion.h1>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex justify-center w-full"
            >
              <Image
                src="/logo/bqilogo-light.png"
                alt="Logo"
                width={62}
                height={62}
                className="rounded-md"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => onExpandedChange(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full relative group flex items-center justify-start transition-colors duration-200",
                    isActive
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                    !isExpanded && "justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive ? "text-white" : "text-white/80",
                      !isExpanded && "transform scale-110"
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Button>
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <Button
          onClick={() => clerk.signOut()}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 rounded-lg py-2 flex items-center justify-center"
        >
          {isExpanded ? (
            <>
              <LogOut className="h-8 w-8 mr-2" />
              <span>Logout</span>
            </>
          ) : (
            <LogOut className="h-8 w-8" />
          )}
        </Button>
      </div>
    </div>
  );
}
