'use client'

import { useState } from 'react'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeArea, FrequencyType, MonthlyFrequency, AnnualFrequency, DifficultyLevel, Habit } from '@/lib/types'

interface HabitFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editingHabit?: Habit
}

const LIFE_AREAS: { id: LifeArea; label: string; icon: string }[] = [
  { id: 'health', label: 'Health', icon: '💪' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '❤️' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'personal', label: 'Personal', icon: '🌟' },
]

export default function HabitForm({ onSuccess, onCancel, editingHabit }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: editingHabit?.name || '',
    description: editingHabit?.description || '',
    area: (editingHabit?.area || 'health') as LifeArea,
    frequency: (editingHabit?.frequency || 'daily') as FrequencyType,
    monthlyFrequency: (editingHabit?.monthlyFrequency || 'every-week') as MonthlyFrequency,
    annualFrequency: (editingHabit?.annualFrequency || 'every-month') as AnnualFrequency,
    difficulty: (editingHabit?.difficulty || 'medium') as DifficultyLevel,
    targetDays: editingHabit?.targetDays || ['Mon', 'Wed', 'Fri'],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Habit name is required'
    if (formData.name.length > 100) newErrors.name = 'Name must be under 100 characters'
    if (formData.description.length > 500) newErrors.description = 'Description must be under 500 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (editingHabit) {
      gameStore.updateHabit(editingHabit.id, {
        name: formData.name,
        description: formData.description,
        area: formData.area,
        frequency: formData.frequency,
        monthlyFrequency: formData.frequency === 'monthly' ? formData.monthlyFrequency : undefined,
        annualFrequency: formData.frequency === 'annual' ? formData.annualFrequency : undefined,
        difficulty: formData.difficulty,
        targetDays: formData.frequency === 'weekly' ? formData.targetDays : undefined,
      })
    } else {
      gameStore.addHabit({
        name: formData.name,
        description: formData.description,
        area: formData.area,
        frequency: formData.frequency,
        monthlyFrequency: formData.frequency === 'monthly' ? formData.monthlyFrequency : undefined,
        annualFrequency: formData.frequency === 'annual' ? formData.annualFrequency : undefined,
        xpReward: 0,
        coinReward: 0,
        difficulty: formData.difficulty,
        active: true,
        targetDays: formData.frequency === 'weekly' ? formData.targetDays : undefined,
      })
    }

    setFormData({
      name: '',
      description: '',
      area: 'health',
      frequency: 'daily',
      monthlyFrequency: 'every-week',
      annualFrequency: 'every-month',
      difficulty: 'medium',
      targetDays: ['Mon', 'Wed', 'Fri'],
    })
    setErrors({})
    onSuccess?.()
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      targetDays: prev.targetDays.includes(day)
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day]
    }))
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const difficulties: DifficultyLevel[] = ['easy', 'easy-medium', 'medium', 'medium-hard', 'hard']
  
  const frequencies: FrequencyType[] = ['daily', 'weekly', 'biweekly', 'monthly', 'annual']

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <h3 className="text-xl font-semibold text-text mb-4">
        {editingHabit ? 'Edit Habit' : 'Create New Habit'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit Name */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning Run"
            className="w-full bg-surface-light/30 border border-surface-light/30 rounded px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary"
          />
          {errors.name && <p className="text-xs text-accent-rose mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What's the purpose of this habit?"
            rows={3}
            className="w-full bg-surface-light/30 border border-surface-light/30 rounded px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Life Area */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Life Area
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LIFE_AREAS.map(area => (
              <button
                key={area.id}
                type="button"
                onClick={() => setFormData({ ...formData, area: area.id })}
                className={`p-3 rounded text-center transition-colors ${
                  formData.area === area.id
                    ? 'bg-primary/30 border-2 border-primary'
                    : 'bg-surface-light/20 border-2 border-transparent hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{area.icon}</div>
                <div className="text-xs font-medium">{area.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {frequencies.map(freq => (
              <button
                key={freq}
                type="button"
                onClick={() => setFormData({ ...formData, frequency: freq })}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  formData.frequency === freq
                    ? 'bg-primary text-white'
                    : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
                }`}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Target Days (for weekly) */}
        {formData.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Target Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`p-2 rounded text-xs font-semibold transition-colors ${
                    formData.targetDays.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Frequency Options */}
        {formData.frequency === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Monthly Pattern
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['every-week', 'every-15-days', 'first-day', 'last-day'] as const).map(pattern => (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => setFormData({ ...formData, monthlyFrequency: pattern })}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    formData.monthlyFrequency === pattern
                      ? 'bg-primary text-white'
                      : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
                  }`}
                >
                  {pattern.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Annual Frequency Options */}
        {formData.frequency === 'annual' && (
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Annual Pattern
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['every-month', 'every-3-months', 'every-6-months', 'every-12-months'] as const).map(pattern => (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => setFormData({ ...formData, annualFrequency: pattern })}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    formData.annualFrequency === pattern
                      ? 'bg-primary text-white'
                      : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
                  }`}
                >
                  {pattern.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map(diff => (
              <button
                key={diff}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty: diff })}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  formData.difficulty === diff
                    ? 'bg-primary text-white'
                    : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
                }`}
              >
                {diff.replace('-', ' ')}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2">
            Higher difficulty = more XP and coins
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
          >
            {editingHabit ? 'Update Habit' : 'Create Habit'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-surface-light hover:bg-surface-light/80 text-text"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
