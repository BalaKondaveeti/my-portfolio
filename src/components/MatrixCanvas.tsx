import { useEffect, useRef } from 'react'

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const FONT_SIZE = 13
    const COLOR = '#00ff41'
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'

    let cols: number[]
    let animId: number
    let lastTime = 0
    const FPS = 20

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Array(Math.floor(canvas.width / FONT_SIZE)).fill(1)
    }

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw)
      if (now - lastTime < 1000 / FPS) return
      lastTime = now

      ctx.fillStyle = 'rgba(10,10,10,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = COLOR
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`

      for (let i = 0; i < cols.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(char, i * FONT_SIZE, cols[i] * FONT_SIZE)
        if (cols[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          cols[i] = 0
        }
        cols[i]++
      }
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      style={{ display: 'block' }}
    />
  )
}
