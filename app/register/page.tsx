"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      setIsLoading(true)
      // Simulate registration process
      setTimeout(() => {
        setIsLoading(false)
        window.location.href = "/"
      }, 1500)
    }
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-16">
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
          className="w-full max-w-2xl bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create Your SafeNest Account</h1>
            <p className="text-white/60 mt-2">Join our community and stay safe</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-orange-500" : "bg-white/20"}`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : <span>1</span>}
              </div>
              <div className={`h-1 w-12 sm:w-24 ${step >= 2 ? "bg-orange-500" : "bg-white/20"}`} />
            </div>

            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-orange-500" : "bg-white/20"}`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : <span>2</span>}
              </div>
              <div className={`h-1 w-12 sm:w-24 ${step >= 3 ? "bg-orange-500" : "bg-white/20"}`} />
            </div>

            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-orange-500" : "bg-white/20"}`}
            >
              <span>3</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.form
              onSubmit={handleNextStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="120"
                    placeholder="25"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select required>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    placeholder="XXXX XXXX XXXX"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  <div className="flex items-center gap-2">
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Button>
              </div>
            </motion.form>
          )}

          {/* Step 2: Address & Emergency Contacts */}
          {step === 2 && (
            <motion.form
              onSubmit={handleNextStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">Address & Emergency Contacts</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Home Address</Label>
                  <Input
                    id="homeAddress"
                    placeholder="123 Main St, Apt 4B"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workplaceAddress">Workplace Address (Optional)</Label>
                  <Input
                    id="workplaceAddress"
                    placeholder="456 Business Ave, Suite 200"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-4">Emergency Contacts</h3>

                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-3">Emergency Contact 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ec1Name">Full Name</Label>
                        <Input
                          id="ec1Name"
                          placeholder="Jane Doe"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec1Relation">Relationship</Label>
                        <Input
                          id="ec1Relation"
                          placeholder="Spouse, Parent, Friend, etc."
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec1Phone">Phone Number</Label>
                        <Input
                          id="ec1Phone"
                          type="tel"
                          placeholder="+1 (555) 987-6543"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-3">Emergency Contact 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ec2Name">Full Name</Label>
                        <Input
                          id="ec2Name"
                          placeholder="John Smith"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec2Relation">Relationship</Label>
                        <Input
                          id="ec2Relation"
                          placeholder="Sibling, Parent, Friend, etc."
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec2Phone">Phone Number</Label>
                        <Input
                          id="ec2Phone"
                          type="tel"
                          placeholder="+1 (555) 456-7890"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 flex-1">
                  <div className="flex items-center gap-2">
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <motion.form
              onSubmit={handleNextStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">Security Information</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-white/60">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityQuestion">Security Question</Label>
                  <Select required>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a security question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pet">What was the name of your first pet?</SelectItem>
                      <SelectItem value="street">What street did you grow up on?</SelectItem>
                      <SelectItem value="mother">What is your mother's maiden name?</SelectItem>
                      <SelectItem value="school">What was the name of your first school?</SelectItem>
                      <SelectItem value="city">In what city were you born?</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Security Answer</Label>
                  <Input
                    id="securityAnswer"
                    placeholder="Your answer"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Input id="terms" type="checkbox" required className="h-4 w-4 mt-1 bg-white/10 border-white/20" />
                  <Label htmlFor="terms" className="text-sm text-white/80">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-500 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-orange-500 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 flex-1"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Complete Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </motion.div>

        <p className="mt-8 text-white/40 text-sm text-center max-w-md">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500/80 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
