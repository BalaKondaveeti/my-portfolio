import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  { text: '> BIOS v2.4.1 initializing...', delay: 0 },
  { text: '> CPU: Systems Engineer [4 cores @ ∞ GHz]', delay: 120 },
  { text: '> Loading distributed systems kernel...', delay: 240 },
  { text: '> Mounting C++ pipeline modules... [OK]', delay: 380 },
  { text: '> Connecting to AWS us-east-1... [OK]', delay: 520 },
  { text: '> Loading LLVM compilation engine...', delay: 660 },
  { text: '> P90 latency: 35s → 150ms [OPTIMIZED]', delay: 820 },
  { text: '> Initializing fault-tolerant consensus...', delay: 980 },
  { text: '> Database internals: ONLINE', delay: 1120 },
  { text: '> High-throughput pipelines: READY', delay: 1260 },
  { text: '────────────────────────────────────', delay: 1400 },
  { text: '> SYSTEM BOOT COMPLETE. Welcome.', delay: 1540 },
]

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
      timers.push(t)
    })

    const endTimer = setTimeout(() => setDone(true), 2100)
    timers.push(endTimer)

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: '#0a0a0a' }}
        >
          <div
            className="w-full max-w-2xl px-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <div className="mb-6 text-xs" style={{ color: '#444' }}>
              BALA-PORTFOLIO OS v1.0.0 — kernel 6.1.0-distributed
            </div>
            <div className="space-y-1">
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.15 }}
                  className="text-sm"
                  style={{
                    color: line.text.includes('OPTIMIZED') || line.text.includes('COMPLETE')
                      ? '#00ff41'
                      : line.text.includes('ONLINE') || line.text.includes('READY') || line.text.includes('[OK]')
                      ? '#00d4ff'
                      : line.text.startsWith('────')
                      ? '#1a1a1a'
                      : '#888',
                  }}
                >
                  {line.text}
                  {i === visibleLines[visibleLines.length - 1] && i < BOOT_LINES.length - 1 && (
                    <span className="terminal-cursor" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
