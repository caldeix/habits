'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

// 50 best emojis for habits and rewards
const HABIT_EMOJIS = [
  '💪', '🏃', '🧘', '🚴', '⛹️', '🏊', '🤸', '🧗', '🏋️', '🤾',
  '📚', '✏️', '🎯', '🧠', '💡', '🎓', '📖', '🖊️', '🎨', '🎭',
  '🍎', '🥗', '🥤', '☕', '🍽️', '🥕', '🍊', '🥛', '🍓', '🥜',
  '😴', '🛌', '🚿', '🧴', '💆', '🧖', '🛀', '💅', '🧼', '🪥',
  '🎮', '📱', '💻', '📺', '🎵', '🎬', '🎪', '🎯', '🏆', '🎁'
]

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-2xl hover:scale-110 transition-transform"
          title="Click to change emoji"
        >
          {value || '⭐'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-surface border border-surface-light/30">
        <div className="grid grid-cols-5 gap-2">
          {HABIT_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji)
                setOpen(false)
              }}
              className={`text-2xl p-2 rounded hover:bg-primary/20 transition-colors ${
                value === emoji ? 'bg-primary/30' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
