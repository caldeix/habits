'use client'

import { GameState } from '@/lib/types'
import { Card } from '@/components/ui/card'

interface DailySummaryProps {
  gameState: GameState
}

export default function DailySummary({ gameState }: DailySummaryProps) {
  const today = new Date()
  const todayString = today.toDateString()
  
  // Get all completions from today
  const completionsToday = gameState.completions.filter(
    c => new Date(c.completedAt).toDateString() === todayString
  )

  const completedToday = new Set(completionsToday.map(c => c.habitId)).size

  const scheduledToday = gameState.habits.filter(habit => {
    if (habit.frequency === 'daily') return true
    
    if (habit.frequency === 'biweekly') {
      const createdDate = new Date(habit.createdAt)
      const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff % 14 === 0
    }
    
    if (habit.frequency === 'weekly') {
      const dayOfWeek = today.getDay()
      return habit.weekDays?.includes(dayOfWeek) || false
    }
    
    if (habit.frequency === 'monthly-weekly') return true // Every week of the month
    if (habit.frequency === 'monthly-15days') return true // Every 15 days
    if (habit.frequency === 'monthly-first') return today.getDate() === 1
    if (habit.frequency === 'monthly-last') {
      const nextDay = new Date(today)
      nextDay.setDate(nextDay.getDate() + 1)
      return nextDay.getMonth() !== today.getMonth()
    }
    
    if (habit.frequency === 'annual-month') return true
    if (habit.frequency === 'annual-3months') return true
    if (habit.frequency === 'annual-6months') return true
    if (habit.frequency === 'annual-12months') return true
    
    return false
  }).length

  const totalXp = completionsToday.reduce((sum, c) => sum + c.xpGained, 0)
  const totalCoins = completionsToday.reduce((sum, c) => sum + c.coinGained, 0)

  const completionRate = scheduledToday > 0 ? Math.round((completedToday / scheduledToday) * 100) : 0

  const motivationalMessages = [
    'Keep the momentum going!',
    'You\'re doing great!',
    'Stay consistent!',
    'Every habit counts!',
    'You\'re building a better you!',
  ]

  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-accent-emerald/20 border-primary/30 p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text mb-1">Today's Progress</h3>
            <p className="text-sm text-text-muted">{message}</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-light/30 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">
              {completedToday}
            </p>
            <p className="text-xs text-text-muted">Habits Completed</p>
          </div>
          <div className="bg-surface-light/30 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent-gold">
              {completionRate}%
            </p>
            <p className="text-xs text-text-muted">Completion Rate</p>
          </div>
          <div className="bg-surface-light/30 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">+{totalXp}</p>
            <p className="text-xs text-text-muted">XP Today</p>
          </div>
          <div className="bg-surface-light/30 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent-gold">+{totalCoins}</p>
            <p className="text-xs text-text-muted">Coins Today</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-surface-light/30 rounded-full h-3 overflow-hidden border border-surface-light/20">
            <div
              className="bg-gradient-to-r from-primary to-accent-emerald h-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
