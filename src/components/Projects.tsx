import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi'

const GITHUB_USERNAME = 'balakondaveeti'

interface GHRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  topics: string[]
  language: string | null
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  'C++': '#f34b7d',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
}

export default function Projects() {
  const [repos, setRepos] = useState<GHRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data: GHRepo[]) => {
        setRepos(data.filter(r => !r.name.includes('.')).slice(0, 6))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <section id="projects" className="py-24" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#00ff41' }}>
            $ git log --oneline ./projects
          </p>
          <h2
            className="font-mono font-bold mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#e8e8e8' }}
          >
            Recent Work
          </h2>
          <p className="mb-10" style={{ color: '#555', fontSize: '0.875rem' }}>
            Latest repos — sorted by last pushed
          </p>
        </motion.div>

        {loading && (
          <p className="font-mono text-sm" style={{ color: '#555' }}>
            fetching repos<span className="terminal-cursor" />
          </p>
        )}

        {error && (
          <p className="font-mono text-sm" style={{ color: '#ff4444' }}>
            ✗ GitHub API unreachable. Check rate limits or set GITHUB_USERNAME.
          </p>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="card rounded-xl p-5 flex flex-col gap-3 group"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FiGithub size={14} style={{ color: '#555' }} />
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: '#e8e8e8', transition: 'color 0.2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#00ff41')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#e8e8e8')}
                    >
                      {repo.name}
                    </span>
                  </div>
                  <FiExternalLink size={12} style={{ color: '#333' }} />
                </div>

                <p className="text-xs leading-relaxed flex-1" style={{ color: '#666' }}>
                  {repo.description || 'No description.'}
                </p>

                <div className="flex flex-wrap gap-1 mb-1">
                  {(repo.topics || []).slice(0, 4).map(t => (
                    <span
                      key={t}
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#1a1a1a', color: '#555', border: '1px solid #1f1f1f' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid #1a1a1a' }}>
                  {repo.language && (
                    <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: '#555' }}>
                      <span
                        className="inline-block rounded-full"
                        style={{ width: 8, height: 8, background: LANG_COLORS[repo.language] ?? '#888' }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono text-xs" style={{ color: '#555' }}>
                    <FiStar size={11} /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs" style={{ color: '#555' }}>
                    <FiGitBranch size={11} /> {repo.forks_count}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
