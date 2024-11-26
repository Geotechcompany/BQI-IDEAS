"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Building2, Briefcase } from "lucide-react"

const departments = [
  {
    id: "engineering",
    name: "Engineering",
    description: "Software development, architecture, and technical innovation",
    icon: Code2,
    color: "text-blue-500"
  },
  {
    id: "operations",
    name: "Operations",
    description: "Business operations, infrastructure, and process optimization",
    icon: Building2,
    color: "text-green-500"
  },
  {
    id: "professional-services",
    name: "Professional Services",
    description: "Consulting, implementation, and client success services",
    icon: Briefcase,
    color: "text-purple-500"
  }
]

export default function DepartmentsPage() {
  const { user } = useUser()
  const { user: clerkUser } = useClerk()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const currentDepartment = user?.unsafeMetadata?.department as string

  const handleSelectDepartment = async (departmentId: string) => {
    if (isLoading) return
    setIsLoading(departmentId)

    try {
      await clerkUser?.update({
        unsafeMetadata: {
          department: departmentId
        }
      })
      router.refresh() // Refresh the current page instead of redirecting
    } catch (error) {
      console.error("Failed to update department:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Select Your Department
        </h1>
        <p className="text-lg text-gray-600">
          Choose your department to personalize your experience and connect with your team
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {departments.map((dept) => {
          const Icon = dept.icon
          const isSelected = currentDepartment === dept.id
          const isProcessing = isLoading === dept.id

          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'border-2 border-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => handleSelectDepartment(dept.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${dept.color}`} />
                    <CardTitle>{dept.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {dept.description}
                  </CardDescription>
                  <Button 
                    variant={isSelected ? "secondary" : "outline"}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Selecting..." : isSelected ? "Selected" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
} 