"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Ambulance, Shield, MapPin, Video, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { alertService } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import Header from "@/components/header"

interface AlertHistory {
  id: number
  type: string
  status: string
  created_at: string
  location?: { lat: number; lng: number }
}

export default function EmergencyPage() {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isHelpSent, setIsHelpSent] = useState(false)
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([])
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [alertId, setAlertId] = useState<number | null>(null)

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.error("Error getting location:", err)
          setError("Unable to access your location. Please enable location services.")
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
    
    // Fetch alert history
    if (user) {
      fetchAlertHistory()
    }
  }, [user])

  const fetchAlertHistory = async () => {
    try {
      const response = await alertService.getAlertHistory()
      setAlertHistory(response.data)
    } catch (err) {
      console.error("Failed to fetch alert history:", err)
    }
  }

  const handleEmergencySelection = async (type: string) => {
    if (!currentLocation) {
      setError("Unable to determine your location. Please enable location services and try again.")
      return
    }
    
    setSelectedOption(type)
    setIsProcessing(true)
    setError(null)

    try {
      // Send SOS alert to backend
      const alertData = {
        type: type,
        location: currentLocation,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} emergency reported`
      }

      const response = await alertService.createSOS(alertData)
      setAlertId(response.data.id)
      
      // Show success after a brief delay to simulate processing
      setTimeout(() => {
        setIsProcessing(false)
        setIsHelpSent(true)
      }, 3000)
      
      // Refresh alert history in the background
      fetchAlertHistory()
    } catch (err) {
      console.error("Failed to send emergency alert:", err)
      setError("Failed to send emergency alert. Please try again or call emergency services directly.")
      setIsProcessing(false)
    }
  }

  const handleCancelAlert = async () => {
    if (alertId) {
      try {
        await alertService.cancelAlert(alertId)
        setIsHelpSent(false)
        setSelectedOption(null)
        setAlertId(null)
        
        // Refresh alert history
        fetchAlertHistory()
      } catch (err) {
        console.error("Failed to cancel alert:", err)
        setError("Failed to cancel the alert. Please contact emergency services if this was sent in error.")
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <Header />
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black pointer-events-none"
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
        <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-8">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-4 mx-auto max-w-2xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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

                {alertHistory.length > 0 && (
                  <div className="mt-12 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <h3 className="font-bold mb-4">Recent Alert History</h3>
                    <div className="space-y-2">
                      {alertHistory.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${alert.status === 'resolved' ? 'bg-green-500' : alert.status === 'cancelled' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="capitalize">{alert.type} Alert</span>
                          </div>
                          <span className="text-sm text-white/60">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleCancelAlert} 
                    variant="outline" 
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    Cancel Alert
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="border-white/20 hover:bg-white/5">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
