'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface LevelUpModalProps {
  isOpen: boolean
  newLevel: number
  onClose: () => void
}

export default function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-primary to-primary-dark border border-accent-gold p-8 text-center max-w-sm">
        <div className={`text-6xl mb-4 transition-all duration-500 ${
          showConfetti ? 'scale-150 rotate-12' : 'scale-100'
        }`}>
          🎉
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
        <div className="text-5xl font-bold text-accent-gold mb-4">{newLevel}</div>
        
        <p className="text-white/90 mb-6">
          Congratulations on reaching Level {newLevel}!
        </p>

        <button
          onClick={onClose}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Awesome!
        </button>
      </Card>
    </div>
  )
}
