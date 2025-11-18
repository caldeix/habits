import { LifeArea } from '@/lib/types'

export class HabitEntity {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public area: LifeArea,
    public frequency: 'daily' | 'weekly' | 'custom',
    public xpReward: number,
    public coinReward: number,
    public difficulty: 'easy' | 'medium' | 'hard',
    public createdAt: Date,
    public active: boolean,
    public targetDays?: string[]
  ) {}

  isScheduledFor(date: Date): boolean {
    if (this.frequency === 'daily') return true
    if (this.frequency === 'weekly' && this.targetDays) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      return this.targetDays.includes(dayName)
    }
    return false
  }

  deactivate(): HabitEntity {
    return new HabitEntity(
      this.id,
      this.name,
      this.description,
      this.area,
      this.frequency,
      this.xpReward,
      this.coinReward,
      this.difficulty,
      this.createdAt,
      false,
      this.targetDays
    )
  }
}
