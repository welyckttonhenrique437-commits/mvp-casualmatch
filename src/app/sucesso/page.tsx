'use client';

import Link from 'next/link';
import { CheckCircle, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Flame className="w-12 h-12 text-red-600" />
          <h1 className="text-4xl font-bold">
            <span className="text-white">Casual</span>
            <span className="text-[#D4AF37]">Match</span>
          </h1>
        </div>

        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-600/20 border-4 border-green-600/50 mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pagamento confirmado!
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Bem-vindo ao CasualMatch
          </p>
          <p className="text-gray-400">
            Sua assinatura foi ativada com sucesso
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">
            O que você pode fazer agora:
          </h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Navegar por perfis ilimitados</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Enviar mensagens sem restrições</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Ver quem visualizou seu perfil</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Acesso a recursos premium exclusivos</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link href="/dashboard">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-red-600 to-[#D4AF37] hover:from-red-700 hover:to-[#C5A028] text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-red-600/50 transition-all hover:scale-105"
          >
            Começar a explorar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>

        <p className="text-sm text-gray-500 mt-6">
          Você receberá um e-mail de confirmação em breve
        </p>
      </div>
    </div>
  );
}
