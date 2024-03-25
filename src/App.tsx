import { useRef } from 'react'
import { useCanvas } from './hooks/useCanvas.ts'

export const App = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const { sinus, cosinus, tangens, ctangens } = useCanvas(canvasRef)

	return (
		<>
			<canvas width={500} height={500} ref={canvasRef} />
			<p>sin(a) = {sinus.toFixed(2)}</p>
			<p>cos(a) = {cosinus.toFixed(2)}</p>
			<p>tg(a) = {tangens.toFixed(2)}</p>
			<p>ctg(a) = {ctangens.toFixed(2)}</p>
		</>
	)
}
