'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Mail, Send } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });

  const fetchSubscribers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/newsletter`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Tem certeza que deseja remover este inscrito?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/newsletter/${subscriberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/newsletter/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert('Email enviado com sucesso!');
        setEmailData({ subject: '', message: '' });
        setShowEmailForm(false);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Erro ao enviar email');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Newsletter</h1>
          <p className="text-slate-600 mt-1">Total de {subscribers.length} inscritos</p>
        </div>
        <button
          onClick={() => setShowEmailForm(!showEmailForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Send size={20} />
          Enviar Email
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total de Inscritos</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{subscribers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg">
              <Mail size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm font-medium mb-3">Taxa de Inscrição</p>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-3">65% da base de usuários</p>
        </div>
      </div>

      {/* Send Email Form */}
      {showEmailForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Enviar Email para Newsletter</h2>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Assunto</label>
              <input
                type="text"
                placeholder="Assunto do email"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Mensagem</label>
              <textarea
                placeholder="Conteúdo do email"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                rows={6}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Send size={18} />
                Enviar
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-lg transition duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Data de Inscrição</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Nenhum inscrito encontrado
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-slate-200 hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-4 text-slate-900 font-medium">{subscriber.email}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
