import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscription } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Kiwify envia os seguintes eventos principais:
    // - order.paid: Pagamento confirmado
    // - order.refunded: Pagamento reembolsado
    // - subscription.cancelled: Assinatura cancelada
    
    const { event, data } = body;
    
    if (!event || !data) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo e-mail
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.Customer?.email)
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error('Usuário não encontrado:', data.Customer?.email);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Registrar transação
    await supabase.from('transactions').insert({
      user_id: user.id,
      transaction_date: new Date().toISOString(),
      status: event === 'order.paid' ? 'paid' : event === 'order.refunded' ? 'refunded' : 'cancelled',
      amount: data.order_amount || 19.90,
      kiwify_transaction_id: data.order_id || data.subscription_id,
    });

    // Atualizar status da assinatura do usuário
    switch (event) {
      case 'order.paid':
        await updateUserSubscription(user.id, 'active');
        break;
      
      case 'order.refunded':
        await updateUserSubscription(user.id, 'cancelled');
        break;
      
      case 'subscription.cancelled':
        await updateUserSubscription(user.id, 'cancelled');
        break;
      
      default:
        console.log('Evento não tratado:', event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao processar webhook Kiwify:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
