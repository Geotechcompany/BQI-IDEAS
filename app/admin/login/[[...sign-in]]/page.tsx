"use client"

import { motion } from "framer-motion"
import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/logo/bqilogo-light.png"
              alt="Admin Logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </motion.div>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/5",
              socialButtonsProviderIcon: "text-white",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-white/5 border-white/10 text-white",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              formFieldInputShowPasswordButton: "text-gray-400",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-400",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              alertText: "text-red-400",
              footer: "hidden",
            },
          }}
          path="/admin/login"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/admin"
          afterSignInUrl="/admin"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-gray-400"
        >
          Protected by enterprise-grade security
        </motion.p>
      </motion.div>
    </div>
  )
} 