'use client';

import Link from 'next/link';
import { Heart, Flame, Lock, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold">
              <span className="text-white">Casual</span>
              <span className="text-[#D4AF37]">Match</span>
            </h1>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm text-[#D4AF37]">Apenas R$ 19,90/mês</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Encontros sem
            <span className="block bg-gradient-to-r from-red-600 via-[#D4AF37] to-red-600 bg-clip-text text-transparent">
              compromisso
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A rede social adulta onde você encontra pessoas reais procurando por diversão sem amarras
          </p>
          
          <Link href="/cadastro">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-[#D4AF37] hover:from-red-700 hover:to-[#C5A028] text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-red-600/50 transition-all hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" />
              Começar agora
            </Button>
          </Link>
          
          <p className="text-sm text-gray-400 mt-4">
            +18 anos • Discreto • Seguro
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-black/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por que escolher o <span className="text-[#D4AF37]">CasualMatch</span>?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-600/10 to-[#D4AF37]/10 p-8 rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all hover:scale-105">
              <Shield className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h4 className="text-xl font-bold mb-3">100% Discreto</h4>
              <p className="text-gray-300">
                Seus dados e conversas são protegidos com criptografia de ponta
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-red-600/10 p-8 rounded-2xl border border-red-600/20 hover:border-red-600/40 transition-all hover:scale-105">
              <Users className="w-12 h-12 text-red-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">Pessoas Reais</h4>
              <p className="text-gray-300">
                Perfis verificados e pessoas reais procurando por diversão
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-600/10 to-[#D4AF37]/10 p-8 rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all hover:scale-105">
              <Lock className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h4 className="text-xl font-bold mb-3">Sem Compromisso</h4>
              <p className="text-gray-300">
                Cancele quando quiser, sem burocracia ou taxas extras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para se divertir?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de pessoas que já encontraram diversão sem compromisso
          </p>
          <Link href="/cadastro">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-[#D4AF37] hover:from-red-700 hover:to-[#C5A028] text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-red-600/50 transition-all hover:scale-105"
            >
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#D4AF37]/20 bg-black/50">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 CasualMatch. Todos os direitos reservados.</p>
          <p className="mt-2">Conteúdo adulto +18 anos</p>
        </div>
      </footer>
    </div>
  );
}
