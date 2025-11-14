/**
 * Configuração e utilitários para integração com Kiwify
 */

export const KIWIFY_CONFIG = {
  apiKey: process.env.KIWIFY_API_KEY || '',
  productId: process.env.NEXT_PUBLIC_KIWIFY_PRODUCT_ID || '45SDQNS',
  baseUrl: 'https://pay.kiwify.com.br', // URL direta do checkout
  webhookUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/kiwify` : '',
};

/**
 * Gera URL de checkout da Kiwify com parâmetros do usuário
 * A Kiwify aceita parâmetros via URL para pré-preencher dados
 */
export function generateCheckoutUrl(params: {
  email: string;
  name: string;
  productId?: string;
}): string {
  const { email, name, productId = KIWIFY_CONFIG.productId } = params;
  
  // URL direta do checkout Kiwify
  const url = new URL(`${KIWIFY_CONFIG.baseUrl}/${productId}`);
  
  // Adicionar parâmetros para pré-preencher dados
  url.searchParams.set('email', email);
  url.searchParams.set('name', name);
  
  return url.toString();
}

/**
 * Valida webhook da Kiwify
 */
export function validateKiwifyWebhook(signature: string, payload: string): boolean {
  // A Kiwify envia um header X-Kiwify-Signature que deve ser validado
  // Por enquanto, retornamos true para aceitar todos os webhooks
  // Em produção, implemente validação real usando a chave secreta
  return true;
}
