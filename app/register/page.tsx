"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowRight, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { checkAPIHealth } from "@/lib/api"
import Header from "@/components/header"

export default function RegisterPage() {
  const { register, error: authError, clearError } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    aadhar: "",
    
    // Step 2
    homeAddress: "",
    city: "",
    state: "",
    zipCode: "",
    workplaceAddress: "",
    ec1Name: "",
    ec1Relation: "",
    ec1Phone: "",
    ec2Name: "",
    ec2Relation: "",
    ec2Phone: "",
    
    // Step 3
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    terms: false
  })

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }))
  }
  
  // Handle select change
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const validateStep = (currentStep: number): boolean => {
    setError(null)
    
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.age || !formData.gender || !formData.aadhar) {
        setError("Please fill in all required fields")
        return false
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return false
      }
      
      // Phone validation
      const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid phone number")
        return false
      }
      
      // Age validation
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 18 || age > 120) {
        setError("Please enter a valid age between 18 and 120")
        return false
      }
      
      // Aadhar validation (simple length check for now)
      if (formData.aadhar.replace(/\s/g, '').length !== 12) {
        setError("Please enter a valid 12-digit Aadhar number")
        return false
      }
    } 
    
    else if (currentStep === 2) {
      if (!formData.homeAddress || !formData.city || !formData.state || !formData.zipCode || 
          !formData.ec1Name || !formData.ec1Relation || !formData.ec1Phone || 
          !formData.ec2Name || !formData.ec2Relation || !formData.ec2Phone) {
        setError("Please fill in all required fields")
        return false
      }
      
      // Zip code validation
      const zipRegex = /^\d{5,6}$/
      if (!zipRegex.test(formData.zipCode.replace(/\s/g, ''))) {
        setError("Please enter a valid 5-6 digit ZIP/Postal code")
        return false
      }
      
      // Phone number validation for emergency contacts
      const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/
      if (!phoneRegex.test(formData.ec1Phone) || !phoneRegex.test(formData.ec2Phone)) {
        setError("Please enter valid phone numbers for emergency contacts")
        return false
      }
      
      // Check that emergency contacts are different
      if (formData.ec1Phone === formData.ec2Phone) {
        setError("Emergency contacts should be different people")
        return false
      }
    } 
    
    else if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword || !formData.securityQuestion || !formData.securityAnswer) {
        setError("Please fill in all required fields")
        return false
      }
      
      // Password validation
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long")
        return false
      }
      
      // Check for password strength
      const hasLetter = /[a-zA-Z]/.test(formData.password)
      const hasNumber = /[0-9]/.test(formData.password)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      
      if (!(hasLetter && (hasNumber || hasSpecial))) {
        setError("Password must include letters and at least one number or special character")
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      
      if (formData.securityAnswer.length < 2) {
        setError("Please provide a security answer with at least 2 characters")
        return false
      }
      
      if (!formData.terms) {
        setError("You must agree to the Terms of Service and Privacy Policy")
        return false
      }
    }
    
    return true
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate current step
    if (!validateStep(step)) {
      return
    }
    
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  // Check if backend API is reachable
  const checkAPIConnection = async () => {
    return await checkAPIHealth();
  }
  
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    clearError()
    
    // Check API connection before proceeding
    const apiAvailable = await checkAPIConnection();
    if (!apiAvailable) {
      setError("Unable to connect to server. Please ensure the backend service is running.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Create username from email with timestamp to ensure uniqueness
      const emailPrefix = formData.email.split('@')[0]
      // Use last 4 digits of the timestamp for a shorter username
      const timestamp = Date.now().toString().slice(-4)
      const username = `${emailPrefix}_${timestamp}`
      
      // Format address as a string
      const formattedAddress = `${formData.homeAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`
      
      // Prepare user data for registration
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        username: username, // Add username field required by backend
        phone: formData.phone,
        password: formData.password,
        address: formattedAddress, // Send address as a string as required by backend
        // Additional data to be processed after user creation
        meta: {
          age: parseInt(formData.age),
          gender: formData.gender,
          id_number: formData.aadhar,
          workplace_address: formData.workplaceAddress || null,
          emergency_contacts: [
            {
              name: formData.ec1Name,
              relationship: formData.ec1Relation,
              phone: formData.ec1Phone
            },
            {
              name: formData.ec2Name,
              relationship: formData.ec2Relation,
              phone: formData.ec2Phone
            }
          ],
          security: {
            question: formData.securityQuestion,
            answer: formData.securityAnswer
          }
        }
      }
      
      console.log('Registering user with data:', userData)
      
      // Call the register function from AuthContext
      await register(userData)
      
      // Show success message
      setSuccess("Account created successfully! Redirecting to dashboard...")
      
      // If the automatic login in the register function fails,
      // we can try to manually redirect
      setTimeout(() => {
        if (!authError) {
          router.push('/')
        }
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Registration failed. Please check your information and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Header />
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black pointer-events-none"
          animate={{
            backgroundPosition: [`0% 0%`, `100% 100%`],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover opacity-10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 pt-16">

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
          
          {(error || authError) && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Registration Error</p>
                <p className="text-sm">{error || authError}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
              <Check className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success</p>
                <p className="text-sm">{success}</p>
              </div>
            </div>
          )}

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
                    value={formData.fullName}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    value={formData.age}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    required
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
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
                    value={formData.aadhar}
                    onChange={handleInputChange}
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
                    value={formData.homeAddress}
                    onChange={handleInputChange}
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
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workplaceAddress">Workplace Address (Optional)</Label>
                  <Input
                    id="workplaceAddress"
                    placeholder="456 Business Ave, Suite 200"
                    value={formData.workplaceAddress}
                    onChange={handleInputChange}
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
                          value={formData.ec1Name}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec1Relation">Relationship</Label>
                        <Input
                          id="ec1Relation"
                          placeholder="Spouse, Parent, Friend, etc."
                          required
                          value={formData.ec1Relation}
                          onChange={handleInputChange}
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
                          value={formData.ec1Phone}
                          onChange={handleInputChange}
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
                          value={formData.ec2Name}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ec2Relation">Relationship</Label>
                        <Input
                          id="ec2Relation"
                          placeholder="Sibling, Parent, Friend, etc."
                          required
                          value={formData.ec2Relation}
                          onChange={handleInputChange}
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
                          value={formData.ec2Phone}
                          onChange={handleInputChange}
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
                    value={formData.password}
                    onChange={handleInputChange}
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
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityQuestion">Security Question</Label>
                  <Select
                    required
                    value={formData.securityQuestion}
                    onValueChange={(value) => handleSelectChange("securityQuestion", value)}
                  >
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
                    value={formData.securityAnswer}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Input 
                    id="terms" 
                    type="checkbox" 
                    required 
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-1 bg-white/10 border-white/20" 
                  />
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
