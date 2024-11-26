"use client"

import { motion } from "framer-motion"
import { UserProfile } from "@clerk/nextjs"

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <h1 className="text-4xl font-bold text-indigo-900 mb-8">Settings</h1>
      <div className="max-w-4xl mx-auto">
        <style jsx global>{`
          .cl-rootBox {
            background-color: transparent !important;
          }
          .cl-card {
            background-color: transparent !important;
            box-shadow: none !important;
          }
          .cl-navbar {
            display: none !important;
          }
          .cl-profile-section {
            background-color: rgb(255 255 255 / 0.5) !important;
            backdrop-filter: blur(8px);
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            margin-bottom: 1rem;
          }
        `}</style>
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none p-0",
              navbar: "hidden",
            }
          }}
        />
      </div>
    </motion.div>
  )
} 