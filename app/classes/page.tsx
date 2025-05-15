"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, ArrowLeft, Calendar, MapPin, Users, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { classesService } from "@/lib/api"
import ProtectedRoute from "@/components/protected-route"
import Header from "@/components/header"

interface Class {
  id: number
  title: string
  instructor: string | { name: string; bio?: string; qualifications?: string[] }
  description: string
  image?: string
  schedule?: string
  time?: string
  date?: string
  location: string
  capacity: string | number
  level: string
  registered?: number
  type?: string
}

export default function ClassesPage() {
  const { user } = useAuth()
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
    medicalConditions: "",
  })

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classesService.getClasses()
        const fetchedClasses = response.data.map((cls: any) => ({
          ...cls,
          // Format schedule from API time and date if needed
          schedule: cls.schedule || `${cls.date || ""} ${cls.time || ""}`.trim(),
          // Ensure capacity is displayed properly
          capacity: cls.capacity 
            ? (typeof cls.capacity === 'number' ? `${cls.capacity} participants` : cls.capacity)
            : `${cls.capacity || 0} participants`,
          // Set image fallback
          image: cls.image || "/placeholder.svg?height=300&width=600",
          // Format instructor if it's an object
          instructor: typeof cls.instructor === 'object' ? cls.instructor.name : cls.instructor
        }))
        setClasses(fetchedClasses)
      } catch (err) {
        console.error("Failed to fetch classes:", err)
        setError("Failed to load classes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const handleClassSelection = (classId: number) => {
    setSelectedClass(classId)
    setShowRegistrationForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setRegistrationData((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass || !user) return

    setIsSubmitting(true)
    setError(null)

    try {
      await classesService.registerForClass(selectedClass)
      setIsSuccess(true)
      
      // Reset form after showing success message
      setTimeout(() => {
        setShowRegistrationForm(false)
        setIsSuccess(false)
        setRegistrationData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          experience: "",
          medicalConditions: "",
        })
      }, 3000)
    } catch (err) {
      console.error("Registration failed:", err)
      setError("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
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

        {/* Back Link */}
        <div className="container mx-auto px-4 py-4 relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white w-fit">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          {/* Registration Form */}
          {showRegistrationForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-12"
            >
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                  <p className="text-white/80 mb-4">
                    You have successfully registered for the class. We'll send you a confirmation email with all the
                    details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Class Registration</h2>
                    <button onClick={() => setShowRegistrationForm(false)} className="text-white/60 hover:text-white">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="class">Selected Class</Label>
                      <Select defaultValue={selectedClass?.toString()} required>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          required
                          value={registrationData.fullName}
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
                          value={registrationData.email}
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
                          value={registrationData.phone}
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
                          value={registrationData.age}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Previous Experience (Optional)</Label>
                      <Textarea
                        id="experience"
                        placeholder="Briefly describe any previous self-defense or martial arts experience you have..."
                        value={registrationData.experience}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions or Limitations (Optional)</Label>
                      <Textarea
                        id="medicalConditions"
                        placeholder="Please list any medical conditions or physical limitations that the instructor should be aware of..."
                        value={registrationData.medicalConditions}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Input id="terms" type="checkbox" required className="h-4 w-4 mt-1 bg-white/10 border-white/20" />
                      <Label htmlFor="terms" className="text-sm text-white/80">
                        I understand that physical activity involves risks, and I am participating at my own risk. I agree
                        to follow all safety instructions provided by the instructor.
                      </Label>
                    </div>

                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Register for Class"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Self-Defense Classes</h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                Learn practical self-defense techniques from experienced instructors in a safe and supportive environment.
                Our classes are designed for all skill levels and focus on building confidence and safety awareness.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                <span className="ml-3 text-white/70">Loading classes...</span>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-6 rounded-lg mb-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-xl font-bold mb-2">Failed to Load Classes</h3>
                <p>{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4 border-white/20 hover:bg-white/5"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {classes.length === 0 ? (
                  <div className="text-center py-12 text-white/70">
                    No classes available at the moment. Please check back later.
                  </div>
                ) : (
                  classes.map((cls) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <Image
                          src={cls.image || "/placeholder.svg"}
                          width={600}
                          height={300}
                          alt={cls.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="p-6 flex flex-col">
                          <div className="mb-2 text-orange-500 text-sm font-medium">{cls.level}</div>
                          <h2 className="text-2xl font-bold mb-2">{cls.title}</h2>
                          <p className="text-white/70 mb-4">{cls.description}</p>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-white/80">
                              <Calendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              <span>{cls.schedule}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              <span>{cls.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <Users className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              <span>{cls.capacity}</span>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <Button
                              onClick={() => handleClassSelection(cls.id)}
                              className="w-full bg-orange-500 hover:bg-orange-600"
                            >
                              Register Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            <div className="mt-16 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">Why Take Our Self-Defense Classes?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                    <span className="font-bold text-orange-500">1</span>
                  </div>
                  <h3 className="font-semibold">Build Confidence</h3>
                  <p className="text-white/70">
                    Gain the confidence to navigate any situation with a sense of security and self-assurance.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                    <span className="font-bold text-orange-500">2</span>
                  </div>
                  <h3 className="font-semibold">Practical Skills</h3>
                  <p className="text-white/70">
                    Learn techniques that work in real-world situations, regardless of your size or strength.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                    <span className="font-bold text-orange-500">3</span>
                  </div>
                  <h3 className="font-semibold">Supportive Community</h3>
                  <p className="text-white/70">
                    Join a community of like-minded individuals committed to personal safety and empowerment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-white/40 text-sm">
              &copy; {new Date().getFullYear()} SafeNest. All rights reserved. Safety for All.
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
