'use client'

import { GameState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { gameStore } from '@/store/game-store'

interface SpendingHistoryProps {
  gameState: GameState
}

type SortField = 'name' | 'date' | 'amount'
type SortDirection = 'asc' | 'desc'

export default function SpendingHistory({ gameState: initialGameState }: SpendingHistoryProps) {
  const [update, setUpdate] = useState(0)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      console.log('[v0] SpendingHistory update counter incremented')
      setUpdate(prev => prev + 1)
    })
    return unsubscribe
  }, [])

  const gameState = gameStore.getState()
  console.log('[v0] SpendingHistory render - spending entries:', gameState?.spendingHistory?.length || 0, 'update:', update)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedSpending = [...(gameState?.spendingHistory || [])].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.rewardName.localeCompare(b.rewardName)
        break
      case 'amount':
        comparison = a.costCoins - b.costCoins
        break
      case 'date':
      default:
        comparison = new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime()
    }

    return sortDirection === 'asc' ? comparison : -comparison
  }).slice(0, 5)

  if (!gameState?.spendingHistory || gameState.spendingHistory.length === 0) {
    return null
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-4">
      <h3 className="font-bold text-text mb-4">Rewards Spent</h3>

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleSort('name')}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            sortField === 'name'
              ? 'bg-primary text-white'
              : 'bg-surface-light/30 text-text-muted hover:bg-surface-light/50'
          }`}
        >
          Name{getSortIndicator('name')}
        </button>
        <button
          onClick={() => handleSort('amount')}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            sortField === 'amount'
              ? 'bg-primary text-white'
              : 'bg-surface-light/30 text-text-muted hover:bg-surface-light/50'
          }`}
        >
          Amount{getSortIndicator('amount')}
        </button>
        <button
          onClick={() => handleSort('date')}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            sortField === 'date'
              ? 'bg-primary text-white'
              : 'bg-surface-light/30 text-text-muted hover:bg-surface-light/50'
          }`}
        >
          Date{getSortIndicator('date')}
        </button>
      </div>

      {/* Spending List */}
      <div className="space-y-2">
        {sortedSpending.map(spending => (
          <div key={spending.id} className="flex items-center justify-between p-2 bg-surface-light/20 rounded">
            <div className="flex items-center gap-2">
              <span className="text-lg">{spending.rewardIcon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">{spending.rewardName}</p>
                <p className="text-xs text-text-muted">
                  {new Date(spending.purchasedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-accent-rose">-{spending.costCoins} 💰</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
