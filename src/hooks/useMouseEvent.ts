import { MutableRefObject, useEffect } from 'react'

export const useMouseEvent = (handler: (event: MouseEvent) => void, container: MutableRefObject<HTMLElement | null>) => {
	useEffect(() => {
		let newContainer: HTMLElement | Window | null = container.current
		if (!container.current) newContainer = window
		if (!newContainer) return

		newContainer.addEventListener('mousemove', handler as EventListenerOrEventListenerObject)
		return () => newContainer.removeEventListener('mousemove', handler as EventListenerOrEventListenerObject)
	}, [container, handler])
}
