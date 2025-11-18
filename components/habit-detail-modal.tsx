'use client'

import { Habit, HabitCompletion } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { gameStore } from '@/store/game-store'
import { useEffect, useState } from 'react'

interface HabitDetailModalProps {
  habit: Habit | null
  isOpen: boolean
  onClose: () => void
}

const AREA_ICONS: Record<string, string> = {
  health: '💪',
  work: '💼',
  relationships: '❤️',
  learning: '📚',
  finance: '💰',
  personal: '🌟',
}

export default function HabitDetailModal({ habit, isOpen, onClose }: HabitDetailModalProps) {
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (habit) {
      const state = gameStore.getState()
      const completions = state.completions || []
      
      const recentCompletions = completions
        .filter(c => c.habitId === habit.id)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 7)
      
      setHabitCompletions(recentCompletions)

      const today = new Date().toDateString()
      const completedToday = recentCompletions.some(
        c => new Date(c.completedAt).toDateString() === today
      )
      setIsCompleted(completedToday)
    }
  }, [habit])

  if (!isOpen || !habit) return null

  const state = gameStore.getState()
  const streak = state.streaks.get(habit.id)
  const today = new Date().toDateString()
  const todayCompletion = habitCompletions[0]?.completedAt && 
    new Date(habitCompletions[0].completedAt).toDateString() === today

  const handleComplete = () => {
    gameStore.completeHabit(habit.id)
    setIsCompleted(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-surface border-surface-light/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-light/50 backdrop-blur border-b border-surface-light/20 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-4xl">{AREA_ICONS[habit.area]}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text mb-2">{habit.name}</h2>
              <p className="text-text-muted">{habit.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-text-muted hover:text-text transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-light/20 rounded-lg p-4 text-center">
              <p className="text-xs text-text-muted mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-accent-gold">{streak?.current || 0}</p>
              <p className="text-xs text-text-muted">🔥</p>
            </div>
            <div className="bg-surface-light/20 rounded-lg p-4 text-center">
              <p className="text-xs text-text-muted mb-1">Longest Streak</p>
              <p className="text-3xl font-bold text-accent-gold">{streak?.longest || 0}</p>
              <p className="text-xs text-text-muted">🏆</p>
            </div>
            <div className="bg-surface-light/20 rounded-lg p-4 text-center">
              <p className="text-xs text-text-muted mb-1">XP Reward</p>
              <p className="text-3xl font-bold text-primary">{habit.xpReward}</p>
              <p className="text-xs text-text-muted">⭐</p>
            </div>
            <div className="bg-surface-light/20 rounded-lg p-4 text-center">
              <p className="text-xs text-text-muted mb-1">Coin Reward</p>
              <p className="text-3xl font-bold text-accent-gold">{habit.coinReward}</p>
              <p className="text-xs text-text-muted">💰</p>
            </div>
          </div>

          {/* Habit Details */}
          <div className="bg-surface-light/20 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Difficulty</span>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                habit.difficulty === 'easy' ? 'bg-accent-emerald/20 text-accent-emerald' :
                habit.difficulty === 'medium' ? 'bg-accent-gold/20 text-accent-gold' :
                'bg-accent-rose/20 text-accent-rose'
              }`}>
                {habit.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Frequency</span>
              <span className="text-sm font-semibold text-text">
                {habit.frequency === 'daily' ? 'Daily' : habit.frequency === 'weekly' ? 'Weekly' : 'Custom'}
              </span>
            </div>
            {habit.targetDays && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Target Days</span>
                <span className="text-sm font-semibold text-text">
                  {habit.targetDays.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Recent Completions */}
          <div>
            <h3 className="text-sm font-semibold text-text-muted mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {habitCompletions.length === 0 ? (
                <p className="text-sm text-text-muted py-4 text-center">No completions yet</p>
              ) : (
                habitCompletions.map((completion, idx) => {
                  const date = new Date(completion.completedAt)
                  const isToday = date.toDateString() === today
                  
                  return (
                    <div
                      key={completion.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isToday ? 'bg-primary/10 border border-primary/30' : 'bg-surface-light/20'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-text-muted">
                          +{completion.xpGained} XP, +{completion.coinGained} coins
                        </p>
                      </div>
                      {isToday && <span className="text-lg">✓</span>}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-surface-light/20">
            <button
              onClick={handleComplete}
              disabled={todayCompletion || isCompleted}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                todayCompletion || isCompleted
                  ? 'bg-primary/50 text-primary-light cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {todayCompletion || isCompleted ? '✓ Completed Today' : 'Mark as Complete'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold bg-surface-light hover:bg-surface-light/80 text-text transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
