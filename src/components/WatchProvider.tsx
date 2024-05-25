'use client'
import React, { useState } from 'react'

interface WatchContext {
  watchId: string
  UpdateWatchId: (value: string) => void
}

const WatchContext = React.createContext<WatchContext | undefined>(undefined)

interface WatchProviderProps {
  children: React.ReactNode
}

export function useWatch() {
  const context = React.useContext(WatchContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within a WatchProvider')
  }
  return context
}

const WatchProvider = ({ children }: WatchProviderProps) => {
  const [watchId, setWatchId] = useState('')

  const UpdateWatchId = (value: string) => {
    console.log('UpdateWatchId:', value)
    setWatchId(value)
  }

  return (
    <WatchContext.Provider value={{ watchId, UpdateWatchId }}>
      {children}
    </WatchContext.Provider>
  )
}

export default WatchProvider
