"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  avatar: string
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Engineering Lead",
    department: "Engineering",
    avatar: "/avatars/john.jpg"
  },
  // Add more team members...
]

export default function TeamsPage() {
  const { user } = useUser()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <h1 className="text-4xl font-bold text-purple-900 mb-8">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-purple-600">{member.role}</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{member.department}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 