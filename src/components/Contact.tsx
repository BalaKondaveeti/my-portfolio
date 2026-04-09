import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID  = 'service_47rxv4r'
const EMAILJS_TEMPLATE_ID = 'template_zf1z9ac'
const EMAILJS_PUBLIC_KEY  = 'ooRbjZkFfEErh4Zft'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [fields, setFields] = useState({ name: '', email: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      setStatus('sent')
      setFields({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #1f1f1f',
    borderRadius: 6,
    padding: '10px 14px',
    color: '#e8e8e8',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const INFO = [
    { label: 'location', value: 'Bay Area, CA · Remote OK' },
    {
      label: 'open_to',
      value: 'DB Internals · Low-level Perf · Systems · Infra · Full Stack · SWE',
    },
    { label: 'response_time', value: '< 2h' },
  ]

  return (
    <section id="contact" className="py-24" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#00ff41' }}>
            $ ping bala
          </p>
          <h2
            className="font-mono font-bold mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#e8e8e8' }}
          >
            Contact
          </h2>
          <p className="mb-12" style={{ color: '#666', fontSize: '0.9rem' }}>
            Open to distributed systems, performance, infra, and full-stack roles. Let's talk.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {INFO.map(item => (
              <div key={item.label}>
                <p className="font-mono text-xs mb-1" style={{ color: '#444' }}>
                  <span style={{ color: '#00ff41' }}>$</span> {item.label}
                </p>
                <p className="font-mono text-sm" style={{ color: '#e8e8e8' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card rounded-xl p-7"
          >
            {/* Terminal header */}
            <div
              className="flex items-center gap-2 mb-6 pb-4"
              style={{ borderBottom: '1px solid #1a1a1a' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <span className="font-mono text-xs ml-3" style={{ color: '#444' }}>contact.sh</span>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs mb-1.5" style={{ color: '#00ff41' }}>
                  $name
                </label>
                <input
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  required
                  placeholder="your_name"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.4)')}
                  onBlur={e => (e.target.style.borderColor = '#1f1f1f')}
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1.5" style={{ color: '#00ff41' }}>
                  $email
                </label>
                <input
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.4)')}
                  onBlur={e => (e.target.style.borderColor = '#1f1f1f')}
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1.5" style={{ color: '#00ff41' }}>
                  $message
                </label>
                <textarea
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Let's build something fast..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.4)')}
                  onBlur={e => (e.target.style.borderColor = '#1f1f1f')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full font-mono text-sm py-2.5 rounded transition-all duration-200"
                style={{
                  background: status === 'sent' ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.08)',
                  border: '1px solid rgba(0,255,65,0.4)',
                  color: '#00ff41',
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                }}
              >
                {status === 'idle'    && '> send_message()'}
                {status === 'sending' && '> transmitting...'}
                {status === 'sent'    && '> message_delivered ✓'}
                {status === 'error'   && '> error — retry?'}
              </button>

              {status === 'error' && (
                <p className="font-mono text-xs" style={{ color: '#ff4444' }}>
                  ✗ Failed to send. Check network or EmailJS dashboard.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
