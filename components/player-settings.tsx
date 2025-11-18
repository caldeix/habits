'use client'

import { useState } from 'react'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlayerSettings() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = () => {
    if (showConfirm) {
      gameStore.resetGame()
      window.location.reload()
    } else {
      setShowConfirm(true)
    }
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <h3 className="text-lg font-semibold text-text mb-4">Settings</h3>

      <div className="space-y-4">
        {/* Data Management */}
        <div className="border-t border-surface-light/20 pt-4">
          <h4 className="text-sm font-medium text-text-muted mb-3">Data Management</h4>

          {showConfirm ? (
            <div className="bg-accent-rose/10 border border-accent-rose/30 rounded p-4 mb-3">
              <p className="text-sm text-text mb-3">
                This action cannot be undone. All your habits, progress, and data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleReset}
                  className="bg-accent-rose hover:bg-accent-rose text-white flex-1"
                >
                  Confirm Reset
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  className="bg-surface-light hover:bg-surface-light/80 text-text flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleReset}
              className="w-full bg-surface-light hover:bg-surface-light/80 text-text border border-surface-light/30"
            >
              Reset All Data
            </Button>
          )}

          <p className="text-xs text-text-muted mt-2">
            All your progress and habits will be deleted. This action cannot be undone.
          </p>
        </div>

        {/* About */}
        <div className="border-t border-surface-light/20 pt-4">
          <h4 className="text-sm font-medium text-text-muted mb-2">About</h4>
          <p className="text-xs text-text-muted">
            Life Gaming Habits v1.0
            <br />
            Gamify your daily habits
          </p>
        </div>
      </div>
    </Card>
  )
}
