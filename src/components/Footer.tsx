export default function Footer() {
  return (
    <footer
      className="py-8 text-center"
      style={{ borderTop: '1px solid #1a1a1a', background: '#0a0a0a' }}
    >
      <p className="font-mono text-xs" style={{ color: '#555' }}>
        bala@systems:~$ <span style={{ color: '#00ff41' }}>exit 0</span>
        <span style={{ marginLeft: '1.5rem', color: '#444' }}>
          built with Vite + React + TypeScript
        </span>
      </p>
    </footer>
  )
}
