'use client'

import React from 'react'
import { GameState, Player, Habit, HabitCompletion, Streak, Reward, Priority, LifeArea, XpRegistration } from '@/lib/types'
import { getLevelFromXp, getProgressToNextLevel } from '@/lib/xp-calculator'
import { storage } from '@/lib/storage'

const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'reward-coffee',
    name: 'Coffee Break',
    description: 'Take a break with your favorite coffee',
    icon: '☕',
    cost: 100,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-movie',
    name: 'Movie Night',
    description: 'Watch your favorite movie',
    icon: '🎬',
    cost: 100,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-shopping',
    name: 'Shopping Spree',
    description: 'Buy something you like',
    icon: '🛍️',
    cost: 150,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-gaming',
    name: 'Gaming Session',
    description: 'Play your favorite game',
    icon: '🎮',
    cost: 100,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-rest',
    name: 'Rest Day',
    description: 'Take a full day off',
    icon: '😴',
    cost: 200,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-travel',
    name: 'Travel Adventure',
    description: 'Plan a small trip',
    icon: '✈️',
    cost: 250,
    unlocked: false,
    visibleInStore: true,
  },
  {
    id: 'reward-spa',
    name: 'Spa Day',
    description: 'Relax and pamper yourself',
    icon: '💆',
    cost: 180,
    unlocked: false,
    visibleInStore: true,
  },
]

const INITIAL_PLAYER: Player = {
  id: 'player-1',
  name: 'Player',
  level: 1,
  totalXp: 0,
  currentXp: 0,
  coins: 0,
  avatar: '🎮',
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
}

// Initial game state
let gameState: GameState = {
  player: INITIAL_PLAYER,
  habits: [],
  completions: [],
  xpHistory: [],
  streaks: new Map(),
  rewards: DEFAULT_REWARDS,
  priorities: [],
  spendingHistory: [],
  dateUpdated: new Date().toISOString(),
}

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const notify = () => {
  listeners.forEach(listener => listener())
}

export const useGameStore = () => {
  const [state, setState] = React.useState(gameState)

  React.useEffect(() => {
    loadGameFromStorage()
    
    const unsubscribe = subscribe(() => {
      setState({ 
        ...gameState, 
        player: { ...gameState.player },
        habits: [...gameState.habits], 
        completions: [...gameState.completions], 
        rewards: [...gameState.rewards],
        spendingHistory: [...gameState.spendingHistory],
        xpHistory: [...gameState.xpHistory],
        streaks: new Map(gameState.streaks) 
      })
    })
    return unsubscribe
  }, [])

  return state
}

// Store actions
const saveGame = () => {
  gameState.dateUpdated = new Date().toISOString()
  storage.set('gamestate', {
    player: gameState.player,
    habits: gameState.habits,
    completions: gameState.completions,
    xpHistory: gameState.xpHistory,
    streaks: Array.from(gameState.streaks.entries()),
    rewards: gameState.rewards,
    priorities: gameState.priorities,
    spendingHistory: gameState.spendingHistory,
    dateUpdated: gameState.dateUpdated,
  })
  notify()
}

const loadGameFromStorage = () => {
  const savedGame = storage.get('gamestate')
  
  if (savedGame) {
    gameState = {
      player: savedGame.player || INITIAL_PLAYER,
      habits: savedGame.habits || [],
      completions: savedGame.completions || [],
      xpHistory: savedGame.xpHistory || [],
      streaks: new Map(savedGame.streaks || []),
      rewards: savedGame.rewards && savedGame.rewards.length > 0 ? savedGame.rewards : DEFAULT_REWARDS,
      priorities: savedGame.priorities || [],
      spendingHistory: savedGame.spendingHistory || [],
      dateUpdated: savedGame.dateUpdated || new Date().toISOString(),
    }
  } else {
    gameState = {
      player: INITIAL_PLAYER,
      habits: [],
      completions: [],
      xpHistory: [],
      streaks: new Map(),
      rewards: DEFAULT_REWARDS,
      priorities: [],
      spendingHistory: [],
      dateUpdated: new Date().toISOString(),
    }
  }
  notify()
}

