import { HabitEntity } from '@/domain/entities/habit'
import { StreakVO } from '@/domain/value-objects/streak'
import { ExperienceVO } from '@/domain/value-objects/experience'

export interface CompleteHabitResult {
  xpGained: number
  coinsGained: number
  streakUpdated: StreakVO
  leveledUp: boolean
  newLevel: number
}

export class CompleteHabitUseCase {
  execute(
    habit: HabitEntity,
    currentXp: ExperienceVO,
    currentStreak: StreakVO,
    lastCompletedAt: Date | null
  ): CompleteHabitResult {
    // Check if completion is valid for today
    const today = new Date().toDateString()
    const lastCompletedToday = lastCompletedAt && new Date(lastCompletedAt).toDateString() === today
    
    if (lastCompletedToday) {
      throw new Error('Habit already completed today')
    }

    // Calculate streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasCompletedYesterday = 
      lastCompletedAt && 
      new Date(lastCompletedAt).toDateString() === yesterday.toDateString()

    let updatedStreak = currentStreak
    if (wasCompletedYesterday || currentStreak.current === 0) {
      updatedStreak = currentStreak.incrementStreak()
    } else {
      updatedStreak = currentStreak.incrementStreak()
    }

    // Calculate rewards based on difficulty and streak multiplier
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    }[habit.difficulty]

    const streakMultiplier = Math.min(1 + updatedStreak.current * 0.05, 2)

    const xpGained = Math.floor(habit.xpReward * difficultyMultiplier * streakMultiplier)
    const coinsGained = Math.floor(habit.coinReward * difficultyMultiplier * streakMultiplier)

    const previousXp = currentXp.totalXp
    const newExperience = currentXp.addXp(xpGained)

    return {
      xpGained,
      coinsGained,
      streakUpdated: updatedStreak,
      leveledUp: newExperience.hasLeveledUp(previousXp),
      newLevel: newExperience.getLevel(),
    }
  }
}
