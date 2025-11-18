'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { GameState } from '@/lib/types'

interface XpTrendChartProps {
  gameState: GameState
  days?: number
}

export default function XpTrendChart({ gameState, days = 30 }: XpTrendChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const data: { date: string; xp: number; dayOfWeek: string }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const dayXp = gameState.xpHistory
        .filter(xp => {
          const xpDate = new Date(xp.timestamp)
          return xpDate.toDateString() === date.toDateString()
        })
        .reduce((sum, xp) => sum + xp.amount, 0)

      data.push({
        date: dateStr,
        xp: dayXp,
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      })
    }

    return data
  }, [gameState.xpHistory, days])

  const maxXp = Math.max(...chartData.map(d => d.xp), 1)
  const totalXp = chartData.reduce((sum, d) => sum + d.xp, 0)
  const avgXp = Math.round(totalXp / days)

  // Group by week to show weekly totals
  const weeklyData = useMemo(() => {
    const weeks: { week: string; xp: number }[] = []
    let currentWeek = ''
    let weekXp = 0

    chartData.forEach((day, index) => {
      const weekStart = Math.floor((days - 1 - index) / 7)
      const week = `Week ${Math.ceil((index + 1) / 7)}`

      if (week !== currentWeek && weekXp > 0) {
        weeks.push({ week: currentWeek, xp: weekXp })
        weekXp = 0
      }

      currentWeek = week
      weekXp += day.xp
    })

    if (weekXp > 0) {
      weeks.push({ week: currentWeek, xp: weekXp })
    }

    return weeks
  }, [chartData, days])

  if (totalXp === 0) {
    return null
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-text mb-2">XP Trend</h3>
          <p className="text-sm text-text-muted">Last {days} days</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-light/20 p-3 rounded">
            <p className="text-xs text-text-muted mb-1">Total XP</p>
            <p className="text-lg font-bold text-primary">{totalXp}</p>
          </div>
          <div className="bg-surface-light/20 p-3 rounded">
            <p className="text-xs text-text-muted mb-1">Average/Day</p>
            <p className="text-lg font-bold text-primary">{avgXp}</p>
          </div>
          <div className="bg-surface-light/20 p-3 rounded">
            <p className="text-xs text-text-muted mb-1">Peak Day</p>
            <p className="text-lg font-bold text-primary">{Math.max(...chartData.map(d => d.xp))}</p>
          </div>
        </div>

        {/* Daily Chart */}
        <div>
          <p className="text-sm font-medium text-text mb-3">Daily XP</p>
          <div className="space-y-2">
            {chartData.map((day, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-12">{day.date}</span>
                <div className="flex-1 h-6 bg-surface-light/20 rounded overflow-hidden">
                  {day.xp > 0 && (
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light transition-all"
                      style={{ width: `${(day.xp / maxXp) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-xs font-semibold text-primary w-10 text-right">{day.xp > 0 ? day.xp : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div>
          <p className="text-sm font-medium text-text mb-3">Weekly Summary</p>
          <div className="grid grid-cols-2 gap-2">
            {weeklyData.map((week, idx) => (
              <div key={idx} className="bg-surface-light/20 p-3 rounded text-center">
                <p className="text-xs text-text-muted mb-1">{week.week}</p>
                <p className="text-lg font-bold text-primary">{week.xp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Breakdown */}
        <div>
          <p className="text-sm font-medium text-text mb-3">Top Habits by XP</p>
          <div className="space-y-2">
            {Object.entries(
              gameState.xpHistory.reduce((acc, xp) => {
                const habit = gameState.habits.find(h => h.id === xp.habitId)
                if (!habit) return acc
                acc[habit.name] = (acc[habit.name] || 0) + xp.amount
                return acc
              }, {} as Record<string, number>)
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([habitName, xp]) => (
                <div key={habitName} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{habitName}</span>
                  <span className="text-sm font-semibold text-primary">{xp} XP</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