export const gameStore = {
  // Getters
  getState: () => gameState,
  
  // Player actions
  setPlayerName: (name: string) => {
    gameState.player = { ...gameState.player, name }
    saveGame()
  },

  setPlayerAvatar: (avatar: string) => {
    gameState.player = { ...gameState.player, avatar }
    saveGame()
  },

  addXp: (amount: number) => {
    const newTotalXp = gameState.player.totalXp + amount
    const { level, currentXp } = getLevelFromXp(newTotalXp)
    
    gameState.player = {
      ...gameState.player,
      totalXp: newTotalXp,
      currentXp,
      level,
    }
    saveGame()
  },

  addCoins: (amount: number) => {
    gameState.player = {
      ...gameState.player,
      coins: gameState.player.coins + amount
    }
    saveGame()
  },

  // Habit actions
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const difficultyRewards: Record<string, { xp: number; coins: number }> = {
      'easy': { xp: 40, coins: 8 },
      'easy-medium': { xp: 60, coins: 15 },
      'medium': { xp: 100, coins: 25 },
      'medium-hard': { xp: 140, coins: 35 },
      'hard': { xp: 200, coins: 50 }
    }
    
    const rewards = difficultyRewards[habitData.difficulty] || difficultyRewards['medium']
    const xpReward = rewards.xp
    const coinReward = rewards.coins

    const newHabit: Habit = {
      ...habitData,
      xpReward,
      coinReward,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    
    gameState.habits = [...gameState.habits, newHabit]
    gameState.streaks.set(newHabit.id, {
      habitId: newHabit.id,
      current: 0,
      longest: 0,
      lastCompletedAt: null,
    })
    console.log('[v0] Habit added:', newHabit)
    saveGame()
  },

  updateHabit: (id: string, updates: Partial<Habit>) => {
    gameState.habits = gameState.habits.map(h => 
      h.id === id ? { ...h, ...updates } : h
    )
    saveGame()
  },

  deleteHabit: (id: string) => {
    gameState.habits = gameState.habits.filter(h => h.id !== id)
    gameState.completions = gameState.completions.filter(c => c.habitId !== id)
    gameState.streaks.delete(id)
    saveGame()
  },

  getHabits: () => gameState.habits,

  getHabitById: (id: string) => {
    return gameState.habits.find(h => h.id === id)
  },

  purchaseReward: (rewardId: string) => {
    const reward = gameState.rewards.find(r => r.id === rewardId)
    if (!reward) return
    
    if (gameState.player.coins < reward.cost) return

    gameState.player = {
      ...gameState.player,
      coins: gameState.player.coins - reward.cost
    }

    const spending = {
      id: `spending-${Date.now()}`,
      rewardId,
      rewardName: reward.name,
      rewardIcon: reward.icon,
      costCoins: reward.cost,
      purchasedAt: new Date().toISOString(),
    }

    gameState.spendingHistory = [spending, ...gameState.spendingHistory]
    
    console.log('[v0] Reward purchased, notifying listeners')
    saveGame()
  },

  // Completion actions
  completeHabit: (habitId: string) => {
    const habit = gameState.habits.find(h => h.id === habitId)
    if (!habit) return

    const today = new Date().toDateString()
    const existingCompletion = gameState.completions.find(
      c => c.habitId === habitId && new Date(c.completedAt).toDateString() === today
    )
    
    if (existingCompletion) return

    const streak = gameState.streaks.get(habitId)
    const currentStreak = streak?.current || 0
    const streakMultiplier = 1 + (currentStreak * 0.1)
    
    const xpGained = Math.floor(habit.xpReward * streakMultiplier)
    const coinGained = Math.floor(habit.coinReward * streakMultiplier)

    const completion: HabitCompletion = {
      id: `completion-${Date.now()}`,
      habitId,
      completedAt: new Date().toISOString(),
      xpGained,
      coinGained,
      streak: currentStreak,
    }

    gameState.completions = [...gameState.completions, completion]
    
    const xpRegistration: XpRegistration = {
      id: `xp-${Date.now()}`,
      habitId,
      amount: xpGained,
      timestamp: new Date().toISOString(),
      completionId: completion.id,
    }
    gameState.xpHistory = [...gameState.xpHistory, xpRegistration]
    
    const newTotalXp = gameState.player.totalXp + xpGained
    const { level, currentXp } = getLevelFromXp(newTotalXp)
    
    gameState.player = {
      ...gameState.player,
      totalXp: newTotalXp,
      currentXp,
      level,
      coins: gameState.player.coins + coinGained,
    }

    // Increment streak when habit is completed
    const newStreak = (streak?.current || 0) + 1
    const longestStreak = Math.max(streak?.longest || 0, newStreak)
    gameState.streaks.set(habitId, {
      habitId,
      current: newStreak,
      longest: longestStreak,
      lastCompletedAt: new Date().toISOString(),
    })

    saveGame()
  },

  uncompleteHabit: (habitId: string) => {
    const today = new Date().toDateString()
    const completion = gameState.completions.find(
      c => c.habitId === habitId && new Date(c.completedAt).toDateString() === today
    )
    
    if (!completion) return

    const newTotalXp = Math.max(0, gameState.player.totalXp - completion.xpGained)
    const { level, currentXp } = getLevelFromXp(newTotalXp)
    
    gameState.player = {
      ...gameState.player,
      totalXp: newTotalXp,
      currentXp,
      level,
      coins: Math.max(0, gameState.player.coins - completion.coinGained),
    }

    // Remove the completion record
    gameState.completions = gameState.completions.filter(c => c.id !== completion.id)

    // Remove the XP history entry
    gameState.xpHistory = gameState.xpHistory.filter(x => x.completionId !== completion.id)

    const streak = gameState.streaks.get(habitId)
    if (streak && streak.current > 0) {
      gameState.streaks.set(habitId, {
        habitId,
        current: streak.current - 1,
        longest: streak.longest,
        lastCompletedAt: streak.lastCompletedAt,
      })
    }

    saveGame()
  },

  getCompletionToday: (habitId: string) => {
    const today = new Date().toDateString()
    return gameState.completions.find(
      c => c.habitId === habitId && new Date(c.completedAt).toDateString() === today
    )
  },

  // Streaks
  getStreak: (habitId: string) => {
    return gameState.streaks.get(habitId) || null
  },

  // Rewards
  addReward: (rewardData: Omit<Reward, 'id' | 'unlocked'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: `reward-${Date.now()}`,
      unlocked: false,
      visibleInStore: true,
    }
    gameState.rewards = [...gameState.rewards, newReward]
    saveGame()
  },

  updateReward: (id: string, updates: Partial<Reward>) => {
    gameState.rewards = gameState.rewards.map(r =>
      r.id === id ? { ...r, ...updates } : r
    )
    saveGame()
  },

  unlockReward: (rewardId: string) => {
    gameState.rewards = gameState.rewards.map(r =>
      r.id === rewardId ? { ...r, unlocked: true, unlockedAt: new Date().toISOString() } : r
    )
    saveGame()
  },

  deleteReward: (id: string) => {
    gameState.rewards = gameState.rewards.filter(r => r.id !== id)
    saveGame()
  },

  // Persistence
  loadGame: loadGameFromStorage,

  resetGame: () => {
    gameState = {
      player: { ...INITIAL_PLAYER },
      habits: [],
      completions: [],
      xpHistory: [],
      streaks: new Map(),
      rewards: [...DEFAULT_REWARDS],
      priorities: [],
      spendingHistory: [],
      dateUpdated: new Date().toISOString(),
    }
    storage.remove('gamestate')
    notify()
    window.location.href = '/'
  },

  // Analytics
  getHabitXpStats: (habitId: string, days: number = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return gameState.xpHistory.filter(
      xp => xp.habitId === habitId && new Date(xp.timestamp) >= cutoffDate
    )
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
