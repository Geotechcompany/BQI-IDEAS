"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from "@clerk/nextjs"

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserProfile 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0",
                navbar: "hidden",
              }
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
} 