import bcrypt from 'bcryptjs';
import { supabase, isSupabaseConfigured } from './supabase';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured) {
      const error = new Error('Erro de comunicação com o servidor. Verifique se as variáveis de ambiente estão configuradas.');
      (error as any).code = 'SUPABASE_NOT_CONFIGURED';
      throw error;
    }

    const passwordHash = await hashPassword(data.password);
    
    console.log('Tentando criar usuário:', { email: data.email, name: data.name });
    
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name: data.name,
        email: data.email,
        password: passwordHash,
        birth_date: data.birthDate,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase ao criar usuário:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('✅ Usuário criado com sucesso:', user.id);
    return user;
  } catch (error: any) {
    console.error('Erro na função createUser:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  if (!isSupabaseConfigured) {
    const error = new Error('Erro de comunicação com o servidor. Verifique se as variáveis de ambiente estão configuradas.');
    (error as any).code = 'SUPABASE_NOT_CONFIGURED';
    throw error;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Credenciais inválidas');
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Credenciais inválidas');
  }

  return user;
}

export async function getUserById(id: string) {
  if (!isSupabaseConfigured) {
    const error = new Error('Erro de comunicação com o servidor. Verifique se as variáveis de ambiente estão configuradas.');
    (error as any).code = 'SUPABASE_NOT_CONFIGURED';
    throw error;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return user;
}

export async function updateUserSubscription(userId: string, status: 'active' | 'cancelled' | 'expired') {
  if (!isSupabaseConfigured) {
    const error = new Error('Erro de comunicação com o servidor. Verifique se as variáveis de ambiente estão configuradas.');
    (error as any).code = 'SUPABASE_NOT_CONFIGURED';
    throw error;
  }

  const { error } = await supabase
    .from('users')
    .update({ subscription_status: status, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}
