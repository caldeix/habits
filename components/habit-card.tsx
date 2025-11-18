'use client'

import React, { useState, useEffect } from 'react'
import { gameStore } from '@/store/game-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Habit } from '@/lib/types'

interface HabitCardProps {
  habit: Habit
  isCompleted: boolean
  onComplete: () => void
  streak?: number
}

export default function HabitCard({ habit, isCompleted: initialIsCompleted, onComplete, streak = 0 }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      const completion = gameStore.getCompletionToday(habit.id)
      setIsCompleted(!!completion)
      setUpdate(prev => prev + 1)
    })
    return unsubscribe
  }, [habit.id])

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      if (isCompleted) {
        gameStore.uncompleteHabit(habit.id)
      } else {
        onComplete()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const habitStreak = gameStore.getStreak(habit.id)?.current || 0

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500',
    'easy-medium': 'bg-blue-500',
    medium: 'bg-yellow-500',
    'medium-hard': 'bg-orange-500',
    hard: 'bg-red-500',
  }

  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
    annual: 'Annual',
  }

  const xpRewards: Record<string, number> = {
    easy: 40,
    'easy-medium': 60,
    medium: 100,
    'medium-hard': 140,
    hard: 200,
  }

  const xpForToday = xpRewards[habit.difficulty] || 100
  const streakBonus = habitStreak > 0 ? Math.min(1 + habitStreak * 0.1, 2.0) : 1.0
  const totalXp = Math.round(xpForToday * streakBonus)
  const bonusPercent = Math.round((streakBonus - 1) * 100)

  return (
    <Card className="p-4 bg-slate-900 border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-slate-400 mt-1">{habit.description}</p>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className={`${difficultyColors[habit.difficulty]} text-white border-0`}>
              {habit.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-slate-700 text-slate-200 border-0">
              {frequencyLabels[habit.frequency]}
            </Badge>
          </div>

          {isCompleted && (
            <div className="mt-2 text-sm text-emerald-400 font-medium">
              ✓ Completed • +{totalXp} XP {bonusPercent > 0 && `(+${bonusPercent}%)`}
            </div>
          )}
        </div>

        <Button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`whitespace-nowrap ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
        >
          {isCompleted ? '✓ Completed' : 'Complete'}
        </Button>
      </div>
    </Card>
  )
}
