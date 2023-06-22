import { useSyncExternalStore } from 'react'

const onWindowSizeChange = (onChange: () => void) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

// Needed for server side rendering
const getServerSnapshot = () => 0

/**
 * Get window height and width using `useSyncExternalStore()` hook
 * (React 18.0.0+)
 * @link https://julesblom.com/writing/usesyncexternalstore
 */
export const useWindowSize = () => {
  const width = useSyncExternalStore(
    onWindowSizeChange,
    () => window.innerWidth,
    getServerSnapshot
  )

  const height = useSyncExternalStore(
    onWindowSizeChange,
    () => window.innerHeight,
    getServerSnapshot
  )

  return { width, height }
}
