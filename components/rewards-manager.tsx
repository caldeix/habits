'use client'

import { useState } from 'react'
import { gameStore } from '@/store/game-store'
import { Card } from '@/components/ui/card'
import { GameState } from '@/lib/types'
import EmojiPicker from '@/components/emoji-picker'

interface RewardsManagerProps {
  gameState: GameState
  onUpdate?: () => void
}

const DEFAULT_REWARD_IDS = [
  'reward-coffee',
  'reward-movie',
  'reward-shopping',
  'reward-gaming',
  'reward-rest',
  'reward-travel',
  'reward-spa',
]

type SortOption = 'name' | 'cost' | 'created'
type SortDirection = 'asc' | 'desc'

export default function RewardsManager({ gameState, onUpdate }: RewardsManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [error, setError] = useState<string | null>(null)
  const [editingData, setEditingData] = useState({ name: '', icon: '⭐', cost: 100 })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '⭐',
    cost: 100,
    visibleInStore: true,
  })

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    gameStore.addReward({
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      cost: formData.cost,
      visibleInStore: formData.visibleInStore,
    })

    setFormData({ name: '', description: '', icon: '⭐', cost: 100, visibleInStore: true })
    setShowForm(false)
    setError(null)
    onUpdate?.()
  }

  const handleDeleteReward = (id: string) => {
    if (confirm('Delete this reward?')) {
      gameStore.deleteReward(id)
      onUpdate?.()
    }
  }

  const handleUpdateReward = (id: string, updates: any) => {
    gameStore.updateReward(id, updates)
    onUpdate?.()
  }

  const handleStartEdit = (id: string, reward: any) => {
    setEditingId(id)
    setEditingData({ name: reward.name, icon: reward.icon, cost: reward.cost })
    setError(null)
  }

  const handleSaveEdit = (id: string) => {
    if (editingData.name.trim()) {
      handleUpdateReward(id, { 
        name: editingData.name,
        icon: editingData.icon,
        cost: editingData.cost
      })
    }
    setEditingId(null)
    setEditingData({ name: '', icon: '⭐', cost: 100 })
    setError(null)
  }

  const getSortedRewards = () => {
    const sorted = [...gameState.rewards]
    
    let result
    switch (sortBy) {
      case 'name':
        result = sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'cost':
        result = sorted.sort((a, b) => a.cost - b.cost)
        break
      case 'created':
        result = sorted.reverse()
        break
      default:
        result = sorted
    }

    return sortDirection === 'desc' ? result.reverse() : result
  }

  const sortedRewards = getSortedRewards()

  const handleSortClick = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortDirection('asc')
    }
  }

  return (
    <Card className="bg-surface border-surface-light/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-text">Manage Rewards</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Reward'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-accent-rose/20 border border-accent-rose rounded text-accent-rose text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddReward} className="mb-4 p-4 bg-surface-light/20 rounded space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <EmojiPicker 
                value={formData.icon}
                onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
              />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Reward name"
              className="flex-1 bg-surface-light/30 border border-surface-light/30 rounded px-2 py-1 text-text text-sm"
            />
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-surface-light/30 border border-surface-light/30 rounded px-2 py-1 text-text text-sm resize-none"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-text-muted">Cost:</label>
              <span className="text-sm font-semibold text-primary">💰 {formData.cost} coins</span>
            </div>
            <input
              type="range"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
              min="100"
              max="2000"
              step="10"
              className="w-full h-2 bg-surface-light/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>100</span>
              <span>2000</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-text-muted">Visible in Store:</label>
              <span className="text-sm font-semibold text-primary">{formData.visibleInStore ? 'Visible' : 'Hidden'}</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.visibleInStore}
                onChange={(e) => setFormData({ ...formData, visibleInStore: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded transition-colors"
          >
            Add Reward
          </button>
        </form>
      )}

      {gameState.rewards.length > 0 && (
        <div className="mb-4 flex gap-2">
          <span className="text-sm text-text-muted flex items-center">Sort by:</span>
          <button
            onClick={() => handleSortClick('name')}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              sortBy === 'name'
                ? 'bg-primary text-white'
                : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
            }`}
          >
            Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('cost')}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              sortBy === 'cost'
                ? 'bg-primary text-white'
                : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
            }`}
          >
            Cost {sortBy === 'cost' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('created')}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              sortBy === 'created'
                ? 'bg-primary text-white'
                : 'bg-surface-light/30 text-text hover:bg-surface-light/50'
            }`}
          >
            Created {sortBy === 'created' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {gameState.rewards.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">No rewards yet</p>
        ) : (
          sortedRewards.map(reward => {
            const isDefault = DEFAULT_REWARD_IDS.includes(reward.id)
            const isEditing = editingId === reward.id

            return (
              <div key={reward.id} className="flex items-center justify-between bg-surface-light/20 p-4 rounded-lg">
                <div className="flex-1 flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex-shrink-0">
                      <EmojiPicker 
                        value={editingData.icon}
                        onChange={(emoji) => setEditingData({ ...editingData, icon: emoji })}
                      />
                    </div>
                  ) : (
                    <span className="text-2xl flex-shrink-0">{reward.icon}</span>
                  )}
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingData.name}
                          onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                          autoFocus
                          className="w-full bg-surface-light/30 border border-primary rounded px-2 py-1 text-text text-sm"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Cost:</span>
                            <span className="text-xs font-semibold text-primary">💰 {editingData.cost} coins</span>
                          </div>
                          <input
                            type="range"
                            value={editingData.cost}
                            onChange={(e) => setEditingData({ ...editingData, cost: parseInt(e.target.value) })}
                            min="100"
                            max="2000"
                            step="10"
                            className="w-full h-2 bg-surface-light/30 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text">{reward.name}</p>
                          {isDefault && (
                            <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted">{reward.description || 'No description'}</p>
                        <p className="text-sm text-primary font-semibold mt-1">💰 {reward.cost} coins</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(reward.id)}
                        className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setError(null)
                        }}
                        className="px-3 py-1 bg-surface-light/30 text-text text-sm rounded hover:bg-surface-light/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(reward.id, reward)}
                        className="px-3 py-1 text-sm rounded transition-colors bg-surface-light/30 hover:bg-surface-light/50 text-text"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleUpdateReward(reward.id, { visibleInStore: !reward.visibleInStore })}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          reward.visibleInStore
                            ? 'bg-primary/30 text-primary'
                            : 'bg-surface-light/30 hover:bg-surface-light/50 text-text'
                        }`}
                      >
                        {reward.visibleInStore ? 'Visible en tienda' : 'No visible'}
                      </button>
                      <button
                        onClick={() => handleDeleteReward(reward.id)}
                        className="px-3 py-1 bg-accent-rose/20 hover:bg-accent-rose/30 text-accent-rose text-sm rounded transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
