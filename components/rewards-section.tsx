'use client'

import { useState, useEffect } from 'react'
import { GameState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { gameStore } from '@/store/game-store'

interface RewardsSectionProps {
  gameState: GameState
}

export default function RewardsSection({ gameState: initialGameState }: RewardsSectionProps) {
  const [gameState, setGameState] = useState<GameState>(
    initialGameState || {
      player: { name: 'Player', level: 1, coins: 0, xp: 0 },
      habits: [],
      rewards: [],
      completions: new Map(),
      xpHistory: [],
      spendingHistory: [],
      streaks: new Map(),
    }
  )
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState())
    })
    return unsubscribe
  }, [])

  const coins = gameState?.player?.coins ?? 0
  
  const visibleRewards = gameState?.rewards && Array.isArray(gameState.rewards) 
    ? gameState.rewards.filter(r => r.visibleInStore === true) 
    : [] 

  console.log('[v0] Visible rewards:', visibleRewards);

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (coins >= cost && !claimedRewards.has(rewardId)) {
      gameStore.purchaseReward(rewardId)
      setClaimedRewards(prev => new Set([...prev, rewardId]))
      
      // Reset after 3 seconds for demo purposes
      setTimeout(() => {
        setClaimedRewards(prev => {
          const next = new Set(prev)
          next.delete(rewardId)
          return next
        })
      }, 3000)
    }
  }

  if (!visibleRewards || visibleRewards.length === 0) {
    return null
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <h3 className="text-lg font-semibold text-text mb-4">Rewards Store</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {visibleRewards.map(reward => {
          const canAfford = coins >= reward.cost
          const isClaimed = claimedRewards.has(reward.id)

          return (
            <div
              key={reward.id}
              className={`p-3 rounded-lg border transition-all ${
                canAfford
                  ? 'bg-surface-light/30 border-surface-light/30 hover:border-primary/50'
                  : 'bg-surface-light/10 border-surface-light/10 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{reward.icon || '⭐'}</div>
              <p className="text-sm font-semibold text-text mb-2 line-clamp-1">{reward.name}</p>
              <p className="text-xs text-accent-gold font-bold mb-3">{reward.cost} coins</p>
              <Button
                onClick={() => handleClaimReward(reward.id, reward.cost)}
                disabled={!canAfford || isClaimed}
                className={`w-full text-xs py-1 transition-all ${
                  isClaimed
                    ? 'bg-primary/50 text-primary-light'
                    : canAfford
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'bg-surface-light/20 text-text-muted cursor-not-allowed'
                }`}
              >
                {isClaimed ? '✓ Claimed!' : 'Claim'}
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
