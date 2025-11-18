// Core domain types
export type LifeArea = 'health' | 'work' | 'relationships' | 'learning' | 'finance' | 'personal'

export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual'

export type MonthlyFrequency = 'every-week' | 'every-15-days' | 'first-day' | 'last-day'
export type AnnualFrequency = 'every-month' | 'every-3-months' | 'every-6-months' | 'every-12-months'

export type DifficultyLevel = 'easy' | 'easy-medium' | 'medium' | 'medium-hard' | 'hard'

export interface Priority {
  id: string
  area: LifeArea
  priority: number // 1-5, lower is higher priority
  color: string
}

export interface Habit {
  id: string
  name: string
  description: string
  area: LifeArea
  frequency: FrequencyType
  monthlyFrequency?: MonthlyFrequency
  annualFrequency?: AnnualFrequency
  targetDays?: string[] // ['Mon', 'Wed', 'Fri'] for weekly
  xpReward: number
  coinReward: number
  difficulty: DifficultyLevel
  createdAt: string
  active: boolean
}

export interface XpRegistration {
  id: string
  habitId: string
  amount: number
  timestamp: string
  completionId: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  completedAt: string
  xpGained: number
  coinGained: number
  streak: number
}

export interface RewardSpending {
  id: string
  rewardId: string
  rewardName: string
  rewardIcon: string
  costCoins: number
  purchasedAt: string
}

export interface Streak {
  habitId: string
  current: number
  longest: number
  lastCompletedAt: string | null
}

export interface Reward {
  id: string
  name: string
  description: string
  icon: string // added icon field
  cost: number // coin cost
  unlocked: boolean
  unlockedAt?: string
}

export interface Player {
  id: string
  name: string
  level: number
  totalXp: number
  currentXp: number
  coins: number
  avatar: string
  createdAt: string
  lastActiveAt: string
}

export interface GameState {
  player: Player
  habits: Habit[]
  completions: HabitCompletion[]
  xpHistory: XpRegistration[]
  streaks: Map<string, Streak>
  rewards: Reward[]
  priorities: Priority[]
  spendingHistory: RewardSpending[]
}
