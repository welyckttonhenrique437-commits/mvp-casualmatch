import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verificar configuração ANTES de processar
    if (!isSupabaseConfigured) {
      console.error('❌ Tentativa de cadastro sem Supabase configurado');
      return NextResponse.json(
        { 
          error: 'Serviço temporariamente indisponível. Configure as variáveis de ambiente do Supabase.',
          needsConfig: true 
        },
        { status: 503 }
      );
    }

    // Importar dinamicamente apenas se configurado
    const { createUser } = await import('@/lib/auth');

    const body = await request.json();
    const { name, email, password, birthDate } = body;

    // Validações
    if (!name || !email || !password || !birthDate) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      );
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    // Criar usuário
    const user = await createUser({ name, email, password, birthDate });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error('Erro detalhado ao criar usuário:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    // Erros específicos do Supabase
    if (error.code === '23505' || error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      );
    }

    // Erro de conexão com Supabase
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return NextResponse.json(
        { error: 'Erro de conexão. Verifique sua internet e tente novamente.' },
        { status: 503 }
      );
    }

    // Erro de configuração
    if (error.message?.includes('não configurado') || error.message?.includes('variáveis de ambiente')) {
      return NextResponse.json(
        { 
          error: 'Serviço temporariamente indisponível. Configure as variáveis de ambiente do Supabase.',
          needsConfig: true 
        },
        { status: 503 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: error.message || 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    );
  }
}
