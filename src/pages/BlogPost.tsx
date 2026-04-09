import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const mdModules = import.meta.glob('../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '')
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { title: 'Untitled', date: '', tags: [] as string[], description: '' }
  const fm = match[1]
  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))
    return m ? m[1].trim() : ''
  }
  const tagLine = fm.match(/^tags:\s*\[([^\]]+)\]/m)
  const tags = tagLine
    ? tagLine[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''))
    : []
  return { title: get('title'), date: get('date'), tags, description: get('description') }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const { raw, meta } = useMemo(() => {
    const key = `../content/blogs/${slug}.md`
    const raw = mdModules[key]
    if (!raw) return { raw: null, meta: null }
    return { raw, meta: parseFrontmatter(raw) }
  }, [slug])

  if (!raw || !meta) return <Navigate to="/my_blogs" replace />

  const content = stripFrontmatter(raw)

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/my_blogs"
            className="inline-flex items-center gap-2 font-mono text-xs mb-8"
            style={{ color: '#555', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00ff41')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#555')}
          >
            ← cd ../blogs
          </Link>

          {/* Post header */}
          <div
            className="card rounded-xl p-8 mb-10"
            style={{ borderColor: 'rgba(0,255,65,0.15)' }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {meta.tags.map(t => (
                <span
                  key={t}
                  className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(0,255,65,0.05)',
                    border: '1px solid rgba(0,255,65,0.2)',
                    color: '#00ff41',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h1
              className="font-mono font-bold mb-3"
              style={{ color: '#e8e8e8', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', lineHeight: 1.3 }}
            >
              {meta.title}
            </h1>
            <p className="font-mono text-xs" style={{ color: '#444' }}>
              {meta.date}
            </p>
          </div>

          {/* Markdown content */}
          <article className="prose-terminal">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>

          <div
            className="mt-12 pt-8 flex justify-between items-center"
            style={{ borderTop: '1px solid #1a1a1a' }}
          >
            <Link
              to="/my_blogs"
              className="font-mono text-sm"
              style={{ color: '#555', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00ff41')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#555')}
            >
              ← back to blogs
            </Link>
            <p className="font-mono text-xs" style={{ color: '#333' }}>
              EOF
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
