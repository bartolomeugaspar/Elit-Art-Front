'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, Download, UserPlus, Search, CheckCircle, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

interface Subscriber {
  id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('subscribed');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'subscribed' && sub.is_subscribed) ||
      (statusFilter === 'unsubscribed' && !sub.is_subscribed);
    return matchesSearch && matchesStatus;
  });

  const activeSubscribers = subscribers.filter(s => s.is_subscribed).length;
  const inactiveSubscribers = subscribers.filter(s => !s.is_subscribed).length;

  const fetchSubscribers = async () => {
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
      toast.error('Erro ao carregar inscritos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteClick = (subscriberId: string) => {
    setSubscriberToDelete(subscriberId);
    setShowDeleteModal(true);
  };

  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/newsletter/${subscriberToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Inscrito removido com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
        });
        fetchSubscribers();
      }
    } catch (error) {
      toast.error('Erro ao remover inscrito', {
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Status', 'Data de Inscrição'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.is_subscribed ? 'Ativo' : 'Inativo',
        new Date(sub.subscribed_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-inscritos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total de Inscritos</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{subscribers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg">
              <Mail size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Ativos</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{activeSubscribers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Inativos</p>
              <p className="text-4xl font-bold text-gray-600 mt-2">{inactiveSubscribers}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-4 rounded-lg">
              <UserPlus size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por email..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="subscribed">Ativos</option>
          <option value="unsubscribed">Inativos</option>
        </select>
      </div>

      {/* Subscribers Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data de Inscrição</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando inscritos...
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    {searchTerm || statusFilter !== 'all' ? 'Nenhum inscrito encontrado' : 'Nenhum inscrito cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-slate-400 mr-3" />
                        <div className="text-sm font-medium text-slate-900">{subscriber.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        subscriber.is_subscribed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscriber.is_subscribed ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(subscriber.id)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        title="Excluir"
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

      {/* Subscribers Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando inscritos...</span>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm || statusFilter !== 'all' ? 'Nenhum inscrito encontrado' : 'Nenhum inscrito cadastrado'}
          </div>
        ) : (
          filteredSubscribers.map((subscriber) => (
            <div key={subscriber.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-900 font-medium break-all">{subscriber.email}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    subscriber.is_subscribed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscriber.is_subscribed ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteClick(subscriber.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Inscrito em: {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Confirmar exclusão</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja remover este inscrito da newsletter? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSubscriber}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
