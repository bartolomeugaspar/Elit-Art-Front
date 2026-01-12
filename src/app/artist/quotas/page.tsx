'use client';

import { useState } from 'react';
import { useArtistQuotas, ArtistQuota } from '@/hooks/useArtistDashboard';

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

export default function ArtistQuotas() {
  const { quotas, stats, loading, createQuota, deleteQuota, refreshQuotas } = useArtistQuotas();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: '',
    payment_method: '',
    payment_reference: '',
    notes: '',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.payment_date) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('payment_date', formData.payment_date);
      if (formData.payment_method) data.append('payment_method', formData.payment_method);
      if (formData.payment_reference) data.append('payment_reference', formData.payment_reference);
      if (formData.notes) data.append('notes', formData.notes);
      if (proofFile) data.append('proof_of_payment', proofFile);

      await createQuota(data);
      
      setFormData({
        amount: '',
        payment_date: '',
        payment_method: '',
        payment_reference: '',
        notes: '',
      });
      setProofFile(null);
      setShowModal(false);
      alert('Quota registrada com sucesso! Aguarde aprovação do administrador.');
    } catch (error: any) {
      alert(error.message || 'Erro ao registrar quota');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta quota?')) return;
    
    try {
      await deleteQuota(id);
      alert('Quota excluída com sucesso');
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir quota');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Quotas</h1>
          <p className="text-gray-600 mt-2">Gerencie seus pagamentos de quotas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          ➕ Registrar Pagamento
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total de Quotas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_quotas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending_quotas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Aprovadas</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved_quotas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Pago</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              €{stats.total_amount_paid?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      )}

      {/* Quotas List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h2>
        </div>
        
        {quotas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Nenhuma quota registrada ainda.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Registrar primeiro pagamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Referência
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
                {quotas.map((quota) => (
                  <tr key={quota.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(quota.payment_date).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{quota.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quota.payment_method || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quota.payment_reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quota.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quota.proof_of_payment ? (
                        <a
                          href={quota.proof_of_payment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-700"
                        >
                          Ver comprovante
                        </a>
                      ) : (
                        <span className="text-gray-400">Sem comprovante</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quota.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(quota.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Excluir
                        </button>
                      )}
                      {quota.status === 'approved' && quota.approved_by_name && (
                        <span className="text-xs text-gray-500">
                          Aprovado por {quota.approved_by_name}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for New Quota */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title="Registrar Pagamento de Quota"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (€) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data do Pagamento *
            </label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
              <option value="MBWay">MBWay</option>
              <option value="Multibanco">Multibanco</option>
              <option value="PayPal">PayPal</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referência de Pagamento
            </label>
            <input
              type="text"
              value={formData.payment_reference}
              onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ex: Número da transação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprovante de Pagamento
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            <p className="text-xs text-gray-500 mt-1">PNG, JPG ou PDF até 5MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Informações adicionais (opcional)"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Registrando...' : 'Registrar Pagamento'}
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
