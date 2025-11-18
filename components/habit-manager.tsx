'use client'

import { useState } from 'react'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameState } from '@/lib/types'
import HabitForm from '@/components/habit-form' // Assuming HabitForm is imported from this path

interface HabitManagerProps {
  gameState: GameState
  onUpdate?: () => void
}

export default function HabitManager({ gameState, onUpdate }: HabitManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'area'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const difficultyColors: Record<string, string> = {
    'easy': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'easy-medium': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'medium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'medium-hard': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'hard': 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  const areaIcons: Record<string, string> = {
    'health': '💪',
    'work': '💼',
    'relationships': '❤️',
    'learning': '📚',
    'finance': '💰',
    'personal': '🎯',
  }

  const frequencyLabels: Record<string, string> = {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'biweekly': 'Biweekly',
    'every-week': 'Every Week',
    'every-15-days': 'Every 15 Days',
    'first-day': 'First Day',
    'last-day': 'Last Day',
    'every-month': 'Every Month',
    'every-3-months': 'Every 3 Months',
    'every-6-months': 'Every 6 Months',
    'every-12-months': 'Every 12 Months',
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      gameStore.deleteHabit(id)
      onUpdate?.()
    }
  }

  const sortedHabits = [...gameState.habits].sort((a, b) => {
    let result = 0
    if (sortBy === 'name') result = a.name.localeCompare(b.name)
    if (sortBy === 'created') result = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'area') result = a.area.localeCompare(b.area)
    return sortDir === 'asc' ? result : -result
  })

  const getFrequencyLabel = (habit: any) => {
    if (habit.frequency === 'monthly') return frequencyLabels[habit.monthlyFrequency || 'every-week']
    if (habit.frequency === 'annual') return frequencyLabels[habit.annualFrequency || 'every-month']
    return frequencyLabels[habit.frequency] || habit.frequency
  }

  const editingHabit = editingId ? gameState.habits.find(h => h.id === editingId) : null

  return (
    <>
      <Card className="bg-surface border-surface-light/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text">Manage Habits</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (sortBy === 'name') {
                  setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('name')
                  setSortDir('asc')
                }
              }}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                sortBy === 'name'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light/30 hover:bg-surface-light/50 text-text'
              }`}
            >
              Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'created') {
                  setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('created')
                  setSortDir('asc')
                }
              }}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                sortBy === 'created'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light/30 hover:bg-surface-light/50 text-text'
              }`}
            >
              Created {sortBy === 'created' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'area') {
                  setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('area')
                  setSortDir('asc')
                }
              }}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                sortBy === 'area'
                  ? 'bg-primary text-white'
                  : 'bg-surface-light/30 hover:bg-surface-light/50 text-text'
              }`}
            >
              Area {sortBy === 'area' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedHabits.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">No habits yet</p>
          ) : (
            sortedHabits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between bg-surface-light/20 p-4 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-text mb-2">{habit.name}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium border border-primary/30">
                      <span>{areaIcons[habit.area]}</span>
                      <span className="capitalize">{habit.area}</span>
                    </span>

                    <span className="inline-flex items-center px-2 py-1 bg-surface-light/40 text-text-muted rounded text-xs font-medium border border-surface-light/50">
                      {getFrequencyLabel(habit)}
                    </span>

                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${difficultyColors[habit.difficulty]}`}>
                      <span className="capitalize">{habit.difficulty}</span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(habit.id)}
                    className="px-3 py-1 bg-surface-light/30 hover:bg-surface-light/50 text-text text-sm rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="px-3 py-1 bg-accent-rose/20 hover:bg-accent-rose/30 text-accent-rose text-sm rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <HabitForm
              editingHabit={editingHabit}
              onSuccess={() => {
                setEditingId(null)
                onUpdate?.()
              }}
              onCancel={() => setEditingId(null)}
            />
          </div>
        </div>
      )}
    </>
  )
}
