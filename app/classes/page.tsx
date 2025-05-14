"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, ArrowLeft, Calendar, MapPin, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClassesPage() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Sample classes
  const classes = [
    {
      id: 1,
      title: "Basic Self-Defense for Beginners",
      instructor: "David Chen",
      description:
        "Learn fundamental self-defense techniques that anyone can master, regardless of strength or size. This class focuses on awareness, avoidance, and basic defensive moves.",
      image: "/placeholder.svg?height=300&width=600",
      schedule: "Mondays & Wednesdays, 6:00 PM - 7:30 PM",
      location: "Community Center, 123 Main St",
      capacity: "15 participants",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Women's Self-Defense Workshop",
      instructor: "Maria Rodriguez",
      description:
        "A specialized workshop designed for women, focusing on practical techniques to handle common threatening situations. Build confidence and learn effective strategies for personal safety.",
      image: "/placeholder.svg?height=300&width=600",
      schedule: "Tuesdays & Thursdays, 5:30 PM - 7:00 PM",
      location: "Fitness Studio, 456 Oak Ave",
      capacity: "12 participants",
      level: "All Levels",
    },
    {
      id: 3,
      title: "Advanced Self-Defense Tactics",
      instructor: "James Wilson",
      description:
        "For those with basic self-defense knowledge, this class teaches advanced techniques and scenarios. Includes defense against multiple attackers and weapon threats.",
      image: "/placeholder.svg?height=300&width=600",
      schedule: "Saturdays, 10:00 AM - 12:00 PM",
      location: "Martial Arts Center, 789 Pine St",
      capacity: "10 participants",
      level: "Intermediate/Advanced",
    },
  ]

  const handleClassSelection = (classId: number) => {
    setSelectedClass(classId)
    setShowRegistrationForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after showing success message
      setTimeout(() => {
        setShowRegistrationForm(false)
        setIsSuccess(false)
      }, 3000)
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

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="font-bold text-2xl tracking-tight">
              care<span className="text-orange-500">Alert</span>
            </span>
          </Link>

          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Previous Experience (Optional)</Label>
                    <Textarea
                      id="experience"
                      placeholder="Briefly describe any previous self-defense or martial arts experience you have..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions or Limitations (Optional)</Label>
                    <Textarea
                      id="medicalConditions"
                      placeholder="Please list any medical conditions or physical limitations that the instructor should be aware of..."
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

          <div className="space-y-12">
            {classes.map((cls) => (
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
            ))}
          </div>

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
            &copy; {new Date().getFullYear()} careAlert. All rights reserved. Safety for All.
          </div>
        </div>
      </footer>
    </div>
  )
}
