"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative animate-pulse">
            <Shield className="h-12 w-12 text-orange-500" />
          </div>
          <p className="text-white/70">Loading SafeNest...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return <>{children}</>
}
