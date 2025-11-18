'use client'

import { useState, useEffect } from 'react'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'

export default function CoinsDisplay() {
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setUpdate(prev => prev + 1)
    })

    return () => unsubscribe()
  }, [])

  const gameState = gameStore.getState()
  const coins = gameState.player.coins

  return (
    <Card className="p-4 border-none shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-accent-gold">{coins.toLocaleString()}</p>
        </div>
        <div className="text-3xl">💰</div>
      </div>
    </Card>
  )
}
