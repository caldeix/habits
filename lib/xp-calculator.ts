// XP and leveling system
const BASE_XP_FOR_LEVEL = 1000
const XP_MULTIPLIER = 1.1

export const getXpForLevel = (level: number): number => {
  return Math.floor(BASE_XP_FOR_LEVEL * Math.pow(XP_MULTIPLIER, level - 1))
}

export const getTotalXpForLevel = (level: number): number => {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i)
  }
  return total
}

export const getLevelFromXp = (totalXp: number): { level: number; currentXp: number } => {
  let level = 1
  let xpAccumulated = 0

  while (true) {
    const nextLevelXp = getXpForLevel(level)
    if (xpAccumulated + nextLevelXp > totalXp) {
      return {
        level,
        currentXp: totalXp - xpAccumulated,
      }
    }
    xpAccumulated += nextLevelXp
    level++
  }
}

export const getProgressToNextLevel = (totalXp: number): { current: number; total: number; percentage: number } => {
  const { level, currentXp } = getLevelFromXp(totalXp)
  const nextLevelXpNeeded = getXpForLevel(level)
  
  return {
    current: currentXp,
    total: nextLevelXpNeeded,
    percentage: (currentXp / nextLevelXpNeeded) * 100,
  }
}
