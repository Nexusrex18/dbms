// Component to display backend connection status and help start it if needed
"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isAPIAvailable } from "@/lib/community-helpers"

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [showHelp, setShowHelp] = useState(false)
  
  const checkStatus = async () => {
    setStatus('checking')
    const isConnected = await isAPIAvailable()
    setStatus(isConnected ? 'connected' : 'disconnected')
  }
  
  useEffect(() => {
    checkStatus()
  }, [])
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Backend Status
        </h3>
        <p className="text-sm text-muted-foreground">
          Check the connection to the Flask backend API
        </p>
      </div>
      
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2 mb-4">
          {status === 'checking' ? (
            <>
              <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
              <span>Checking connection...</span>
            </>
          ) : status === 'connected' ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-500 font-medium">Connected to backend</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-500 font-medium">Not connected to backend</span>
            </>
          )}
        </div>
        
        {status === 'disconnected' && (
          <div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="mb-3"
            >
              {showHelp ? "Hide Help" : "Show Help"}
            </Button>
            
            {showHelp && (
              <div className="bg-slate-900 text-white p-3 rounded-md text-sm font-mono mb-3 overflow-x-auto">
                <p className="mb-2">Run these commands in your terminal:</p>
                <pre className="whitespace-pre-wrap">
                  # Go to the project directory<br/>
                  cd ~/Downloads/care-alert<br/><br/>
                  # Start the backend server<br/>
                  ./backend-helper.sh start
                </pre>
              </div>
            )}
            
            <Button onClick={checkStatus} size="sm">Recheck Connection</Button>
          </div>
        )}
      </div>
    </div>
  )
}
