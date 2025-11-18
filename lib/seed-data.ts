import { GameState, Habit, HabitCompletion, XpRegistration, Streak } from './types'

export const generateSeedData = (): {
  player: any
  habits: Habit[]
  completions: HabitCompletion[]
  xpHistory: XpRegistration[]
  streaks: Array<[string, Streak]>
  rewards: any[]
  priorities: any[]
} => {
  // Generate realistic habits across all categories and frequencies
  const habits: Habit[] = [
    // Daily habits
    {
      id: 'habit-daily-exercise',
      name: 'Ejercicio Matinal',
      description: 'Rutina de 30 minutos',
      area: 'health',
      frequency: 'daily',
      targetDays: undefined,
      xpReward: 40,
      coinReward: 8,
      difficulty: 'easy',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    {
      id: 'habit-daily-meditation',
      name: 'Meditación',
      description: '10 minutos diarios',
      area: 'health',
      frequency: 'daily',
      targetDays: undefined,
      xpReward: 60,
      coinReward: 15,
      difficulty: 'easy-medium',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    // Weekly habits - specific days
    {
      id: 'habit-weekly-code',
      name: 'Coding Challenge',
      description: 'Resolver problemas de código',
      area: 'learning',
      frequency: 'weekly',
      targetDays: ['Mon', 'Wed', 'Fri'],
      xpReward: 100,
      coinReward: 25,
      difficulty: 'medium',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    {
      id: 'habit-weekly-gym',
      name: 'Sesión de Gym',
      description: 'Entrenamiento completo',
      area: 'health',
      frequency: 'weekly',
      targetDays: ['Tue', 'Thu', 'Sat'],
      xpReward: 140,
      coinReward: 35,
      difficulty: 'medium-hard',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    // Monthly habits
    {
      id: 'habit-monthly-planning',
      name: 'Planificación Mensual',
      description: 'Revisar metas mensuales',
      area: 'personal',
      frequency: 'monthly',
      monthlyFrequency: 'first-day',
      xpReward: 200,
      coinReward: 50,
      difficulty: 'hard',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    {
      id: 'habit-monthly-review',
      name: 'Review Finances',
      description: 'Revisar gastos e ingresos',
      area: 'finance',
      frequency: 'monthly',
      monthlyFrequency: 'last-day',
      xpReward: 100,
      coinReward: 25,
      difficulty: 'medium',
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    {
      id: 'habit-biweekly-cleaning',
      name: 'Limpieza Profunda',
      description: 'Limpiar la casa a fondo',
      area: 'personal',
      frequency: 'biweekly',
      targetDays: undefined,
      xpReward: 100,
      coinReward: 25,
      difficulty: 'medium',
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
    // Annual habits
    {
      id: 'habit-annual-health-checkup',
      name: 'Chequeo Médico',
      description: 'Examen anual de salud',
      area: 'health',
      frequency: 'annual',
      annualFrequency: 'every-6-months',
      xpReward: 200,
      coinReward: 50,
      difficulty: 'easy',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    },
  ]

  // Generate completions with realistic distribution and streaks
  const completions: HabitCompletion[] = []
  const now = Date.now()

  habits.forEach(habit => {
    // Determine completion pattern based on habit
    let completionDays: number[] = []

    if (habit.frequency === 'daily') {
      // Daily habits: 80% completion rate
      completionDays = Array.from({ length: 30 }, (_, i) => {
        const day = i
        return Math.random() < 0.8 ? day : -1
      }).filter(d => d !== -1)
    } else if (habit.frequency === 'weekly' && habit.targetDays) {
      // Weekly: complete on target days, 70% compliance
      const dayMap: Record<string, number> = {
        Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0
      }
      for (let week = 0; week < 4; week++) {
        habit.targetDays.forEach(day => {
          if (Math.random() < 0.7) {
            completionDays.push(week * 7 + dayMap[day])
          }
        })
      }
    } else if (habit.frequency === 'biweekly') {
      // Biweekly: every 14 days
      for (let i = 0; i < 2; i++) {
        if (Math.random() < 0.85) {
          completionDays.push(i * 14)
        }
      }
    } else if (habit.frequency === 'monthly') {
      // Monthly: complete once per month
      if (Math.random() < 0.9) completionDays.push(5)
    }

    // Create completion records
    completionDays.forEach((dayOffset, idx) => {
      const completionDate = new Date(now - (dayOffset * 24 * 60 * 60 * 1000))
      const completion: HabitCompletion = {
        id: `completion-${habit.id}-${idx}`,
        habitId: habit.id,
        completedAt: completionDate.toISOString(),
        xpGained: habit.xpReward,
        coinGained: habit.coinReward,
        streak: Math.min(idx, 5), // Simulate streak
      }
      completions.push(completion)
    })
  })

  // Generate XP history from completions
  const xpHistory: XpRegistration[] = completions.map(comp => ({
    id: `xp-${comp.id}`,
    habitId: comp.habitId,
    amount: comp.xpGained,
    timestamp: comp.completedAt,
    completionId: comp.id,
  }))

  // Calculate total XP from history
  const totalXp = xpHistory.reduce((sum, xp) => sum + xp.amount, 0)

  // Generate streaks for each habit
  const streaksArray: Array<[string, Streak]> = habits.map(habit => {
    const habitCompletions = completions
      .filter(c => c.habitId === habit.id)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    let current = 0
    if (habitCompletions.length > 0) {
      const lastCompletion = new Date(habitCompletions[0].completedAt)
      const today = new Date()
      const dayDiff = Math.floor((today.getTime() - lastCompletion.getTime()) / (24 * 60 * 60 * 1000))
      
      // If completed in last 2 days, count streak
      if (dayDiff <= 2) {
        current = Math.min(habitCompletions.length, 15)
      }
    }

    return [
      habit.id,
      {
        habitId: habit.id,
        current,
        longest: Math.max(...habitCompletions.map(c => c.streak), 0),
        lastCompletedAt: habitCompletions[0]?.completedAt || null,
      }
    ]
  })

  return {
    player: {
      id: 'player-1',
      name: 'Test Player',
      level: Math.floor(totalXp / 1000) + 1,
      totalXp,
      currentXp: totalXp % 1000,
      coins: 450,
      avatar: '🎯',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    habits,
    completions,
    xpHistory,
    streaks: streaksArray,
    rewards: [
      {
        id: 'reward-coffee',
        name: 'Coffee Break',
        icon: '☕',
        cost: 100,
        unlocked: true,
        visibleInStore: true,
      },
      {
        id: 'reward-movie',
        name: 'Movie Night',
        icon: '🎬',
        cost: 120,
        unlocked: true,
        visibleInStore: true,
      },
      {
        id: 'reward-shopping',
        name: 'Shopping Spree',
        icon: '🛍️',
        cost: 200,
        unlocked: false,
        visibleInStore: true,
      },
      {
        id: 'reward-gaming',
        name: 'Gaming Session',
        icon: '🎮',
        cost: 150,
        unlocked: true,
        visibleInStore: true,
      },
      {
        id: 'reward-rest',
        name: 'Rest Day',
        icon: '😴',
        cost: 250,
        unlocked: false,
        visibleInStore: true,
      },
      {
        id: 'reward-travel',
        name: 'Travel Adventure',
        icon: '✈️',
        cost: 400,
        unlocked: false,
        visibleInStore: true,
      },
      {
        id: 'reward-spa',
        name: 'Spa Day',
        icon: '💆',
        cost: 300,
        unlocked: false,
        visibleInStore: true,
      },
    ],
    priorities: [],
  }
}
