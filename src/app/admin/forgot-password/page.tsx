'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar email de recuperação');
      }

      setSuccess(`Se este email estiver registrado, você receberá um link de recuperação em breve. 📧`);
      
      // Redirect after 4 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 4000);
    } catch (err) {
      setError('Erro ao processar sua solicitação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elit-white via-white to-elit-light flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-elit-light/80 via-white/90 to-elit-light/80"></div>
        
        {/* Animated Gradient Orbs - Light Version */}
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-elit-red/8 to-elit-orange/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tl from-elit-orange/8 to-elit-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-b from-elit-gold/6 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle Noise Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" /%3E%3C/filter%3E%3Crect width="400" height="400" fill="%23000" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
          backgroundSize: '400px 400px'
        }}></div>

        {/* Diagonal Lines Pattern - Light */}
        <div className="absolute inset-0 opacity-[0.01]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 69, 19, 0.2) 35px, rgba(139, 69, 19, 0.2) 70px)'
        }}></div>

        {/* Radial Gradient Overlay - Light */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(250, 250, 235, 0.2) 100%)'
        }}></div>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/login')}
          className="flex items-center gap-2 text-elit-red hover:text-elit-orange transition-colors duration-200 mb-6 sm:mb-8 font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Voltar ao Login
        </button>

        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
            <img 
              src="/icon.jpeg" 
              alt="Elit'Arte Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover shadow-md"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-elit-gold">
              Recuperar Senha
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 md:p-8 border border-elit-red/20 backdrop-blur-sm">
          <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
            Digite seu email para receber um link de recuperação de senha.
          </p>

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
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Enviando...</span>
                </span>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-elit-red/10">
            <div className="bg-elit-light rounded-lg p-4">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold text-elit-dark">💡 Dica:</span> Verifique sua pasta de spam se não receber o email em alguns minutos.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <p className="text-center text-xs sm:text-xs text-gray-500 mt-4 sm:mt-6">
            Painel Administrativo Elit'Art v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
