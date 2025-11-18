export interface DailySummary {
  totalHabitsScheduled: number
  completedHabits: number
  xpEarned: number
  coinsEarned: number
  completionRate: number
}

export class CalculateDailySummaryUseCase {
  execute(
    scheduledHabits: number,
    completedHabits: number,
    totalXpEarned: number,
    totalCoinsEarned: number
  ): DailySummary {
    const completionRate = scheduledHabits > 0 ? (completedHabits / scheduledHabits) * 100 : 0

    return {
      totalHabitsScheduled: scheduledHabits,
      completedHabits,
      xpEarned: totalXpEarned,
      coinsEarned: totalCoinsEarned,
      completionRate,
    }
  }
}
