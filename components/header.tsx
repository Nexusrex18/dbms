"use client"

import Link from "next/link"
import { Shield, LogIn, UserPlus } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { user } = useAuth();
  
  // Manually test to ensure the user object shows properly even if coming from localStorage
  console.log("Current user in Header:", user);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-lg tracking-tight">
            Safe<span className="text-orange-500">Nest</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/emergency" className="text-sm text-white/70 hover:text-white">
                Emergency
              </Link>
              <Link href="/classes" className="text-sm text-white/70 hover:text-white">
                Classes
              </Link>
              <Link href="/community" className="text-sm text-white/70 hover:text-white">
                Community
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
