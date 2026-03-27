import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    const includeBody = request.nextUrl.searchParams.get('include') === 'body'

    let query = supabase.from('guides').select('*')
    
    if (includeBody) {
      query = query.select('id, slug, title, summary, hero_image_url, domain, guide_type, function_area, sub_domain, body, estimated_time_min, last_updated_at')
    }

    const { data, error } = await query.eq('slug', slug).maybeSingle()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      // Try by ID if slug doesn't match
      const { data: dataById, error: errorById } = await supabase
        .from('guides')
        .select('*')
        .eq('id', slug)
        .maybeSingle()

      if (errorById) {
        console.error('Supabase error (by ID):', errorById)
        return NextResponse.json({ error: errorById.message }, { status: 500 })
      }

      if (!dataById) {
        return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
      }

      return NextResponse.json(dataById)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
