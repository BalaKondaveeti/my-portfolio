import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MatrixCanvas from './MatrixCanvas'
import { FiGithub, FiLinkedin, FiBookOpen, FiMail } from 'react-icons/fi'

const PROFILE_IMG =
  'https://media.licdn.com/dms/image/v2/D5603AQH0dnjNggFClw/profile-displayphoto-scale_400_400/B56Z0od7HQK8Ag-/0/1774500427539?e=1777507200&v=beta&t=2dfsKvLk_6Mx3vcDSRuo-ATejS62ulW86hOUQtnozsw'

const TAGS = [
  'Distributed Systems',
  'Database Internals',
  'High-Throughput Systems',
  'C++ / LLVM',
  'Low Level Optimizations',
  'Performance Engineering',
  'React / TypeScript',
  'Python · Java · FastAPI',
  'AWS',
]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      <MatrixCanvas />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.85) 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-32">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="shrink-0"
          >
            <div
              className="relative rounded-full"
              style={{ padding: 3, background: 'linear-gradient(135deg, #00ff41, #00d4ff)' }}
            >
              <img
                src={PROFILE_IMG}
                alt="Bala Kondaveeti"
                className="rounded-full object-cover"
                style={{ width: 160, height: 160, display: 'block', background: '#0a0a0a' }}
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 8, height: 8,
                  background: '#00ff41',
                  boxShadow: '0 0 6px #00ff41',
                  animation: 'pulse 2s infinite',
                }}
              />
              <span className="font-mono text-xs" style={{ color: '#00ff41' }}>
                available
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <p className="font-mono text-sm mb-3" style={{ color: '#00ff41' }}>
              $ whoami
            </p>
            <h1
              className="font-mono font-bold leading-tight mb-2"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#e8e8e8' }}
            >
              Bala{' '}
              <span className="glow-green" style={{ color: '#00ff41' }}>
                Kondaveeti
              </span>
            </h1>
            <p
              className="font-mono mb-6"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#00d4ff' }}
            >
              Distributed Systems · Database Internals · Low Level · Full Stack
            </p>

            <p
              className="mb-8 max-w-2xl leading-relaxed"
              style={{ color: '#999', fontSize: '0.95rem' }}
            >
              Working close to the metal —{' '}
              <span style={{ color: '#e8e8e8' }}>LLVM IR, C++ compiler internals, CPU cache behavior,
              precompiled headers, and instruction-level optimizations</span>.
              That hardware-aware foundation drives the performance gains:{' '}
              <span style={{ color: '#00ff41' }}>99.6% P90 latency reduction</span>, 50k+ compiled
              segments/sec across 34 AWS regions, 83% fewer fleet-wide failures. Full stack when
              needed — <span style={{ color: '#e8e8e8' }}>C++, Python, Java, TypeScript, React, FastAPI</span>.
              Previously at{' '}
              <span style={{ color: '#e8e8e8' }}>AWS Redshift</span> &{' '}
              <span style={{ color: '#e8e8e8' }}>Amazon Robotics</span>.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {TAGS.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 rounded"
                  style={{
                    border: '1px solid rgba(0,255,65,0.25)',
                    color: '#00ff41',
                    background: 'rgba(0,255,65,0.05)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA buttons — icon only for social, label for contact */}
            <div className="flex flex-wrap gap-3">
              {/* GitHub — white icon */}
              <a
                href="https://github.com/BalaKondaveeti"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="flex items-center justify-center rounded transition-all duration-200"
                style={{
                  width: 40, height: 40,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(255,255,255,0.14)'
                  el.style.borderColor = 'rgba(255,255,255,0.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(255,255,255,0.06)'
                  el.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
              >
                <FiGithub size={17} />
              </a>

              {/* LinkedIn — blue icon */}
              <a
                href="https://www.linkedin.com/in/bala-subramanyam/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="flex items-center justify-center rounded transition-all duration-200"
                style={{
                  width: 40, height: 40,
                  background: 'rgba(0,212,255,0.06)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  color: '#00d4ff',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(0,212,255,0.16)'
                  el.style.boxShadow = '0 0 14px rgba(0,212,255,0.2)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(0,212,255,0.06)'
                  el.style.boxShadow = 'none'
                }}
              >
                <FiLinkedin size={17} />
              </a>

              {/* Blogs — green icon */}
              <button
                onClick={() => navigate('/my_blogs')}
                title="Blogs"
                className="flex items-center justify-center rounded transition-all duration-200"
                style={{
                  width: 40, height: 40,
                  background: 'rgba(0,255,65,0.06)',
                  border: '1px solid rgba(0,255,65,0.3)',
                  color: '#00ff41',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(0,255,65,0.16)'
                  el.style.boxShadow = '0 0 14px rgba(0,255,65,0.2)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(0,255,65,0.06)'
                  el.style.boxShadow = 'none'
                }}
              >
                <FiBookOpen size={17} />
              </button>

              {/* Contact — labeled */}
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 font-mono text-sm px-4 py-2.5 rounded transition-all duration-200"
                style={{
                  background: 'rgba(0,255,65,0.1)',
                  border: '1px solid rgba(0,255,65,0.5)',
                  color: '#00ff41',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(0,255,65,0.2)'
                  el.style.boxShadow = '0 0 16px rgba(0,255,65,0.25)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(0,255,65,0.1)'
                  el.style.boxShadow = 'none'
                }}
              >
                <FiMail size={15} />
                Contact
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-mono text-xs" style={{ color: '#333' }}>scroll</span>
          <div
            style={{
              width: 1, height: 40,
              background: 'linear-gradient(to bottom, #00ff41, transparent)',
              animation: 'pulse 2s infinite',
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
