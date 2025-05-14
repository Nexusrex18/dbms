"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Menu, X, Shield, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
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

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white/90 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/community" className="text-white/90 hover:text-white transition-colors">
              Community
            </Link>
            <Link href="/classes" className="text-white/90 hover:text-white transition-colors">
              Self-Defense Classes
            </Link>
            <Link href="/login" className="text-white/90 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                Register
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={cn(
            "md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-50",
            !isMenuOpen && "hidden",
          )}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-white/90 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/community"
              className="text-white/90 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/classes"
              className="text-white/90 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Self-Defense Classes
            </Link>
            <Link
              href="/login"
              className="text-white/90 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10">
                Register
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Safety Is Our <span className="text-orange-500">Priority</span>
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              careAlert provides immediate assistance in emergency situations, connecting you with the help you need
              when you need it most.
            </p>

            {/* Emergency SOS Button */}
            <Link href="/emergency">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative inline-block">
                <motion.div
                  animate={{
                    boxShadow: ["0 0 0 0 rgba(249, 115, 22, 0.7)", "0 0 0 20px rgba(249, 115, 22, 0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="absolute inset-0 rounded-full"
                />
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-32 w-32 text-xl font-bold shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                >
                  SOS
                </Button>
              </motion.div>
            </Link>

            <p className="mt-6 text-white/60 text-sm">Press in case of emergency</p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How careAlert Protects You</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                whileHover={{ y: -10, boxShadow: "0 10px 30px -10px rgba(249, 115, 22, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-orange-500/20 p-3 rounded-full w-fit mb-4">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Emergency Response</h3>
                <p className="text-white/70">
                  Immediate connection to medical services or law enforcement based on your emergency type, with
                  automatic location sharing.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                whileHover={{ y: -10, boxShadow: "0 10px 30px -10px rgba(249, 115, 22, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-orange-500/20 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Support</h3>
                <p className="text-white/70">
                  Connect with others who have faced similar situations, share experiences, and learn from a supportive
                  community.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                whileHover={{ y: -10, boxShadow: "0 10px 30px -10px rgba(249, 115, 22, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-orange-500/20 p-3 rounded-full w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Self-Defense Training</h3>
                <p className="text-white/70">
                  Access to professional self-defense classes to help you build confidence and stay safe in any
                  situation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Voices from Our Community</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="italic text-white/80 mb-4">
                  "careAlert helped me during a medical emergency when I was alone at home. The ambulance arrived within
                  minutes, and my emergency contacts were notified immediately. This service saved my life."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="font-bold text-orange-500">SM</span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah M.</p>
                    <p className="text-sm text-white/60">Community Member</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="italic text-white/80 mb-4">
                  "The self-defense classes I took through careAlert gave me the confidence to walk alone at night. The
                  instructors were professional and taught practical techniques that are easy to remember."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="font-bold text-orange-500">RJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Robert J.</p>
                    <p className="text-sm text-white/60">Self-Defense Student</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-black/0 to-purple-900/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Safety Network Today</h2>
              <p className="text-xl text-white/80 mb-8">
                Register now to access all careAlert features and become part of a community dedicated to safety for
                all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Register Now
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                    Explore Community
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-xl tracking-tight">
                  care<span className="text-orange-500">Alert</span>
                </span>
              </Link>
              <p className="text-white/60 text-sm">
                Dedicated to creating a safer world for everyone through technology and community.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-white/60 hover:text-white text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-white/60 hover:text-white text-sm">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/classes" className="text-white/60 hover:text-white text-sm">
                    Self-Defense Classes
                  </Link>
                </li>
                <li>
                  <Link href="/emergency" className="text-white/60 hover:text-white text-sm">
                    Emergency Help
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-white/60 hover:text-white text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/60 hover:text-white text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/60 hover:text-white text-sm">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-white/60 text-sm">support@carealert.com</li>
                <li className="text-white/60 text-sm">Emergency Hotline: 1-800-SAFE-NOW</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            &copy; {new Date().getFullYear()} careAlert. All rights reserved. Safety for All.
          </div>
        </div>
      </footer>
    </div>
  )
}
