"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black"
          animate={{
            backgroundPosition: [`0% 0%`, `100% 100%`],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover opacity-10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
          <Shield className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-xl tracking-tight">
            Safe<span className="text-orange-500">Nest</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-white/60 mt-2">Sign in to access your SafeNest account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-orange-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="mt-8 text-white/40 text-sm text-center max-w-md">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-orange-500/80 hover:text-orange-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-orange-500/80 hover:text-orange-500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
