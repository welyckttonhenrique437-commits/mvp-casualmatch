'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfig, setNeedsConfig] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsConfig(false);
    setEmailExists(false);
    setLoading(true);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar idade (18+)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError('Você precisa ter 18 anos ou mais');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
        }),
      });

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não é JSON:', await response.text());
        throw new Error('Erro de comunicação com o servidor. Tente novamente.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Verificar se precisa configurar variáveis de ambiente
        if (data.needsConfig) {
          setNeedsConfig(true);
        }
        
        // Verificar se o e-mail já está cadastrado
        if (data.error?.includes('já cadastrado') || data.error?.includes('duplicate')) {
          setEmailExists(true);
          
          // CORREÇÃO: Buscar dados do usuário existente e salvar no localStorage
          try {
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password,
              }),
            });

            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              
              // Salvar dados do usuário no localStorage
              if (loginData.user) {
                localStorage.setItem('userId', loginData.user.id);
                localStorage.setItem('userEmail', loginData.user.email);
                localStorage.setItem('userName', loginData.user.name);
                
                // Redirecionar para checkout
                router.push('/checkout');
                return;
              }
            }
          } catch (loginError) {
            console.error('Erro ao fazer login automático:', loginError);
          }
          
          setError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
          setLoading(false);
          return;
        }
        
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Salvar dados do usuário no localStorage
      if (data.user) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
      }

      // Redirecionar para página de checkout
      router.push('/checkout');
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
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
          
          <h2 className="text-2xl font-bold mb-2">Crie sua conta</h2>
          <p className="text-gray-400">Comece sua jornada de diversão agora</p>
        </div>

        {/* Form */}
        <div className="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-600/10 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{error}</p>
                    {needsConfig && (
                      <p className="mt-2 text-xs text-red-300">
                        Clique no banner laranja acima para configurar as variáveis de ambiente do Supabase.
                      </p>
                    )}
                    {emailExists && (
                      <div className="mt-3">
                        <Link 
                          href="/login" 
                          className="inline-block bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Ir para Login
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="name" className="text-gray-300">Nome completo</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                placeholder="Seu nome"
              />
            </div>

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
              <Label htmlFor="birthDate" className="text-gray-300">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="bg-white/5 border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
              <p className="text-xs text-gray-500 mt-1">Você precisa ter 18 anos ou mais</p>
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
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-white/5 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                placeholder="Digite a senha novamente"
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
                  Criando conta...
                </>
              ) : (
                'Continuar para pagamento'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#D4AF37] hover:text-[#C5A028] font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
