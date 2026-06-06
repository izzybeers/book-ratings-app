import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_supabase_endpoint
const supabaseKey = process.env.REACT_APP_supabase_api_key

console.log(supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey)