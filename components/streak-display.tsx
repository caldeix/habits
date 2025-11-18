'use client'

import { useState, useEffect } from 'react'
import { GameState } from '@/lib/types'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'

interface StreakDisplayProps {
  gameState: GameState
}

export default function StreakDisplay({ gameState: initialGameState }: StreakDisplayProps) {
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setUpdate(prev => prev + 1)
    })
    return unsubscribe
  }, [])

  const gameState = gameStore.getState()
  const streaks = Array.from(gameState.streaks.values())
    .map(streak => ({
      ...streak,
      habitName: gameState.habits.find(h => h.id === streak.habitId)?.name || 'Unknown'
    }))
    .filter(s => s.current > 0 || s.longest > 0)
    .sort((a, b) => b.current - a.current)
    .slice(0, 5)

  if (streaks.length === 0) {
    return null
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <h3 className="text-lg font-semibold text-text mb-4">Your Streaks</h3>
      <div className="space-y-3">
        {streaks.map(streak => (
          <div key={streak.habitId} className="flex items-center justify-between p-3 bg-surface-light/20 rounded-lg">
            <div className="flex-1">
              <p className="font-semibold text-text">{streak.habitName}</p>
              <p className="text-xs text-text-muted">
                Longest: {streak.longest} days
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg text-accent-gold">{streak.current}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
