"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { name: "Jan", ideas: 4, implemented: 2 },
  { name: "Feb", ideas: 6, implemented: 3 },
  // Add more data...
]

export default function AnalyticsPage() {
  const { user } = useUser()
  const department = user?.publicMetadata?.department as string

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <h1 className="text-4xl font-bold text-emerald-900 mb-8">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Ideas Performance</h2>
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ideas" fill="#8884d8" />
            <Bar dataKey="implemented" fill="#82ca9d" />
          </BarChart>
        </motion.div>
        {/* Add more analytics components */}
      </div>
    </motion.div>
  )
} 