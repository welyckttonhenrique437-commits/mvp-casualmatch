'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

/**
 * Página de checkout com REDIRECIONAMENTO DIRETO
 * Esta versão redireciona o usuário diretamente para o checkout da Kiwify
 * em vez de usar iframe, evitando problemas de CORS e X-Frame-Options
 */
export default function CheckoutRedirectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    try {
      // Buscar dados do usuário do localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');

      // Validar dados obrigatórios
      if (!userEmail || !userName) {
        setError('Dados do usuário não encontrados. Por favor, faça o cadastro novamente.');
        setLoading(false);
        return;
      }

      // Gerar URL do checkout Kiwify
      const productId = '45SDQNS';
      const baseUrl = 'https://pay.kiwify.com.br';
      
      const url = new URL(`${baseUrl}/${productId}`);
      url.searchParams.set('email', userEmail);
      url.searchParams.set('name', userName);

      // Countdown antes do redirecionamento
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Redirecionar para o checkout da Kiwify
            window.location.href = url.toString();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setLoading(false);

      return () => clearInterval(countdownInterval);
    } catch (err) {
      console.error('Erro ao gerar checkout:', err);
      setError('Erro ao carregar checkout. Tente novamente.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold">
              <span className="text-white">Casual</span>
              <span className="text-[#D4AF37]">Match</span>
            </h1>
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Redirect Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Redirecionando para o checkout
            </h2>
            <p className="text-gray-400 text-lg">
              Você será redirecionado em instantes...
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-600/10 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <Link 
                    href="/cadastro" 
                    className="inline-block mt-2 text-sm underline hover:text-red-300"
                  >
                    Voltar para cadastro
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!error && (
            <div className="bg-gradient-to-br from-red-950/20 to-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-6" />
                <p className="text-2xl font-bold text-white mb-2">
                  Preparando seu checkout...
                </p>
                <p className="text-gray-400 mb-8">
                  Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}
                </p>
                
                {/* Security Info */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/30">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-400">Pagamento 100% seguro via Kiwify</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          {!error && (
            <div className="mt-8 bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
              <p className="text-sm text-blue-300 text-center">
                💡 Você será redirecionado para a página de pagamento segura da Kiwify
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
