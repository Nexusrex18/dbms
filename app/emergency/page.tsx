"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Ambulance, Shield, MapPin, Video, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmergencyPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isHelpSent, setIsHelpSent] = useState(false)

  const handleEmergencySelection = (type: string) => {
    setSelectedOption(type)
    setIsProcessing(true)

    // Simulate processing and sending help
    setTimeout(() => {
      setIsProcessing(false)
      setIsHelpSent(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black"
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
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-8">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
          {!selectedOption && !isHelpSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8">What type of emergency are you experiencing?</h1>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => handleEmergencySelection("medical")}
                    className="w-full h-40 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center gap-4 rounded-xl text-xl"
                  >
                    <Ambulance className="h-12 w-12" />
                    <span>Medical Emergency</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => handleEmergencySelection("violence")}
                    className="w-full h-40 bg-orange-500 hover:bg-orange-600 flex flex-col items-center justify-center gap-4 rounded-xl text-xl"
                  >
                    <Shield className="h-12 w-12" />
                    <span>Violence Emergency</span>
                  </Button>
                </motion.div>
              </div>

              <p className="mt-8 text-white/60">
                Select the type of emergency to get immediate assistance. Your location will be shared with emergency
                services.
              </p>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="mx-auto h-20 w-20 rounded-full bg-orange-500/20 flex items-center justify-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.2,
                    }}
                    className="h-12 w-12 rounded-full bg-orange-500/40 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.4,
                      }}
                      className="h-6 w-6 rounded-full bg-orange-500"
                    />
                  </motion.div>
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Processing Your Emergency</h2>
              <p className="text-white/80 mb-2">Please stay on this page</p>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Locating your position...</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Contacting emergency services...</span>
                </li>
                {selectedOption === "violence" && (
                  <li className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Activating video recording...</span>
                  </li>
                )}
              </ul>
            </motion.div>
          )}

          {isHelpSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-8 text-green-500">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                  className="mx-auto h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Help is on the way!</h2>
              <p className="text-white/80 mb-6">
                {selectedOption === "medical"
                  ? "Medical services have been notified and are en route to your location."
                  : "Police and support services have been notified and are en route to your location."}
              </p>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
                <h3 className="font-bold mb-2">Actions taken:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Your location has been shared with emergency services</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Your emergency contacts have been notified</span>
                  </li>
                  {selectedOption === "medical" && (
                    <li className="flex items-center gap-2">
                      <Ambulance className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Ambulance dispatched to your location</span>
                    </li>
                  )}
                  {selectedOption === "violence" && (
                    <>
                      <li className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Police dispatched to your location</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Video recording activated and saved to secure database</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <p className="text-white/60 mb-8">
                Stay in a safe location if possible. Emergency services will arrive shortly.
              </p>

              <Link href="/">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  Return to Home
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
