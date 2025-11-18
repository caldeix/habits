import { HabitEntity } from '@/domain/entities/habit'
import { LifeArea } from '@/lib/types'

export class CreateHabitUseCase {
  execute(
    name: string,
    description: string,
    area: LifeArea,
    frequency: 'daily' | 'weekly' | 'custom',
    difficulty: 'easy' | 'medium' | 'hard',
    targetDays?: string[]
  ): HabitEntity {
    // Validate inputs
    if (!name.trim()) {
      throw new Error('Habit name cannot be empty')
    }
    if (name.length > 100) {
      throw new Error('Habit name must be less than 100 characters')
    }
    if (description.length > 500) {
      throw new Error('Habit description must be less than 500 characters')
    }

    // Calculate XP and coin rewards based on difficulty
    const rewards = {
      easy: { xp: 25, coins: 5 },
      medium: { xp: 50, coins: 10 },
      hard: { xp: 100, coins: 20 },
    }[difficulty]

    const habit = new HabitEntity(
      `habit-${Date.now()}`,
      name,
      description,
      area,
      frequency,
      rewards.xp,
      rewards.coins,
      difficulty,
      new Date(),
      true,
      targetDays
    )

    return habit
  }
}
