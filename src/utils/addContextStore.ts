/**
 * Simple pub/sub for passing selected gallery media back to the report view.
 *
 * Flow: ReportView -> push Gallery (pickerMode) -> user selects items -> Gallery
 * publishes selected IDs to this store and pops -> ReportView's subscribed handler
 * receives the items and kicks off the reprocessing state.
 */

type Listener = (mediaIds: string[]) => void

const listeners = new Set<Listener>()

export const addContextStore = {
  publish(mediaIds: string[]) {
    listeners.forEach(l => l(mediaIds))
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
