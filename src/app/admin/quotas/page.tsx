'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface ArtistQuota {
  id: number;
  artist_id: number;
  artist_name: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  payment_reference?: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_of_payment?: string;
  notes?: string;
  approved_by?: number;
  approved_by_name?: string;
  approved_at?: string;
  created_at: string;
}

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function SimpleModal({ isOpen, onClose, title, children }: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminQuotas() {
  const [quotas, setQuotas] = useState<ArtistQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedQuota, setSelectedQuota] = useState<ArtistQuota | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQuotas();
  }, [filter]);

  const fetchQuotas = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/artist-quotas${params}`);
      setQuotas(response.data);
    } catch (error: any) {
      alert('Erro ao carregar quotas');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      await api.patch(`/artist-quotas/${id}/approve`, {
        status,
        notes: approvalNotes || undefined
      });
      
      alert(`Quota ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`);
      setShowModal(false);
      setSelectedQuota(null);
      setApprovalNotes('');
      fetchQuotas();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao processar quota');
    } finally {
      setProcessing(false);
    }
  };

  const openApprovalModal = (quota: ArtistQuota) => {
    setSelectedQuota(quota);
    setApprovalNotes(quota.notes || '');
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredQuotas = quotas;
  const pendingCount = quotas.filter(q => q.status === 'pending').length;
  const totalAmount = quotas.reduce((sum, q) => q.status === 'approved' ? sum + q.amount : sum, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Quotas</h1>
        <p className="text-gray-600 mt-2">Aprove ou rejeite pagamentos de quotas dos artistas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Quotas Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Total de Quotas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{quotas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Total Aprovado</p>
          <p className="text-3xl font-bold text-green-600 mt-2">€{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({quotas.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aprovadas
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejeitadas
          </button>
        </div>
      </div>

      {/* Quotas Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredQuotas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Nenhuma quota encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprovante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotas.map((quota) => (
                  <tr key={quota.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quota.artist_name}</div>
                      {quota.notes && (
                        <div className="text-xs text-gray-500 mt-1">{quota.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(quota.payment_date).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{quota.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{quota.payment_method || '-'}</div>
                      {quota.payment_reference && (
                        <div className="text-xs text-gray-400">{quota.payment_reference}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quota.status)}
                      {quota.approved_by_name && (
                        <div className="text-xs text-gray-500 mt-1">
                          por {quota.approved_by_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quota.proof_of_payment ? (
                        <a
                          href={quota.proof_of_payment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ver
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quota.status === 'pending' ? (
                        <button
                          onClick={() => openApprovalModal(quota)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Avaliar
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => !processing && setShowModal(false)}
        title="Avaliar Pagamento de Quota"
      >
        {selectedQuota && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{selectedQuota.artist_name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Valor: <span className="font-bold">€{selectedQuota.amount.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Data: {new Date(selectedQuota.payment_date).toLocaleDateString('pt-PT')}
              </p>
              <p className="text-sm text-gray-600">
                Método: {selectedQuota.payment_method || '-'}
              </p>
              {selectedQuota.payment_reference && (
                <p className="text-sm text-gray-600">
                  Referência: {selectedQuota.payment_reference}
                </p>
              )}
              {selectedQuota.proof_of_payment && (
                <a
                  href={selectedQuota.proof_of_payment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 block mt-2"
                >
                  📄 Ver comprovante
                </a>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adicione observações sobre esta quota..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => handleApprove(selectedQuota.id, 'rejected')}
                disabled={processing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {processing ? 'Processando...' : '❌ Rejeitar'}
              </button>
              <button
                onClick={() => handleApprove(selectedQuota.id, 'approved')}
                disabled={processing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {processing ? 'Processando...' : '✓ Aprovar'}
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
