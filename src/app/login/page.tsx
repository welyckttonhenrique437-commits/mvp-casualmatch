'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar ID do usuário no localStorage
      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-bold">
              <span className="text-white">Casual</span>
              <span className="text-[#D4AF37]">Match</span>
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
          <p className="text-gray-400">Entre e continue se divertindo</p>
        </div>

        {/* Form */}
        <div className="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-600/10 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/5 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                placeholder="Sua senha"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-[#D4AF37] hover:from-red-700 hover:to-[#C5A028] text-white py-6 rounded-lg shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="text-[#D4AF37] hover:text-[#C5A028] font-medium">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
