'use client'

import { useState, useEffect } from 'react'
import { GameState } from '@/lib/types'
import { getLevelFromXp, getProgressToNextLevel } from '@/lib/xp-calculator'
import { Card } from '@/components/ui/card'
import { gameStore } from '@/store/game-store'


export default function XpProgress() {
  const [update, setUpdate] = useState(0)
  
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setUpdate(prev => prev + 1)
    })
    return unsubscribe
  }, [])

  const gameState = gameStore.getState()
  const totalXp = gameState.player.totalXp
  const level = gameState.player.level
  const progress = getProgressToNextLevel(totalXp)

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <div className="space-y-3">
        {/* Level Display */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Current Level</p>
            <p className="text-4xl font-bold text-primary">{level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted mb-1">Total XP</p>
            <p className="text-2xl font-bold text-accent-gold">{totalXp.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">Progress to Level {level + 1}</span>
            <span className="text-xs font-semibold text-accent-gold">
              {progress.current}/{progress.total}
            </span>
          </div>
          <div className="w-full bg-surface-light/30 rounded-full h-3 overflow-hidden border border-surface-light/20">
            <div
              className="bg-gradient-to-r from-primary via-accent-emerald to-accent-gold h-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
