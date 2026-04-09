import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Vite glob — picks up all .md files at build time
const mdModules = import.meta.glob('../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
}

function parseFrontmatter(raw: string): Omit<PostMeta, 'slug'> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { title: 'Untitled', date: '', tags: [], description: '' }
  const fm = match[1]
  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))
    return m ? m[1].trim() : ''
  }
  const tagLine = fm.match(/^tags:\s*\[([^\]]+)\]/m)
  const tags = tagLine
    ? tagLine[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''))
    : []
  return {
    title: get('title'),
    date: get('date'),
    tags,
    description: get('description'),
  }
}

export default function BlogList() {
  const posts: PostMeta[] = useMemo(() => {
    return Object.entries(mdModules)
      .map(([path, raw]) => {
        const slug = path.replace('../content/blogs/', '').replace('.md', '')
        return { slug, ...parseFrontmatter(raw) }
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1))
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs mb-8"
            style={{ color: '#555', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00ff41')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#555')}
          >
            ← cd ~/home
          </Link>
          <p className="font-mono text-sm mb-2 mt-2" style={{ color: '#00ff41' }}>
            $ ls ./my_blogs
          </p>
          <h1
            className="font-mono font-bold mb-10"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: '#e8e8e8' }}
          >
            Terminal Blog
          </h1>
        </motion.div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Link
                to={`/my_blogs/${post.slug}`}
                className="card rounded-xl p-6 block group"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <h2
                    className="font-mono font-semibold group-hover:text-[#00ff41] transition-colors"
                    style={{ color: '#e8e8e8', fontSize: '1rem', lineHeight: 1.4 }}
                  >
                    {post.title}
                  </h2>
                  <span className="font-mono text-xs shrink-0" style={{ color: '#444' }}>
                    {post.date}
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: '#666', lineHeight: 1.6 }}>
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(t => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(0,255,65,0.05)',
                        border: '1px solid rgba(0,255,65,0.15)',
                        color: '#00ff41',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
