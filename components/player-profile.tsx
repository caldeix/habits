'use client'

import { useEffect, useState } from 'react'
import { GameState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLevelFromXp, getProgressToNextLevel } from '@/lib/xp-calculator'
import { gameStore } from '@/store/game-store'

interface PlayerProfileProps {
  gameState: GameState
}

export default function PlayerProfile({ gameState: initialGameState }: PlayerProfileProps) {
  const [update, setUpdate] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(initialGameState?.player?.name || '')

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      console.log('[v0] PlayerProfile update counter incremented')
      setUpdate(prev => prev + 1)
    })
    return unsubscribe
  }, [])

  const gameState = gameStore.getState()
  console.log('[v0] PlayerProfile render - coins:', gameState?.player?.coins, 'update:', update)

  if (!gameState?.player) {
    return null
  }

  const progress = getProgressToNextLevel(gameState.player.totalXp)
  const levelData = getLevelFromXp(gameState.player.totalXp)

  const handleSaveName = () => {
    if (newName.trim()) {
      gameStore.setPlayerName(newName)
      setIsEditing(false)
    }
  }

  const avatars = ['🎮', '⚔️', '🛡️', '🌟', '💎', '🔥', '🎯', '👑']

  return (
    <Card className="bg-surface border-surface-light/30 p-6 lg:col-span-3">
      <div className="">
        <div className="flex gap-4">
          {/* Avatar Selector */}
          <div className="relative group">
            <button
              className="text-5xl hover:scale-110 transition-transform duration-200"
              title="Click to change avatar"
            >
              {gameState.player.avatar}
            </button>
           <div className="absolute bottom-full left-0 mb-2 bg-surface-light rounded-lg p-3 hidden group-hover:grid grid-cols-4 gap-3 z-10 w-[25vh]">
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => gameStore.setPlayerAvatar(avatar)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-surface border border-surface-light/30 rounded px-2 py-1 text-text placeholder-text-muted focus:outline-none focus:border-primary"
                  placeholder="Player name"
                />
                <Button
                  onClick={handleSaveName}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 text-sm"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <h2 className="text-2xl font-bold text-text">{gameState.player.name}</h2>
              </div>
            )}

            {/* Level and XP */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-muted">Level {levelData.level}</span>
                <div className="flex-1 bg-surface-light/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-accent-emerald h-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {progress.current}/{progress.total} XP
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-surface-light/20 rounded px-3 py-2">
                <div className="text-xs text-text-muted">Total XP</div>
                <div className="text-lg font-semibold text-accent-gold">{gameState.player.totalXp.toLocaleString()}</div>
              </div>
              <div className="bg-surface-light/20 rounded px-3 py-2">
                <div className="text-xs text-text-muted">Coins</div>
                <div className="text-lg font-semibold text-accent-gold flex items-center gap-1">
                  {gameState.player.coins.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
