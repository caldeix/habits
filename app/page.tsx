'use client'

import { useEffect, useState } from 'react'
import { gameStore } from '@/store/game-store'
import Dashboard from '@/components/dashboard'

export default function Home() {
  const [gameState, setGameState] = useState(gameStore.getState())

  useEffect(() => {
    gameStore.loadGame()
  }, [])

  useEffect(() => {
    setGameState(gameStore.getState())
    
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState())
    })
    return unsubscribe
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Dashboard gameState={gameState} />
    </main>
  )
}
