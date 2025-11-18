export interface SupabaseClientConfig {
  url?: string;
  anonKey?: string;
}

export function createServerClient(_config?: SupabaseClientConfig) {
  // TODO: Stage 2 – initialize Supabase server client using service role for auth + DB access.
  throw new Error('Supabase server client not configured yet.');
}
