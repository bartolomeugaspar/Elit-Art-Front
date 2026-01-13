'use client'

import { useEffect, useState } from 'react'
import { useAdminQuotas, ArtistQuota } from '@/hooks/useAdminQuotas'
import { CheckCircle, XCircle, Eye, Trash2, Download, FileText, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminQuotasPage() {
  const {
    quotas,
    stats,
    loading,
    error,
    fetchQuotas,
    fetchStats,
    approveQuota,
    rejectQuota,
    deleteQuota,
  } = useAdminQuotas()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedQuota, setSelectedQuota] = useState<ArtistQuota | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve')
  const [approvalNotes, setApprovalNotes] = useState('')

  useEffect(() => {
    fetchQuotas()
    fetchStats()
  }, [])

  const filteredQuotas = quotas.filter(quota => {
    const matchesSearch = 
      quota.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quota.artist_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quota.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quota.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
      case 'approved':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aprovado</span>
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejeitado</span>
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const handleViewDetails = (quota: ArtistQuota) => {
    setSelectedQuota(quota)
    setShowDetailsModal(true)
  }

  const handleApprovalClick = (quota: ArtistQuota, action: 'approve' | 'reject') => {
    setSelectedQuota(quota)
    setApprovalAction(action)
    setApprovalNotes('')
    setShowApprovalModal(true)
  }

  const handleDeleteClick = (quota: ArtistQuota) => {
    setSelectedQuota(quota)
    setShowDeleteModal(true)
  }

  const handleApproval = async () => {
    if (!selectedQuota) return

    const loadingToast = toast.loading(approvalAction === 'approve' ? 'Aprovando quota...' : 'Rejeitando quota...')

    try {
      if (approvalAction === 'approve') {
        await approveQuota(selectedQuota.id, approvalNotes)
        toast.success('Quota aprovada com sucesso!', { id: loadingToast })
      } else {
        await rejectQuota(selectedQuota.id, approvalNotes)
        toast.success('Quota rejeitada com sucesso!', { id: loadingToast })
      }
      setShowApprovalModal(false)
      setSelectedQuota(null)
      setApprovalNotes('')
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast })
    }
  }

  const handleDelete = async () => {
    if (!selectedQuota) return

    const loadingToast = toast.loading('Deletando quota...')

    try {
      await deleteQuota(selectedQuota.id)
      toast.success('Quota deletada com sucesso!', { id: loadingToast })
      setShowDeleteModal(false)
      setSelectedQuota(null)
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast })
    }
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Quotas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_quotas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{formatCurrency(stats.total_amount_paid)}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending_quotas}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{formatCurrency(stats.total_amount_pending)}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved_quotas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{formatCurrency(stats.total_amount_approved)}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected_quotas}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{formatCurrency(stats.total_amount_rejected)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por artista, email ou referência..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
        
        <select
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovadas</option>
          <option value="rejected">Rejeitadas</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando quotas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredQuotas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhuma quota encontrada</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Artista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Data de Pagamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Método</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredQuotas.map((quota) => (
                    <tr key={quota.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{quota.artist_name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{quota.artist_email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(quota.amount)}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(quota.payment_date)}</td>
                      <td className="px-6 py-4 text-gray-600">{quota.payment_method || 'N/A'}</td>
                      <td className="px-6 py-4">{getStatusBadge(quota.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(quota)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          {quota.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprovalClick(quota, 'approve')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Aprovar"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleApprovalClick(quota, 'reject')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Rejeitar"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteClick(quota)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredQuotas.map((quota) => (
              <div key={quota.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{quota.artist_name || 'N/A'}</h3>
                    <p className="text-sm text-gray-500">{quota.artist_email || 'N/A'}</p>
                  </div>
                  {getStatusBadge(quota.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(quota.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="text-gray-900">{formatDate(quota.payment_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="text-gray-900">{quota.payment_method || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(quota)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg text-sm font-medium"
                  >
                    <Eye size={16} />
                    Detalhes
                  </button>
                  {quota.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprovalClick(quota, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg text-sm font-medium"
                      >
                        <CheckCircle size={16} />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleApprovalClick(quota, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium"
                      >
                        <XCircle size={16} />
                        Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedQuota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes da Quota</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Artista</label>
                    <p className="text-gray-900 mt-1">{selectedQuota.artist_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 mt-1">{selectedQuota.artist_email || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Valor</label>
                    <p className="text-gray-900 mt-1 font-medium">{formatCurrency(selectedQuota.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedQuota.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Pagamento</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedQuota.payment_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Método de Pagamento</label>
                    <p className="text-gray-900 mt-1">{selectedQuota.payment_method || 'N/A'}</p>
                  </div>
                </div>

                {selectedQuota.payment_reference && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Referência de Pagamento</label>
                    <p className="text-gray-900 mt-1">{selectedQuota.payment_reference}</p>
                  </div>
                )}

                {selectedQuota.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notas</label>
                    <p className="text-gray-900 mt-1">{selectedQuota.notes}</p>
                  </div>
                )}

                {selectedQuota.proof_of_payment && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Comprovante de Pagamento</label>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedQuota.proof_of_payment}
                        alt="Comprovante de pagamento"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <a
                      href={selectedQuota.proof_of_payment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Download size={16} />
                      Baixar comprovante
                    </a>
                  </div>
                )}

                {selectedQuota.approved_by_name && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Aprovado por</label>
                      <p className="text-gray-900 mt-1">{selectedQuota.approved_by_name}</p>
                    </div>
                    {selectedQuota.approved_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Aprovação</label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedQuota.approved_at)}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Criado em</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedQuota.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Atualizado em</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedQuota.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                {selectedQuota.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleApprovalClick(selectedQuota, 'approve')
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle size={18} />
                      Aprovar
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleApprovalClick(selectedQuota, 'reject')
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <XCircle size={18} />
                      Rejeitar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedQuota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {approvalAction === 'approve' ? 'Aprovar Quota' : 'Rejeitar Quota'}
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Tem certeza que deseja {approvalAction === 'approve' ? 'aprovar' : 'rejeitar'} o pagamento de{' '}
                  <strong>{formatCurrency(selectedQuota.amount)}</strong> de{' '}
                  <strong>{selectedQuota.artist_name}</strong>?
                </p>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Adicione observações sobre esta decisão..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApproval}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    approvalAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false)
                    setSelectedQuota(null)
                    setApprovalNotes('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedQuota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deletar Quota</h2>
              
              <p className="text-gray-600 mb-4">
                Tem certeza que deseja deletar o pagamento de{' '}
                <strong>{formatCurrency(selectedQuota.amount)}</strong> de{' '}
                <strong>{selectedQuota.artist_name}</strong>? Esta ação não pode ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Deletar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedQuota(null)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
