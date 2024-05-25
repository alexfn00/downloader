'use client'
import React, { useState } from 'react'
import Demo from './Demo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App = () => {
  const [showDemo, setShowDemo] = useState(true)
  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setShowDemo(!showDemo)}>Toggle Demo</button>
      {showDemo && <Demo />}
    </QueryClientProvider>
  )
}

export default App
