import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let cachedAdminClient: ReturnType<typeof createSupabaseClient> | null = null

export function createAdminClient() {
  if (cachedAdminClient) {
    return cachedAdminClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno")
  }

  cachedAdminClient = createSupabaseClient(url, serviceRoleKey)
  return cachedAdminClient
}
