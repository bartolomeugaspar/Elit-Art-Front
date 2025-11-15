'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Eye, EyeOff, Lock, Mail, CheckCircle } from 'lucide-react';

export default function AdminLogin() {
  console.log('[Login] Componente sendo renderizado');
  
  // Efeito para verificar se o componente está montando corretamente
  useEffect(() => {
    console.log('[Login] Componente montado');
    // Forçar tema claro
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    return () => {
      console.log('[Login] Componente desmontado');
    };
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-dismiss success after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    console.log('[Login] Iniciando tentativa de login');
    try {
      console.log('[Login] Chamando função login');
      const data = await login(email, password);
      console.log('[Login] Resposta da API:', data);
      
      // Verifica se o usuário foi retornado corretamente
      if (!data || !data.user) {
        console.error('[Login] Dados do usuário não encontrados na resposta');
        throw new Error('Falha ao obter dados do usuário. Tente novamente.');
      }
      
      console.log('[Login] Verificando permissões do usuário');
      if (data.user.role !== 'admin') {
        setError('Acesso negado. Apenas administradores podem acessar.');
        localStorage.removeItem('token');
        return;
      }
      
      // Show success toast
      const welcomeMessage = `Bem-vindo, ${data.user.name}!`;
      console.log('[Login]', welcomeMessage);
      setSuccess(welcomeMessage);
      
      // Redirect immediately after successful login
      console.log('[Login] Redirecionando para o dashboard');
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('[Login] Erro durante o login:', err);
      setError(err.message || 'Email ou senha incorretos');
      
      // Limpar token em caso de erro
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-elit-red/8 via-elit-red/4 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-elit-orange/8 via-elit-orange/4 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-r from-elit-gold/2 to-elit-brown/2 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100/50 text-black relative z-10 backdrop-blur-xl">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <img 
              src="/icon.jpeg" 
              alt="Elit'Arte Logo" 
              className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover shadow-md"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Elit'Art
            </h1>
            <p className="text-gray-500 text-sm">Painel Administrativo</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-elit-red mb-2 sm:mb-3 uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-elit-orange/70 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-elit-red transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border-2 border-elit-gold/40 rounded-lg sm:rounded-xl text-sm sm:text-base text-elit-dark placeholder-gray-500 focus:outline-none focus:border-elit-red focus:ring-2 focus:ring-elit-red/30 transition-all duration-200 hover:border-elit-orange/50"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <label className="block text-xs sm:text-sm font-semibold text-elit-red uppercase tracking-wide">
                  Senha
                </label>
                <a 
                  href="/admin/forgot-password" 
                  className="text-xs text-elit-red hover:text-elit-orange transition-colors duration-200 font-medium"
                >
                  Esqueceu?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-elit-orange/70 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-elit-red transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border-2 border-elit-gold/40 rounded-lg sm:rounded-xl text-sm sm:text-base text-elit-dark placeholder-gray-500 focus:outline-none focus:border-elit-red focus:ring-2 focus:ring-elit-red/30 transition-all duration-200 hover:border-elit-orange/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-elit-orange/70 hover:text-elit-red transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg sm:rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-shrink-0">
                  <CheckCircle size={20} className="sm:w-6 sm:h-6 text-green-600 animate-bounce" />
                </div>
                <div className="flex-1">
                  <p className="text-green-700 text-sm sm:text-base font-bold">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg sm:rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-shrink-0">
                  <AlertCircle size={20} className="sm:w-6 sm:h-6 text-red-600 animate-bounce" />
                </div>
                <div className="flex-1">
                  <p className="text-red-700 text-sm sm:text-base font-bold">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-elit-red via-elit-orange to-elit-brown hover:from-elit-brown hover:via-elit-red hover:to-elit-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl uppercase tracking-wide text-xs sm:text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-xs sm:text-sm">Entrando...</span>
                </span>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
          {/* Footer Info */}
          <p className="text-center text-xs sm:text-xs text-gray-500 mt-4 sm:mt-6">
            Painel Administrativo Elit'Art v1.0.0
          </p>
        </div>
      </div>
  );
} 
