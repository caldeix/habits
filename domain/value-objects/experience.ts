import { getLevelFromXp, getXpForLevel } from '@/lib/xp-calculator'

export class ExperienceVO {
  constructor(public totalXp: number) {
    if (totalXp < 0) {
      throw new Error('Total XP cannot be negative')
    }
  }

  addXp(amount: number): ExperienceVO {
    if (amount < 0) {
      throw new Error('XP amount cannot be negative')
    }
    return new ExperienceVO(this.totalXp + amount)
  }

  getLevel(): number {
    return getLevelFromXp(this.totalXp).level
  }

  getCurrentXp(): number {
    return getLevelFromXp(this.totalXp).currentXp
  }

  getXpForNextLevel(): number {
    return getXpForLevel(this.getLevel())
  }

  getProgressToNextLevel(): number {
    const current = this.getCurrentXp()
    const next = this.getXpForNextLevel()
    return (current / next) * 100
  }

  hasLeveledUp(previousXp: number): boolean {
    const previousLevel = getLevelFromXp(previousXp).level
    const currentLevel = this.getLevel()
    return currentLevel > previousLevel
  }
}
