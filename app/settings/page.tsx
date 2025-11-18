'use client'

import { useState } from 'react'
import PlayerProfile from '@/components/player-profile'
import PlayerSettings from '@/components/player-settings'
import HabitManager from '@/components/habit-manager'
import RewardsManager from '@/components/rewards-manager'
import { useGameStore, gameStore } from '@/store/game-store'
import { storage } from '@/lib/storage'
import { generateSeedData } from '@/lib/seed-data'
import Link from 'next/link'

export default function SettingsPage() {
  const gameState = useGameStore()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleLoadTestData = () => {
    const seedData = generateSeedData()
    
    storage.set('gamestate', {
      player: seedData.player,
      habits: seedData.habits,
      completions: seedData.completions,
      xpHistory: seedData.xpHistory,
      streaks: seedData.streaks,
      rewards: seedData.rewards,
      priorities: [],
    })
    
    // Reload the page to see changes
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-surface-light/20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Settings & Management</h1>
          <Link href="/" className="text-primary hover:text-primary-light transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PlayerProfile gameState={gameState} />
            </div>

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Test Data Section */}
          <div className="bg-surface rounded-lg p-6 border border-surface-light/20">
            <h2 className="text-lg font-semibold text-text mb-4">Test Data</h2>
            <p className="text-text/70 mb-4">Load realistic test data to test the app with multiple habits, completions, and streaks.</p>
            <button
              onClick={handleLoadTestData}
              className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Load Test Data
            </button>
          </div>
            <div className="lg:col-span-2">
              <PlayerSettings  />
            </div>
          </div>

          {/* Habits Management */}
          <div>
            <HabitManager key={`habits-${refreshKey}`} gameState={gameState} onUpdate={handleUpdate} />
          </div>

          {/* Rewards Management */}
          <div>
            <RewardsManager key={`rewards-${refreshKey}`} gameState={gameState} onUpdate={handleUpdate} />
          </div>

        </div>
      </main>
    </div>
  )
}
