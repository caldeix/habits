// localStorage utilities for local-first storage
const STORAGE_PREFIX = 'lgh_'

export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch {
      console.error('Storage error:', key)
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch {
      console.error('Storage error:', key)
    }
  },
  
  clear: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch {
      console.error('Storage error: clear')
    }
  }
}
