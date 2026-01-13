'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus('error');
        setMessage('Email não fornecido');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Você foi desinscrito da newsletter com sucesso.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Erro ao processar sua solicitação.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Newsletter Elit'Arte</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Processando sua solicitação...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Desinscrito com Sucesso!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-8">
                Você não receberá mais emails sobre novos eventos e novidades da Elit'Arte.
              </p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                >
                  Voltar à Página Inicial
                </Link>
                <Link
                  href="/eventos"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Ver Eventos
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Erro ao Desinscrever</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-8">
                Se o problema persistir, entre em contacto connosco.
              </p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                >
                  Voltar à Página Inicial
                </Link>
                <a
                  href="mailto:contato@elitarte.com"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Contactar Suporte
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Elit'Arte. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
