"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Lightbulb, Users, Zap, Shield } from "lucide-react"
import { Button } from "../components/ui/button"
import { useUser } from "@clerk/nextjs";

const features = [
  {
    icon: Lightbulb,
    title: "Share Ideas",
    description: "Submit and collaborate on innovative ideas that shape our future",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Work together with colleagues across departments",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Quick Implementation",
    description: "See your ideas come to life with our streamlined process",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your ideas are protected with enterprise-grade security",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          <nav className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <Image
                src="/logo/bqilogo.png"
                alt="BQI Logo"
                width={120}
                height={40}
                className="w-32"
              />
              <div className="space-x-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button>Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>

          <motion.div 
            className="container mx-auto px-6 pt-24 pb-32 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl font-bold text-gray-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Innovation Starts Here
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Transform your ideas into reality. Join our community of innovators and make a difference.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/sign-up">
                <Button size="lg" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="container mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center text-gray-900 mb-16"
          variants={itemVariants}
        >
          Everything you need to innovate
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="relative group"
            >
              <div className={`absolute inset-0 ${feature.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative p-8 rounded-2xl border border-gray-200 hover:border-transparent transition-colors duration-300">
                <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

