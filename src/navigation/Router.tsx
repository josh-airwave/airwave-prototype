import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { AirwaveIsland, getIslandMode } from '../components/AirwaveIsland'
import { feedbackStore } from '../data/feedbackStore'

type RouteParams = Record<string, unknown>

interface RouteEntry {
  screen: string
  params?: RouteParams
}

interface NavigationContextType {
  currentScreen: string
  params: RouteParams
  push: (screen: string, params?: RouteParams) => void
  pop: () => void
  replace: (screen: string, params?: RouteParams) => void
  reset: (screen: string, params?: RouteParams) => void
  canGoBack: boolean
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationContextType>(null!)

export function useNavigation() {
  return useContext(NavigationContext)
}

interface RouterProps {
  screens: Record<string, React.ComponentType<{ params?: RouteParams }>>
  initialScreen: string
  children?: React.ReactNode
}

export function Router({ screens, initialScreen, children }: RouterProps) {
  const [stack, setStack] = useState<RouteEntry[]>([{ screen: initialScreen }])
  const [animating, setAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const prevScreenRef = useRef<string | null>(null)

  const current = stack[stack.length - 1]

  const push = useCallback((screen: string, params?: RouteParams) => {
    if (animating) return
    prevScreenRef.current = current.screen
    setSlideDirection('left')
    setAnimating(true)
    setStack(s => [...s, { screen, params }])
  }, [animating, current])

  const pop = useCallback(() => {
    if (animating || stack.length <= 1) return
    prevScreenRef.current = current.screen
    setSlideDirection('right')
    setAnimating(true)
    setTimeout(() => {
      setStack(s => s.slice(0, -1))
    }, 10)
  }, [animating, stack, current])

  const replace = useCallback((screen: string, params?: RouteParams) => {
    setStack(s => [...s.slice(0, -1), { screen, params }])
  }, [])

  const reset = useCallback((screen: string, params?: RouteParams) => {
    feedbackStore.clear()
    setAnimating(false)
    setStack([{ screen, params }])
    setSlideDirection(null)
  }, [])

  useEffect(() => {
    if (animating) {
      const t = setTimeout(() => {
        setAnimating(false)
        setSlideDirection(null)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [animating])

  // Overlay screens render on top of the previous screen
  const overlayScreens = ['ShareFlow']
  const topIsOverlay = overlayScreens.includes(current.screen) && stack.length > 1

  return (
    <NavigationContext.Provider
      value={{
        currentScreen: current.screen,
        params: current.params || {},
        push,
        pop,
        replace,
        reset,
        canGoBack: stack.length > 1,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {stack.map((entry, idx) => {
            const Screen = screens[entry.screen]
            if (!Screen) return null
            const isTop = idx === stack.length - 1
            const isUnderOverlay = idx === stack.length - 2 && topIsOverlay
            const visible = isTop || isUnderOverlay
            return (
              <div
                key={entry.screen + '-' + idx}
                style={{
                  position: 'absolute', inset: 0,
                  zIndex: idx,
                  display: visible ? 'block' : 'none',
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                <Screen params={entry.params} />
              </div>
            )
          })}
        </div>
        <AirwaveIsland
          mode={getIslandMode(current.screen)}
          channelType={current.params?.channelType as 'group' | 'dm' | 'channel' | undefined}
          onLeaderboardPress={() => push('Leaderboard')}
        />
        {children}
      </div>
    </NavigationContext.Provider>
  )
}
