// Simple global feedback store for prototype
// When a customer submits "not helpful" on an external report,
// it appears as an alert card in the Blue feed.

export interface FeedbackEntry {
  id: string
  reportId: string
  reportTitle: string
  name: string
  message: string
  timestamp: string
}

let entries: FeedbackEntry[] = []
let listeners: Array<() => void> = []

export const feedbackStore = {
  add(entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) {
    entries = [
      {
        ...entry,
        id: 'fb-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      },
      ...entries,
    ]
    listeners.forEach(fn => fn())
  },

  getAll(): FeedbackEntry[] {
    return entries
  },

  subscribe(fn: () => void) {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter(l => l !== fn)
    }
  },

  clear() {
    entries = []
    listeners.forEach(fn => fn())
  },
}
