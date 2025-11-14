import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email } = body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, email, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    );
  }
}
