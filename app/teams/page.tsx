"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"

interface TeamMember {
  name: string
  role: string
  department: string
  avatar: string
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    role: "Engineering Lead",
    department: "Engineering",
    avatar: "/avatars/john.jpg"
  },
  // Add more team members...
]

export default function TeamsPage() {
  const { user } = useUser()
  const userDepartment = user?.publicMetadata?.department as string

  const filteredMembers = teamMembers.filter(
    member => member.department === userDepartment
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <h1 className="text-4xl font-bold text-purple-900 mb-8">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-purple-600">{member.role}</p>
                <p className="text-sm text-gray-500">{member.department}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 