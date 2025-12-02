import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const TECH_START = '<!-- DWS_STACK_START -->'
const TECH_END   = '<!-- DWS_STACK_END -->'

// Extract text content from <details> blocks; ignore images/emojis; keep summary and description
function extractStackDetails(md) {
  const out = []
  const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi
  let match
  while ((match = detailsRegex.exec(md)) !== null) {
    const block = match[1]
    // Extract summary
    const summaryMatch = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)
    const summary = summaryMatch ? summaryMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    // Extract remaining text (paragraphs, lists, plain text), ignoring images
    const text = block
      .replace(/<summary[^>]*>[\s\S]*?<\/summary>/gi, '')
      .replace(/<img[^>]*>/gi, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (summary && text) {
      out.push({ summary, text })
    }
  }
  return out
}

// Build a new Technology Stack block that includes the extracted descriptions
function buildTechStackWithDescriptions(existingDetails) {
  // Base tools list (same as before)
  const sections = [
    {
      title: 'Frontend Framework & Build Tools',
      tools: '- React 18\n- Vite 7\n- TypeScript 5'
    },
    {
      title: 'UI Components & Styling',
      tools: '- Radix UI\n- Tailwind CSS 3\n- Lucide React (icons)\n- Framer Motion (animations)'
    },
    {
      title: 'State Management & Data Fetching',
      tools: '- TanStack React Query v5\n- Apollo Client (GraphQL)\n- RxJS (where needed)'
    },
    {
      title: 'Authentication & Cloud Services',
      tools: '- Azure MSAL (browser & react)\n- Supabase JS (data/auth)\n- Azure Storage Blob SDK'
    },
    {
      title: 'Forms & Validation',
      tools: '- React Hook Form\n- Yup\n- @hookform/resolvers'
    },
    {
      title: 'Content & Rich Text',
      tools: '- React Markdown (remark/rehype)\n- TipTap (rich editor)'
    },
    {
      title: 'Maps & Location Services',
      tools: '- React Leaflet + Leaflet\n- Mapbox GL'
    },
    {
      title: 'Data Visualization',
      tools: '- Recharts'
    },
    {
      title: 'Calendars & Scheduling',
      tools: '- FullCalendar (daygrid, timegrid, interaction)\n- react-day-picker'
    },
    {
      title: 'Development Tools',
      tools: '- Vitest\n- ESLint + @typescript-eslint\n- Vercel Functions (@vercel/node)'
    },
    {
      title: 'Additional Libraries',
      tools: '- date-fns\n- clsx, class-variance-authority, tailwind-merge\n- cmdk (command palette), sonner (toasts)'
    },
    {
      title: 'Backend & Platform',
      tools: '- PostgreSQL (Supabase)\n- Supabase JS (data access)\n- Vercel Serverless Functions (@vercel/node)\n- Azure AD (MSAL) for SSO\n- Azure Blob Storage (documents)\n- Vercel (CI/CD & hosting)'
    }
  ]

  let md = `\n${TECH_START}\n## Technology Stack\n\n`
  for (const sec of sections) {
    md += `<details><summary>${sec.title}</summary>\n\n${sec.tools}\n\n`
    // Append the extracted description if it matches this category
    const found = existingDetails.find(d => d.summary.toLowerCase().includes(sec.title.toLowerCase().split(' ')[0]))
    if (found && found.text) {
      md += `${found.text}\n\n`
    }
    md += `</details>\n\n`
  }
  md += `${TECH_END}\n`
  return md
}

function removeOldStackSection(body) {
  // Remove any top-level section titled "stack" (case-insensitive) and its content
  return body.replace(/##?\s*stack\s*\n[\s\S]*?(?=\n##|$)/gi, '').replace(/\n{3,}/g, '\n\n')
}

function replaceTechStack(body, newBlock) {
  const b = String(body || '')
  if (b.includes(TECH_START) && b.includes(TECH_END)) {
    const pre = b.split(TECH_START)[0]
    const post = b.split(TECH_END)[1] || ''
    return `${pre}${newBlock}${post}`
  }
  // If no markers yet, append at end
  return `${b}\n${newBlock}`
}

async function main() {
  // Find DWS Blueprint
  let { data: row, error } = await sb
    .from('guides')
    .select('id, title, domain, guide_type, body')
    .eq('status', 'Approved')
    .eq('title', 'DWS Blueprint')
    .maybeSingle()
  if (error) throw error
  if (!row) {
    const { data: rows2, error: e2 } = await sb
      .from('guides')
      .select('id, title, domain, guide_type, body')
      .eq('status', 'Approved')
      .ilike('domain', 'blueprint')
      .ilike('title', '%dws%')
      .limit(1)
    if (e2) throw e2
    row = (rows2 && rows2[0]) || null
  }
  if (!row) {
    console.log('⚠️ DWS Blueprint not found')
    return
  }

  const oldBody = String(row.body || '')
  const existingDetails = extractStackDetails(oldBody)
  const newTechBlock = buildTechStackWithDescriptions(existingDetails)
  const withoutOldStack = removeOldStackSection(oldBody)
  const finalBody = replaceTechStack(withoutOldStack, newTechBlock)

  const { error: updErr } = await sb
    .from('guides')
    .update({ body: finalBody, last_updated_at: new Date().toISOString() })
    .eq('id', row.id)
  if (updErr) throw updErr
  console.log('✅ Merged old stack descriptions into Technology Stack and removed old stack section')
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
