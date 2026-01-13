'use client'

/**
 * Página de Relatórios Financeiros
 * 
 * Features:
 * - Visão geral de receitas e inscrições
 * - Filtros por data e ano
 * - Exportação para PDF com jsPDF
 * - Modais para feedback ao usuário
 * 
 * Nota: Se houver problemas com a geração de PDF, considere atualizar:
 * - jspdf para versão ^2.5.1
 * - jspdf-autotable para versão ^3.8.2
 */

import { useEffect, useState } from 'react'
import { useFinancialReports, EventFinancialSummary, QuotaPaymentSummary } from '@/hooks/useFinancialReports'
import { Download, FileText } from 'lucide-react'
import { Modal, useModal } from '@/components/Modal'

export default function FinancialReportsPage() {
  const { isOpen, message, type, title, showCancel, onConfirm, showModal, closeModal } = useModal()
  const {
    overview,
    eventSummaries,
    monthlyRevenue,
    paymentMethodStats,
    quotasOverview,
    quotaPayments,
    loading,
    error,
    fetchOverview,
    fetchEventSummaries,
    fetchMonthlyRevenue,
    fetchPaymentMethodStats,
    fetchQuotasOverview,
    fetchQuotaPayments,
    downloadFullPDF,
    downloadQuotasPDF,
  } = useFinancialReports()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'monthly' | 'payments' | 'quotas'>('overview')
  const [quotaStatusFilter, setQuotaStatusFilter] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    fetchOverview(startDate, endDate)
    fetchEventSummaries(startDate, endDate)
    fetchMonthlyRevenue(selectedYear)
    fetchPaymentMethodStats(startDate, endDate)
    fetchQuotasOverview(startDate, endDate)
    fetchQuotaPayments(startDate, endDate, quotaStatusFilter)
  }

  const handleFilter = () => {
    loadData()
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedYear(new Date().getFullYear())
    setQuotaStatusFilter('')
    setTimeout(() => {
      fetchOverview()
      fetchEventSummaries()
      fetchMonthlyRevenue()
      fetchPaymentMethodStats()
      fetchQuotasOverview()
      fetchQuotaPayments()
    }, 0)
  }

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

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      musica: 'Música',
      literatura: 'Literatura',
      teatro: 'Teatro',
      danca: 'Dança',
      cinema: 'Cinema',
      desenho: 'Desenho',
    }
    return labels[category] || category
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pendente: 'Pendente',
      aprovado: 'Aprovado',
      rejeitado: 'Rejeitado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pendente: 'bg-yellow-100 text-yellow-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleDownloadPDF = async () => {
    try {
      await downloadFullPDF(startDate, endDate, selectedYear, true)
      showModal('Relatório PDF baixado com sucesso!', {
        type: 'success',
        title: 'Sucesso',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      showModal(`Não foi possível baixar o relatório PDF.\n\nDetalhes: ${errorMessage}`, {
        type: 'error',
        title: 'Erro ao Baixar PDF',
      })
    }
  }

  const handleDownloadQuotasPDF = async () => {
    try {
      await downloadQuotasPDF(startDate, endDate, quotaStatusFilter)
      showModal('Relatório de quotas PDF baixado com sucesso!', {
        type: 'success',
        title: 'Sucesso',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      showModal(`Não foi possível baixar o relatório de quotas.\n\nDetalhes: ${errorMessage}`, {
        type: 'error',
        title: 'Erro ao Baixar PDF',
      })
    }
  }

  return (
    <div className="p-2 sm:p-3 md:p-4">
      {/* Filtros */}
      <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Filtros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Ano (Mensal)
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
              className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleFilter}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
              >
                Filtrar
              </button>
              <button
                onClick={clearFilters}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-xs sm:text-sm font-medium"
              >
                Limpar
              </button>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium"
              title="Download relatório completo (PDF gerado no servidor)"
            >
              <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 md:mb-6">
        <div className="border-b border-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-6 px-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden xs:inline">Visão Geral</span>
              <span className="xs:hidden">Visão</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden xs:inline">Por Evento</span>
              <span className="xs:hidden">Eventos</span>
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Métodos de Pagamento</span>
              <span className="sm:hidden">Pagamentos</span>
            </button>
            <button
              onClick={() => setActiveTab('quotas')}
              className={`py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'quotas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden xs:inline">Quotas de Artistas</span>
              <span className="xs:hidden">Quotas</span>
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">A carregar dados...</p>
        </div>
      ) : (
        <>
          {/* Visão Geral */}
          {activeTab === 'overview' && overview && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                  Receita Total
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatCurrency(overview.total_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.total_registrations} inscrições totais
                </p>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                  Receita Confirmada
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(overview.confirmed_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.confirmed_registrations} pagamentos confirmados
                </p>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                  Receita Pendente
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                  {formatCurrency(overview.pending_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.pending_registrations} pagamentos pendentes
                </p>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md sm:col-span-2 lg:col-span-3">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
                  Estatísticas Adicionais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Eventos com Receita</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {overview.events_with_revenue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Confirmação</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {overview.total_registrations > 0
                        ? Math.round(
                            (overview.confirmed_registrations / overview.total_registrations) * 100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Por Evento */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Categoria
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Preço
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Inscrições
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confirmadas
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Receita Total
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        R. Confirmada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventSummaries.map((event) => (
                      <tr key={event.event_id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 min-w-[120px] sm:min-w-[150px]">
                            {event.event_title}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-500">
                            {formatDate(event.event_date)}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="px-1.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getCategoryLabel(event.event_category)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                          {formatCurrency(event.event_price)}
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                          {event.total_registrations}
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-green-600 font-semibold">
                            {event.confirmed_registrations}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 hidden md:table-cell">
                          {formatCurrency(event.total_revenue)}
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                          {formatCurrency(event.confirmed_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {eventSummaries.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-500">
                    Nenhum evento encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mensal */}
          {activeTab === 'monthly' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                  Receitas Mensais - {selectedYear}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscrições
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Receita Total
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <span className="hidden sm:inline">Receita Confirmada</span>
                          <span className="sm:hidden">R. Confirmada</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyRevenue.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                              {month.month}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {month.registrations_count}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 hidden sm:table-cell">
                            {formatCurrency(month.total_revenue)}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                            {formatCurrency(month.confirmed_revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
          )}

          {/* Métodos de Pagamento */}
          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {paymentMethodStats.map((method, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
                    {method.method}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total de Transações</span>
                      <span className="font-semibold text-gray-900">
                        {method.total_transactions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transações Completas</span>
                      <span className="font-semibold text-green-600">
                        {method.completed_transactions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Receita Total</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(method.total_revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Receita Confirmada</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(method.confirmed_revenue)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                        <span className="font-semibold text-blue-600">
                          {method.total_transactions > 0
                            ? Math.round(
                                (method.completed_transactions / method.total_transactions) * 100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {paymentMethodStats.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Nenhum método de pagamento registrado
                </div>
              )}
            </div>
          )}

          {/* Quotas de Artistas */}
          {activeTab === 'quotas' && (
            <div className="space-y-6">
              {/* Filtro de Status */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <div className="flex flex-col gap-3">
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Filtrar por Status
                    </label>
                    <select
                      value={quotaStatusFilter}
                      onChange={(e) => setQuotaStatusFilter(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos os status</option>
                      <option value="pendente">Pendente</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => fetchQuotaPayments(startDate, endDate, quotaStatusFilter)}
                      className="flex-1 px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={handleDownloadQuotasPDF}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 text-xs sm:text-sm font-medium"
                    >
                      <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span>PDF Quotas</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumo de Quotas */}
              {quotasOverview && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                      Total de Pagamentos
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                      {quotasOverview.total_payments}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatCurrency(quotasOverview.total_amount)}
                    </p>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                      Aprovados
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                      {quotasOverview.approved_payments}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatCurrency(quotasOverview.approved_amount)}
                    </p>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                      Pendentes
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                      {quotasOverview.pending_payments}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatCurrency(quotasOverview.pending_amount)}
                    </p>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                      Rejeitados
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-red-600">
                      {quotasOverview.rejected_payments}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatCurrency(quotasOverview.rejected_amount)}
                    </p>
                  </div>
                </div>
              )}

              {/* Lista de Pagamentos de Quotas */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artista
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Mês Referência
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Método
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Data Envio
                        </th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Aprovado Por
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quotaPayments && quotaPayments.map((payment) => (
                        <tr key={payment.payment_id} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {payment.artist_name}
                            </div>
                            <div className="text-xs text-gray-500 hidden sm:block">{payment.artist_email}</div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                            {new Date(payment.mes_referencia).toLocaleDateString('pt-PT', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.valor)}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                            {payment.metodo_pagamento}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                            <span
                              className={`px-1.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {getStatusLabel(payment.status)}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                            {formatDate(payment.data_envio)}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                            {payment.aprovado_por_nome || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(!quotaPayments || quotaPayments.length === 0) && (
                  <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-500">
                    Nenhum pagamento de quota encontrado
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        message={message}
        type={type}
        title={title}
        showCancel={showCancel}
        onConfirm={onConfirm}
      />
    </div>
  )
}
