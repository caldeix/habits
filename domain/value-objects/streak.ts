export class StreakVO {
  constructor(
    public current: number,
    public longest: number,
    public lastCompletedAt: Date | null
  ) {
    if (current < 0 || longest < 0) {
      throw new Error('Streak values cannot be negative')
    }
    if (longest < current) {
      throw new Error('Longest streak cannot be less than current streak')
    }
  }

  incrementStreak(): StreakVO {
    const newCurrent = this.current + 1
    const newLongest = Math.max(this.longest, newCurrent)
    return new StreakVO(newCurrent, newLongest, new Date())
  }

  resetStreak(): StreakVO {
    return new StreakVO(0, this.longest, null)
  }

  getStatus(): 'hot' | 'cold' | 'broken' {
    if (this.current >= 7) return 'hot'
    if (this.current >= 3) return 'cold'
    return 'broken'
  }
}
