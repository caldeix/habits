'use client'

import { useEffect, useState } from 'react'
import { gameStore } from '@/store/game-store'
import PlayerProfile from '@/components/player-profile'
import XpProgress from '@/components/xp-progress'
import CoinsDisplay from '@/components/coins-display'
import StreakDisplay from '@/components/streak-display'
import RewardsSection from '@/components/rewards-section'
import HabitsList from '@/components/habits-list'
import HabitForm from '@/components/habit-form'
import SpendingHistory from '@/components/spending-history'
import XpTrendChart from '@/components/xp-trend-chart'
import Link from 'next/link'

export default function Dashboard() {
  const [playerName, setPlayerName] = useState('Hasbit Idle')
  const [gameState, setGameState] = useState(gameStore.getState())
  const [showForm, setShowForm] = useState(false)

  const handleExport = () => {
    const data = { ...localStorage };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `habit-idle-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm('This will replace all your current data. Are you sure?')) {
          // Clear existing data
          localStorage.clear();
          // Import new data
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          // Reload the app to apply changes
          window.location.reload();
        }
      } catch (error) {
        alert('Error importing data. The file might be corrupted or in the wrong format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow re-importing the same file
    event.target.value = '';
  };

  useEffect(() => {
    // Cargar el juego
    gameStore.loadGame()
    setGameState(gameStore.getState())


    console.log('gameState', gameState)
    if (gameState) {
      try {
        if (gameState.player?.name) {
          setPlayerName(gameState.player.name)
        }
      } catch (e) {
        console.error('Error al cargar el perfil del jugador:', e)
      }
    }

    // Configurar listener para cambios de estado
    const checkState = setInterval(() => {
      const newState = gameStore.getState()
      setGameState(newState)
    }, 100)

    return () => clearInterval(checkState)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-surface-light/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">{playerName}'s Habit Idle</h1>
            <p className="text-sm text-text-muted">Power up your daily routine</p>
          </div>
          <div>
            <CoinsDisplay />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              title="Export data"
            >
              💾 Export
            </button>
            <button
              onClick={() => document.getElementById('importInput')?.click()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              title="Import data"
            >
              📥 Import
              <input
                id="importInput"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
            >
              {showForm ? 'Close' : '+ New Habit'}
            </button>
            <Link
              href="/settings"
              className="px-4 py-2 bg-surface-light hover:bg-surface-light/80 text-text rounded-lg font-semibold transition-colors"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <XpProgress />
            </div>
          </div>

          {/* Create Habit Form */}
          {showForm && (
            <HabitForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          )}
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {gameState.xpHistory.length > 0 && (
                <XpTrendChart gameState={gameState} days={7} />
              )}
              <HabitsList gameState={gameState} />
            </div>

            <div className="lg:col-span-1 space-y-4">
              {gameState.spendingHistory.length > 0 && (
                <SpendingHistory gameState={gameState} />
              )}
              {Array.from(gameState.streaks.values()).some(s => s.current > 0 || s.longest > 0) && (
                <StreakDisplay gameState={gameState} />
              )}
            </div>
            <div className="lg:col-span-3 space-y-4">
              <RewardsSection gameState={gameState} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
