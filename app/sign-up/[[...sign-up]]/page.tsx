import { SignUp } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <SignUp
            path="/sign-up"
            appearance={{
              layout: {
                logoPlacement: "none",
                socialButtonsVariant: "blockButton",
                logoImageUrl: "",
              },
              elements: {
                rootBox: "mx-auto w-full",
                card: "bg-white shadow-xl border-0 rounded-2xl p-8",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-2 hover:bg-gray-50 transition-colors",
                formButtonPrimary: 
                  "bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium py-2 px-4 rounded-lg",
                footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium",
                formFieldInput: 
                  "rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
              },
            }}
            routing="path"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account? <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <Image
            src="/logo/bqilogo-light.png"
            alt="BQI Logo"
            width={120}
            height={40}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Join BQI Innovation Hub
          </h1>
          <p className="text-indigo-100 text-lg">
            Share your ideas, collaborate with colleagues, and make a difference in our organization.
          </p>
        </div>
      </div>
    </div>
  )
} 