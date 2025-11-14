import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Webhook da Kiwify para processar eventos de pagamento
 * Documentação: https://developers.kiwify.com.br/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log do webhook recebido
    console.log('Webhook Kiwify recebido:', body);

    // Validar assinatura do webhook (recomendado em produção)
    const signature = request.headers.get('x-kiwify-signature');
    
    // Extrair dados do evento
    const {
      order_id,
      order_status,
      product_id,
      customer_email,
      customer_name,
      sale_value,
      sale_date,
    } = body;

    // Processar apenas eventos de pagamento aprovado
    if (order_status === 'paid') {
      // Buscar usuário pelo email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', customer_email)
        .single();

      if (userError || !user) {
        console.error('Usuário não encontrado:', customer_email);
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      // Atualizar status de assinatura do usuário
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_plan: 'premium',
          subscription_start_date: new Date().toISOString(),
          kiwify_order_id: order_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        return NextResponse.json(
          { error: 'Erro ao atualizar assinatura' },
          { status: 500 }
        );
      }

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          order_id,
          status: order_status,
          amount: sale_value,
          payment_date: sale_date,
          product_id,
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        console.error('Erro ao registrar transação:', transactionError);
      }

      console.log(`Assinatura ativada para usuário ${customer_email}`);
    }

    // Processar outros status (refunded, cancelled, etc)
    if (order_status === 'refunded' || order_status === 'cancelled') {
      const { error: cancelError } = await supabase
        .from('users')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('email', customer_email);

      if (cancelError) {
        console.error('Erro ao cancelar assinatura:', cancelError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
