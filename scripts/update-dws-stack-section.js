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

const MARK_START = '<!-- DWS_STACK_START -->'
const MARK_END   = '<!-- DWS_STACK_END -->'

function buildStackMarkdown() {
  return `\n${MARK_START}\n## Technology Stack\n\n<details><summary>Frontend Framework & Build Tools</summary>\n\n- React 18\n- Vite 7\n- TypeScript 5\n\n</details>\n\n<details><summary>UI Components & Styling</summary>\n\n- Radix UI\n- Tailwind CSS 3\n- Lucide React (icons)\n- Framer Motion (animations)\n\n</details>\n\n<details><summary>State Management & Data Fetching</summary>\n\n- TanStack React Query v5\n- Apollo Client (GraphQL)\n- RxJS (where needed)\n\n</details>\n\n<details><summary>Authentication & Cloud Services</summary>\n\n- Azure MSAL (browser & react)\n- Supabase JS (data/auth)\n- Azure Storage Blob SDK\n\n</details>\n\n<details><summary>Forms & Validation</summary>\n\n- React Hook Form\n- Yup\n- @hookform/resolvers\n\n</details>\n\n<details><summary>Content & Rich Text</summary>\n\n- React Markdown (remark/rehype)\n- TipTap (rich editor)\n\n</details>\n\n<details><summary>Maps & Location Services</summary>\n\n- React Leaflet + Leaflet\n- Mapbox GL\n\n</details>\n\n<details><summary>Data Visualization</summary>\n\n- Recharts\n\n</details>\n\n<details><summary>Calendars & Scheduling</summary>\n\n- FullCalendar (daygrid, timegrid, interaction)\n- react-day-picker\n\n</details>\n\n<details><summary>Development Tools</summary>\n\n- Vitest\n- ESLint + @typescript-eslint\n- Vercel Functions (@vercel/node)\n\n</details>\n\n<details><summary>Additional Libraries</summary>\n\n- date-fns\n- clsx, class-variance-authority, tailwind-merge\n- cmdk (command palette), sonner (toasts)\n\n</details>\n\n<details><summary>Backend & Platform</summary>\n\n- PostgreSQL (Supabase)\n- Supabase JS (data access)\n- Vercel Serverless Functions (@vercel/node)\n- Azure AD (MSAL) for SSO\n- Azure Blob Storage (documents)\n- Vercel (CI/CD & hosting)\n\n</details>\n\n${MARK_END}\n`
}

function upsertSection(oldBody) {
  const body = String(oldBody || '')
  const block = buildStackMarkdown()
  if (body.includes(MARK_START) && body.includes(MARK_END)) {
    const pre = body.split(MARK_START)[0]
    const post = body.split(MARK_END)[1] || ''
    return `${pre}${block}${post}`
  }
  // If a "## Technology Stack" exists without markers, append new block at end
  return `${body}\n${block}`
}

async function main() {
  // Try to find DWS Blueprint by title; fallback to any Blueprint with 'DWS' in title
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

  const nextBody = upsertSection(row.body || '')
  const { error: updErr } = await sb
    .from('guides')
    .update({ body: nextBody, last_updated_at: new Date().toISOString() })
    .eq('id', row.id)
  if (updErr) throw updErr
  console.log('✅ Updated DWS Blueprint stack section')
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
