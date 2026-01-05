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
import { useFinancialReports, EventFinancialSummary } from '@/hooks/useFinancialReports'
import { Download } from 'lucide-react'
import { Modal, useModal } from '@/components/Modal'

export default function FinancialReportsPage() {
  const { isOpen, message, type, title, showCancel, onConfirm, showModal, closeModal } = useModal()
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

  const generatePDF = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showModal('Token não encontrado. Por favor, faça login novamente.', {
          type: 'error',
          title: 'Erro de Autenticação',
        })
        return
      }

      // Criar conteúdo do relatório
      const reportData = {
        overview,
        eventSummaries,
        monthlyRevenue,
        paymentMethodStats,
        filters: {
          startDate: startDate || 'Sem filtro',
          endDate: endDate || 'Sem filtro',
          year: selectedYear,
        },
        generatedAt: new Date().toISOString(),
      }

      // Importar jsPDF dinamicamente
      const jsPDFModule = await import('jspdf')
      const jsPDF = (jsPDFModule as any).jsPDF || jsPDFModule.default
      const autoTableModule = await import('jspdf-autotable')
      const autoTable = autoTableModule.default

      const doc = new jsPDF()
      let yPosition = 10

      // Adicionar logotipo
      try {
        const logoUrl = '/icon.jpeg'
        const img = new Image()
        img.src = logoUrl
        
        // Adicionar imagem ao PDF (centralizada)
        const imgWidth = 25
        const imgHeight = 25
        const pageWidth = doc.internal.pageSize.getWidth()
        const xPosition = (pageWidth - imgWidth) / 2
        
        doc.addImage(img, 'PNG', xPosition, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 5
      } catch (error) {
        console.warn('Não foi possível adicionar o logotipo ao PDF:', error)
      }

      // Título da organização
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      const pageWidth = doc.internal.pageSize.getWidth()
      const orgTitle = 'Elit\'Arte - Amantes da Arte'
      const titleWidth = doc.getTextWidth(orgTitle)
      doc.text(orgTitle, (pageWidth - titleWidth) / 2, yPosition)
      yPosition += 8

      // Linha separadora
      doc.setLineWidth(0.5)
      doc.setDrawColor(59, 130, 246)
      doc.line(14, yPosition, pageWidth - 14, yPosition)
      yPosition += 8

      // Título do relatório
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Relatório Financeiro', 14, yPosition)
      yPosition += 8

      // Data de geração
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, yPosition)
      yPosition += 5

      // Filtros aplicados
      if (startDate || endDate) {
        doc.text(`Período: ${startDate || 'Início'} até ${endDate || 'Atual'}`, 14, yPosition)
        yPosition += 5
      }
      yPosition += 5

      // Visão Geral
      if (overview) {
        doc.setFontSize(14)
        doc.text('Visão Geral', 14, yPosition)
        yPosition += 7

        doc.setFontSize(10)
        doc.text(`Receita Total: ${formatCurrency(overview.total_revenue)}`, 14, yPosition)
        yPosition += 5
        doc.text(`Receita Confirmada: ${formatCurrency(overview.confirmed_revenue)}`, 14, yPosition)
        yPosition += 5
        doc.text(`Receita Pendente: ${formatCurrency(overview.pending_revenue)}`, 14, yPosition)
        yPosition += 5
        doc.text(`Total de Inscrições: ${overview.total_registrations}`, 14, yPosition)
        yPosition += 5
        doc.text(`Inscrições Confirmadas: ${overview.confirmed_registrations}`, 14, yPosition)
        yPosition += 5
        doc.text(`Taxa de Confirmação: ${overview.total_registrations > 0 ? Math.round((overview.confirmed_registrations / overview.total_registrations) * 100) : 0}%`, 14, yPosition)
        yPosition += 10
      }

      // Resumo por Evento
      if (eventSummaries && eventSummaries.length > 0) {
        doc.setFontSize(14)
        doc.text('Resumo por Evento', 14, yPosition)
        yPosition += 7

        const eventTableData = eventSummaries.map(event => [
          event.event_title,
          formatDate(event.event_date),
          getCategoryLabel(event.event_category),
          event.total_registrations.toString(),
          event.confirmed_registrations.toString(),
          formatCurrency(event.confirmed_revenue),
        ])

        autoTable(doc, {
          startY: yPosition,
          head: [['Evento', 'Data', 'Categoria', 'Inscrições', 'Confirmadas', 'Receita']],
          body: eventTableData,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10
      }

      // Nova página para dados mensais
      if (monthlyRevenue && monthlyRevenue.length > 0) {
        doc.addPage()
        yPosition = 20

        doc.setFontSize(14)
        doc.text(`Receitas Mensais - ${selectedYear}`, 14, yPosition)
        yPosition += 7

        const monthlyTableData = monthlyRevenue.map(month => [
          month.month,
          month.registrations_count.toString(),
          formatCurrency(month.total_revenue),
          formatCurrency(month.confirmed_revenue),
        ])

        autoTable(doc, {
          startY: yPosition,
          head: [['Mês', 'Inscrições', 'Receita Total', 'Receita Confirmada']],
          body: monthlyTableData,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [59, 130, 246] },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10
      }

      // Métodos de Pagamento
      if (paymentMethodStats && paymentMethodStats.length > 0) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(14)
        doc.text('Métodos de Pagamento', 14, yPosition)
        yPosition += 7

        const paymentTableData = paymentMethodStats.map(method => [
          method.method,
          method.total_transactions.toString(),
          method.completed_transactions.toString(),
          formatCurrency(method.confirmed_revenue),
          `${method.total_transactions > 0 ? Math.round((method.completed_transactions / method.total_transactions) * 100) : 0}%`,
        ])

        autoTable(doc, {
          startY: yPosition,
          head: [['Método', 'Total', 'Completas', 'Receita', 'Taxa']],
          body: paymentTableData,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [59, 130, 246] },
        })
      }

      // Salvar PDF
      const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      showModal('Relatório PDF gerado com sucesso!', {
        type: 'success',
        title: 'Sucesso',
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      showModal(
        `Não foi possível gerar o relatório PDF.\n\nDetalhes: ${errorMessage}\n\nVerifique se todas as dependências estão instaladas corretamente.`,
        {
          type: 'error',
          title: 'Erro ao Gerar PDF',
        }
      )
    }
  }

  return (
    <div className="p-3">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
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
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 px-4 md:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm md:text-base"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 px-4 md:px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm md:text-base"
            >
              Limpar
            </button>
            <button
              onClick={generatePDF}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <Download size={18} />
              PDF
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
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Por Evento
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Métodos de Pagamento</span>
              <span className="sm:hidden">Pagamentos</span>
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
              <div className="overflow-x-auto -mx-3 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscrições
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confirmadas
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita Total
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita Confirmada
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {eventSummaries.map((event) => (
                        <tr key={event.event_id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900 min-w-[150px]">
                              {event.event_title}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-xs md:text-sm text-gray-500">
                              {formatDate(event.event_date)}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getCategoryLabel(event.event_category)}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {formatCurrency(event.event_price)}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {event.total_registrations}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-xs md:text-sm text-green-600 font-semibold">
                              {event.confirmed_registrations}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                            {formatCurrency(event.total_revenue)}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                            {formatCurrency(event.confirmed_revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                  Receitas Mensais - {selectedYear}
                </h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inscrições
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receita Total
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receita Confirmada
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthlyRevenue.map((month, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                              <div className="text-xs md:text-sm font-medium text-gray-900 capitalize">
                                {month.month}
                              </div>
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                              {month.registrations_count}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                              {formatCurrency(month.total_revenue)}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                              {formatCurrency(month.confirmed_revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
