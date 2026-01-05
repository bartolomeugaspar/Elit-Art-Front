'use client'

import { useEffect, useState } from 'react'
import { useFinancialReports, EventFinancialSummary } from '@/hooks/useFinancialReports'

export default function FinancialReportsPage() {
  const {
    overview,
    eventSummaries,
    monthlyRevenue,
    paymentMethodStats,
    loading,
    error,
    fetchOverview,
    fetchEventSummaries,
    fetchMonthlyRevenue,
    fetchPaymentMethodStats,
  } = useFinancialReports()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'monthly' | 'payments'>('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    fetchOverview(startDate, endDate)
    fetchEventSummaries(startDate, endDate)
    fetchMonthlyRevenue(selectedYear)
    fetchPaymentMethodStats(startDate, endDate)
  }

  const handleFilter = () => {
    loadData()
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedYear(new Date().getFullYear())
    setTimeout(() => {
      fetchOverview()
      fetchEventSummaries()
      fetchMonthlyRevenue()
      fetchPaymentMethodStats()
    }, 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Relatórios Financeiros</h1>
        <p className="text-gray-600">
          Visualize e analise as receitas das inscrições de eventos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano (Mensal)
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Limpar
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
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Por Evento
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Métodos de Pagamento
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Receita Total
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(overview.total_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.total_registrations} inscrições totais
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Receita Confirmada
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(overview.confirmed_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.confirmed_registrations} pagamentos confirmados
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Receita Pendente
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {formatCurrency(overview.pending_revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {overview.pending_registrations} pagamentos pendentes
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Estatísticas Adicionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscrições
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confirmadas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receita Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receita Confirmada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventSummaries.map((event) => (
                      <tr key={event.event_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {event.event_title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(event.event_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getCategoryLabel(event.event_category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(event.event_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.total_registrations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-semibold">
                            {event.confirmed_registrations}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(event.total_revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(event.confirmed_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {eventSummaries.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Nenhum evento encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mensal */}
          {activeTab === 'monthly' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Receitas Mensais - {selectedYear}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscrições
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita Confirmada
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyRevenue.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {month.month}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {month.registrations_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(month.total_revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethodStats.map((method, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
        </>
      )}
    </div>
  )
}
