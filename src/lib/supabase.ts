import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se está configurado
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key';

// Criar cliente apenas se configurado corretamente
// Se não configurado, retorna um objeto mock para evitar erros de inicialização
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signUp: async () => { throw new Error('Supabase não configurado. Configure as variáveis de ambiente.'); },
        signInWithPassword: async () => { throw new Error('Supabase não configurado. Configure as variáveis de ambiente.'); },
        signOut: async () => { throw new Error('Supabase não configurado. Configure as variáveis de ambiente.'); },
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ data: null, error: new Error('Supabase não configurado') }),
        insert: () => ({ data: null, error: new Error('Supabase não configurado') }),
        update: () => ({ data: null, error: new Error('Supabase não configurado') }),
        delete: () => ({ data: null, error: new Error('Supabase não configurado') })
      })
    } as any;

if (typeof window === 'undefined') {
  // Logs apenas no servidor
  if (isSupabaseConfigured) {
    console.log('✅ Supabase configurado corretamente');
  } else {
    console.warn('⚠️ Supabase NÃO configurado - operações de banco de dados não funcionarão');
    console.warn('Configure: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}
