import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-md w-full">
        <SignIn
          path="/sign-in"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl border-0",
              headerTitle: "text-2xl font-bold text-indigo-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-2 hover:border-indigo-500",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              footerActionLink: "text-indigo-600 hover:text-indigo-700"
            }
          }}
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
} 