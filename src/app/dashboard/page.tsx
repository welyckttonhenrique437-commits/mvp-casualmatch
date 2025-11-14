'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, User, CreditCard, LogOut, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User as UserType } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
      });
    } catch (err: any) {
      setError(err.message);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setUser(data.user);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/');
  };

  const getSubscriptionStatusBadge = () => {
    if (!user) return null;

    const statusConfig = {
      active: { icon: CheckCircle, text: 'Ativa', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
      pending: { icon: Clock, text: 'Pendente', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
      cancelled: { icon: XCircle, text: 'Cancelada', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
      expired: { icon: XCircle, text: 'Expirada', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
    };

    const config = statusConfig[user.subscription_status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-pink-500/20 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              CasualMatch
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Olá, {user?.name}! 👋</h2>
          <p className="text-gray-400">Gerencie seu perfil e assinatura</p>
        </div>

        {/* Subscription Status Alert */}
        {user?.subscription_status === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">Pagamento pendente</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Complete seu pagamento para ter acesso total à plataforma
                </p>
                <Button
                  onClick={() => {
                    const kiwifyUrl = `https://pay.kiwify.com.br/SEU_PRODUTO_ID?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`;
                    window.location.href = kiwifyUrl;
                  }}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Completar pagamento
                </Button>
              </div>
            </div>
          </div>
        )}

        {user?.subscription_status !== 'active' && user?.subscription_status !== 'pending' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Assinatura inativa</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Renove sua assinatura para continuar aproveitando
                </p>
                <Button
                  onClick={() => {
                    const kiwifyUrl = `https://pay.kiwify.com.br/SEU_PRODUTO_ID?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`;
                    window.location.href = kiwifyUrl;
                  }}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Renovar assinatura
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-black/40 border border-pink-500/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-pink-500/20">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-pink-500/20">
              <CreditCard className="w-4 h-4 mr-2" />
              Assinatura
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-black/40 border-pink-500/20">
              <CardHeader>
                <CardTitle>Informações do perfil</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                      {success}
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
                      className="bg-white/5 border-pink-500/30 text-white"
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
                      className="bg-white/5 border-pink-500/30 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={updating}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar alterações'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card className="bg-black/40 border-pink-500/20">
              <CardHeader>
                <CardTitle>Status da assinatura</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie sua assinatura mensal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-pink-500/20">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status atual</p>
                    {getSubscriptionStatusBadge()}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Valor mensal</p>
                    <p className="text-2xl font-bold text-pink-400">R$ 19,90</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Benefícios inclusos:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Acesso ilimitado a todos os perfis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Chat privado sem restrições
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Filtros avançados de busca
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Suporte prioritário
                    </li>
                  </ul>
                </div>

                {user?.subscription_status === 'active' && (
                  <div className="pt-4 border-t border-pink-500/20">
                    <p className="text-sm text-gray-400 mb-3">
                      Para cancelar sua assinatura, entre em contato com o suporte
                    </p>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Solicitar cancelamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
