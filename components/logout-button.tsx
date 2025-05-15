"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export default function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Logging out...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </div>
      )}
    </Button>
  )
}
