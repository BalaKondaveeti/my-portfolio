import { motion } from 'framer-motion'
import { useState } from 'react'

const JOBS = [
  {
    title: 'Software Engineer',
    company: 'Amazon Web Services — RedshiftDB',
    period: 'Aug 2024 – Present',
    stack: ['C++', 'Python', 'LLVM', 'Ruby', 'Distributed Systems'],
    color: '#00ff41',
    bullets: [
      'Engineered LLVM-based SQL Query Compilation Engine, cutting P90 cold query latency by 99.6% (35s → 150ms) and recovering $3.3M+ in revenue.',
      'Extended Redshift string limits by 250× (16MB) by refactoring 18 core C++ string APIs, driving $4.8M ARR.',
      'Architected Compilation-as-a-Service on AWS Fargate, processing 50k+ segments/sec across 34 regions.',
      'Reduced compilation failures by 83% fleet-wide by re-architecting bloated precompiled headers using PImpl idiom.',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Amazon Robotics — Simulations',
    period: 'Jul 2023 – Aug 2024',
    stack: ['Java', 'Python', 'AWS DynamoDB', 'AWS Lambda', 'React', 'Kubernetes'],
    color: '#00d4ff',
    bullets: [
      'Architected simulations infrastructure with serverless state-management system, eliminating critical race conditions.',
      'Engineered synthetic AI data generation pipeline reducing manual training data efforts by 40%.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'ASU Decision Theater',
    period: 'Jan 2023 – Jul 2023',
    stack: ['Python', 'React', 'OpenCV', 'Signal Processing'],
    color: '#ffb000',
    bullets: [
      'Engineered CV signal processing algorithms (PPG) from scratch to extract heart rate from raw camera feeds with >95% accuracy.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Cerner Corporation (Oracle Health)',
    period: 'Jan 2022 – Aug 2022',
    stack: ['Java', 'Kafka', 'React', 'Oracle Cloud', 'Microservices'],
    color: '#9d4edd',
    bullets: [
      'Engineered full-stack EHR microservices using Java, Kafka, and React on Oracle Cloud.',
    ],
  },
  {
    title: 'IoT & Mobile App Developer',
    company: 'BDD Startup (acq. by Sedin Technologies)',
    period: 'Pre-2022',
    stack: ['IoT', 'Mobile', 'Java', 'Android', 'ERP'],
    color: '#ff6b35',
    bullets: [
      'Built enterprise IoT and mobile application solutions for clients as part of a startup later acquired by Sedin Technologies.',
      'Led development of "Nabard" — a complete end-to-end ERP system covering procurement, inventory, HR, and reporting modules.',
    ],
  },
  {
    title: 'Mobile App Developer',
    company: 'Nation Rise (Independent)',
    period: 'Side Project',
    stack: ['Android', 'Java', 'Mobile', 'App Store'],
    color: '#a855f7',
    bullets: [
      'Independently developed and published mobile applications on app stores under the Nation Rise developer account.',
      'Built for fun — exploring mobile UX, native APIs, and app store publishing end-to-end.',
    ],
  },
]

export default function Experience() {
  const [active, setActive] = useState(0)

  return (
    <section id="experience" className="py-24" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#00ff41' }}>
            $ cat experience.log
          </p>
          <h2
            className="font-mono font-bold mb-12"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#e8e8e8' }}
          >
            Work Experience
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Company tabs */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:w-60 shrink-0">
            {JOBS.map((job, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="font-mono text-xs text-left px-4 py-3 rounded transition-all duration-200 whitespace-nowrap lg:whitespace-normal"
                style={{
                  background: active === i ? 'rgba(0,255,65,0.06)' : 'transparent',
                  color: active === i ? job.color : '#555',
                  border: active === i ? `1px solid rgba(0,255,65,0.15)` : '1px solid transparent',
                  borderLeft: active === i ? `3px solid ${job.color}` : '3px solid #1a1a1a',
                  cursor: 'pointer',
                }}
              >
                {job.company.split('(')[0].split('—')[0].trim()}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 card rounded-xl p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3
                  className="font-mono font-semibold mb-1"
                  style={{ color: '#e8e8e8', fontSize: '1.1rem' }}
                >
                  {JOBS[active].title}
                </h3>
                <p className="font-mono text-sm" style={{ color: JOBS[active].color }}>
                  @ {JOBS[active].company}
                </p>
              </div>
              <span
                className="font-mono text-xs px-3 py-1 rounded"
                style={{ border: '1px solid #2a2a2a', color: '#666', background: '#0d0d0d' }}
              >
                {JOBS[active].period}
              </span>
            </div>

            {/* Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {JOBS[active].stack.map(s => (
                <span
                  key={s}
                  className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: '#00d4ff',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Bullets */}
            <ul className="space-y-4">
              {JOBS[active].bullets.map((b, i) => (
                <li key={i} className="flex gap-3" style={{ color: '#999', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  <span className="shrink-0 font-mono" style={{ color: JOBS[active].color, marginTop: 2 }}>
                    ▸
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
