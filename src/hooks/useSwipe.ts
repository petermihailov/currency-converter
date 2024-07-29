import type { RefObject } from 'react'
import { useEffect } from 'react'

interface SwipeCallbacks {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  onSwipeDown: () => void
}

export const useSwipe = (
  refContainer: RefObject<HTMLElement>,
  { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: Partial<SwipeCallbacks> = {},
) => {
  useEffect(() => {
    const element = refContainer.current!

    let xDown: number | null = null
    let yDown: number | null = null

    const handleTouchStart = (e: TouchEvent) => {
      const firstTouch = e.touches[0]
      xDown = firstTouch.clientX
      yDown = firstTouch.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!xDown || !yDown) {
        return
      }

      const xUp = e.touches[0].clientX
      const yUp = e.touches[0].clientY

      const xDiff = xDown - xUp
      const yDiff = yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* left swipe */
          onSwipeLeft?.()
        } else {
          /* right swipe */
          onSwipeRight?.()
        }
      } else {
        if (yDiff > 0) {
          /* up down swipe */
          onSwipeUp?.()
        } else {
          /* down swipe */
          onSwipeDown?.()
        }
      }

      /* reset values */
      xDown = null
      yDown = null
    }

    element.addEventListener('touchstart', handleTouchStart, false)
    element.addEventListener('touchmove', handleTouchMove, false)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp, refContainer])
}
