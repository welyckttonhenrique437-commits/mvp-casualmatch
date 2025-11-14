import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await loginUser(email, password);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer login' },
      { status: 401 }
    );
  }
}
