'use client'

import { GameState } from '@/lib/types'
import { useEffect, useState } from 'react'
import HabitCard from './habit-card'
import DailySummary from './daily-summary'
import { Card } from '@/components/ui/card'
import { gameStore } from '@/store/game-store'

interface HabitsListProps {
  gameState: GameState
}

export default function HabitsList({ gameState: initialGameState }: HabitsListProps) {
  const [gameState, setGameState] = useState(initialGameState)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showInCompleted, setShowInCompleted] = useState(true)

  // Subscribe to store changes and update local state
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      // Force update with fresh state copy
      const freshState = gameStore.getState()
      setGameState({
        ...freshState,
        habits: [...freshState.habits],
        completions: [...freshState.completions],
        streaks: new Map(freshState.streaks),
      })
    })
    return unsubscribe
  }, [])

  // Calculate completed habits based on current gameState
  const today = new Date().toDateString()
  const completedHabitIds = new Set(
    gameState.completions
      .filter(c => new Date(c.completedAt).toDateString() === today)
      .map(c => c.habitId)
  )

  const activeHabits = gameState.habits.filter(h => h.active)
  const incompleteHabits = activeHabits.filter(h => !completedHabitIds.has(h.id))
  const completedHabits = activeHabits.filter(h => completedHabitIds.has(h.id))

  return (
    <div className="space-y-4">
      {/* Daily Summary */}
      <DailySummary gameState={gameState} />

      {/* Incomplete Habits */}
      {incompleteHabits.length === 0 && completedHabits.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-text-muted mb-4">No habits yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <button
                onClick={() => setShowInCompleted(!showInCompleted)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-light/30 hover:bg-surface-light/50 text-text transition-colors"
              >
                <span className="font-semibold">Incompleted Habits ({incompleteHabits.length})</span>
                <span className={`transition-transform ${showInCompleted ? 'rotate-180' : ''}`}>▼</span>
              </button>
          
          {showInCompleted && incompleteHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={false}
              onComplete={() => {
                gameStore.completeHabit(habit.id)
              }}
              streak={gameState.streaks.get(habit.id)?.current || 0}
            />
          ))}

          {completedHabits.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-light/30 hover:bg-surface-light/50 text-text transition-colors"
              >
                <span className="font-semibold">Completed Habits ({completedHabits.length})</span>
                <span className={`transition-transform ${showCompleted ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showCompleted && (
                <div className="space-y-3 mt-3">
                  {completedHabits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={true}
                      onComplete={() => {
                        gameStore.uncompleteHabit(habit.id)
                      }}
                      streak={gameState.streaks.get(habit.id)?.current || 0}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
