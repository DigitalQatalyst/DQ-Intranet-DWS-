import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getGuidelinesImages() {
  const { data: guidelines } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .or('domain.ilike.%guideline%,guide_type.ilike.%guideline%,title.ilike.%guideline%')
    .order('title')
  
  console.log('Guidelines images that can be used as reference:\n')
  guidelines?.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title}`)
    console.log(`   ${g.hero_image_url}\n`)
  })
}

getGuidelinesImages().catch(console.error)

