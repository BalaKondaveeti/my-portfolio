import { useEffect, useRef } from 'react'

// Each falling stream picks one script and keeps it until it reaches the bottom.
const SCRIPTS = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // English
  'अआइईउऊएऐओऔकखगघचछजझटठडढतथदधनपफबभमयरलवशषसह', // Hindi
  'అఆఇఈఉఊఎఏఐఒఓఔకఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళ', // Telugu
  'அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறனஜஷஸஹ', // Tamil
  '数据系统代码编译内存网络并行计算分布式节点进程线速度云光电学智龙山水火风天地人心道', // Chinese
].map((s) => [...s])

const FONT_FAMILIES = ['Noto Sans Devanagari', 'Noto Sans Telugu', 'Noto Sans Tamil', 'Noto Sans SC']
const FONT_STACK = `'JetBrains Mono', ${FONT_FAMILIES.map((f) => `'${f}'`).join(', ')}, monospace`

// Load just the glyphs the rain uses (Google Fonts `text=` subsetting keeps this to a few KB).
function loadRainFonts() {
  const id = 'matrix-rain-fonts'
  if (document.getElementById(id)) return
  const text = encodeURIComponent([...new Set(SCRIPTS.slice(1).flat())].join(''))
  const families = FONT_FAMILIES.map((f) => `family=${f.replace(/ /g, '+')}`).join('&')
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${families}&text=${text}&display=swap`
  document.head.appendChild(link)
}

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    loadRainFonts()

    const FONT_SIZE = 16
    const COL_W = 19 // Telugu / Tamil / Chinese glyphs are wider than Latin
    const ROW_H = 19 // room for tall Indic glyphs
    const COLOR = '#8dffb0'
    const HEAD = '#e6fff0'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const FPS = reduced ? 8 : 20

    type Stream = { y: number; script: string[]; last: string }
    let streams: Stream[] = []
    let animId: number
    let lastTime = 0

    const pickScript = () => SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)]

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const n = Math.floor(canvas.width / COL_W)
      streams = Array.from({ length: n }, (_, i) =>
        streams[i] ?? { y: Math.floor(Math.random() * -40), script: pickScript(), last: '' },
      )
    }

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw)
      if (now - lastTime < 1000 / FPS) return
      lastTime = now

      ctx.fillStyle = 'rgba(10,10,10,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px ${FONT_STACK}`
      ctx.textBaseline = 'bottom'

      for (let i = 0; i < streams.length; i++) {
        const s = streams[i]
        const x = i * COL_W
        // turn the previous head green, then draw the new bright head below it
        if (s.last && s.y > 1) {
          ctx.fillStyle = 'rgba(10,10,10,1)'
          ctx.fillRect(x, (s.y - 2) * ROW_H, COL_W, ROW_H)
          ctx.fillStyle = COLOR
          ctx.fillText(s.last, x, (s.y - 1) * ROW_H)
        }
        const char = s.script[Math.floor(Math.random() * s.script.length)]
        if (s.y > 0) {
          ctx.fillStyle = HEAD
          ctx.fillText(char, x, s.y * ROW_H)
        }
        s.last = char
        if (s.y * ROW_H > canvas.height && Math.random() > 0.975) {
          s.y = 0
          s.script = pickScript()
          s.last = ''
        }
        s.y++
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
      className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
      style={{ display: 'block' }}
    />
  )
}
