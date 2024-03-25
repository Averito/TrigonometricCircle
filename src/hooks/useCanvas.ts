import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useMouseEvent } from './useMouseEvent.ts'

export const useCanvas = (canvasRef: MutableRefObject<HTMLCanvasElement | null>) => {
    const context = useRef(canvasRef.current?.getContext('2d'))
    const step = 300
    const radius = 150

    const [centerX, setCenterX] = useState(0)
    const [centerY, setCenterY] = useState(0)

    const dotRadius = 5
    const [dotX, setDotX] = useState(0)
    const [dotY, setDotY] = useState(0)

    const [dotCoordinateHistory, setDotCoordinateHistory] = useState<Array<[number, number]>>([])

    const [sinus, setSinus] = useState(0)
    const [cosinus, setCosinus] = useState(0)
    const [tangens, setTangens] = useState(0)
    const [ctangens, setCtangens] = useState(0)

    useEffect(() => {
        if (!canvasRef.current) return
        context.current = canvasRef.current.getContext('2d')
        // if (context.current) context.current.globalCompositeOperation = 'destination-out';

        setCenterX(canvasRef.current.clientWidth / 2)
        setCenterY(canvasRef.current.clientHeight / 2)
    }, [canvasRef]);

    useEffect(() => {
        if (!context.current || !canvasRef.current || (centerX && centerY)) return
        context.current.clearRect(0, 0, canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    }, [centerX, centerY])

    const drawCoordinatePlane = useCallback(() => {
        if (!context.current) return

        context.current.lineWidth = 2
        context.current.strokeStyle = 'white'

        context.current.beginPath()
        context.current.moveTo(centerX - step, centerY)
        context.current.lineTo(centerX + step, centerY)
        context.current.moveTo(centerX, centerY - step)
        context.current.lineTo(centerX, centerY + step)
        context.current.stroke()
        context.current.closePath()
    }, [context, centerX, centerY])

    const drawCircle = useCallback(() => {
        if (!context.current) return

        context.current.strokeStyle = 'white'

        context.current.beginPath()
        context.current.arc(centerX, centerY, radius, 0, Math.PI * 2)
        context.current.stroke()
        context.current.closePath()
    }, [context, centerX, centerY])

    useEffect(() => {
        if (!context.current || !centerX || !centerY) return

        drawCoordinatePlane()
        drawCircle()
    }, [drawCoordinatePlane, drawCircle])

    const clearDraws = useCallback(() => {
        if (!context.current || !canvasRef.current) return

        context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        for (let i = 0; i < dotCoordinateHistory.length - 1; i++) {
            const item = dotCoordinateHistory[i]

            const x = centerX + item[0]
            const y = centerY + item[1]

            context.current.clearRect(x - dotRadius, y - dotRadius, dotRadius * 4, dotRadius * 4)
            context.current.clearRect(centerX, centerY, x, y)
        }
    }, [canvasRef, context, dotCoordinateHistory])

    const drawHypotenuse = useCallback(() => {
        if (!context.current || !centerX || !centerY) return

        const newX = centerX + dotX
        const newY = centerY + dotY

        context.current.lineWidth = 2
        context.current.strokeStyle = 'white'

        context.current.beginPath()
        context.current.moveTo(centerX, centerY)
        context.current.lineTo(newX, newY)
        context.current.stroke()
    }, [context, dotX, dotY])

    const drawDot = useCallback(() => {
        if (!context.current || !centerX || !centerY) return

        const newX = centerX + dotX
        const newY = centerY + dotY

        clearDraws()
        drawCoordinatePlane()
        drawCircle()

        context.current.beginPath()
        context.current.fillStyle = 'white'
        context.current.arc(newX, newY, dotRadius, 0, Math.PI * 2)
        context.current.fill()

        drawHypotenuse()

    }, [context, centerX, centerY, dotX, dotY, drawCircle, drawHypotenuse, clearDraws])

    useEffect(() => {
        drawDot()
    }, [drawDot])

    const onMouseMove = useCallback((event: MouseEvent) => {
        if (!context.current) return

        const coefficientX = (centerX - event.offsetX) * -1;
        const coefficientY = (centerY - event.offsetY);
        const diagonal = Math.sqrt(coefficientX ** 2 + coefficientY ** 2);

        const radX = Math.acos(coefficientX / diagonal) * -1;
        const radY = Math.asin(coefficientY / diagonal) * -1;

        const newDotX = radius * Math.cos(radX);
        const newDotY = radius * Math.sin(radY);

        const tan = Math.tan(Math.acos(Math.cos(radX)))

        setSinus(Math.sin(radY))
        setCosinus(Math.cos(radY))
        setTangens(Math.tan(Math.acos(Math.cos(radX))))
        setCtangens(1 / tan)

        setDotCoordinateHistory(prevState => {
            if (prevState.length >= 100) return [[newDotX, newDotY]]
            return [...prevState, [newDotX, newDotY]]
        })

        setDotX(newDotX);
        setDotY(newDotY);
    }, [context, centerY, setDotCoordinateHistory])

    useMouseEvent(onMouseMove, canvasRef)

    return { sinus, cosinus, tangens, ctangens }
}
