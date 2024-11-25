import { createClient } from '@supabase/supabase-js'

if (!process.env.BQ_NEXT_PUBLIC_SUPABASE_URL) 
  throw new Error('Missing env.BQ_NEXT_PUBLIC_SUPABASE_URL')
if (!process.env.BQ_NEXT_PUBLIC_SUPABASE_ANON_KEY) 
  throw new Error('Missing env.BQ_NEXT_PUBLIC_SUPABASE_ANON_KEY')

export const supabase = createClient(
  process.env.BQ_NEXT_PUBLIC_SUPABASE_URL,
  process.env.BQ_NEXT_PUBLIC_SUPABASE_ANON_KEY
) 