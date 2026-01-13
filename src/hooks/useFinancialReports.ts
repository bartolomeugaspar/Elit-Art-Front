import { useState, useEffect } from 'react'
import { apiCallWithAuth } from '@/lib/api'

export interface EventFinancialSummary {
  event_id: string
  event_title: string
  event_date: string
  event_category: string
  total_registrations: number
  confirmed_registrations: number
  pending_registrations: number
  cancelled_registrations: number
  total_revenue: number
  confirmed_revenue: number
  pending_revenue: number
  event_price: number
}

export interface FinancialOverview {
  total_revenue: number
  confirmed_revenue: number
  pending_revenue: number
  total_registrations: number
  confirmed_registrations: number
  pending_registrations: number
  events_with_revenue: number
}

export interface MonthlyRevenue {
  month: string
  year: number
  total_revenue: number
  confirmed_revenue: number
  registrations_count: number
}

export interface PaymentMethodStats {
  method: string
  total_transactions: number
  completed_transactions: number
  total_revenue: number
  confirmed_revenue: number
}

export interface QuotaPaymentSummary {
  payment_id: string
  artist_id: string
  artist_name: string
  artist_email: string
  valor: number
  mes_referencia: string
  metodo_pagamento: string
  status: string
  data_envio: string
  data_aprovacao?: string
  aprovado_por_nome?: string
  observacoes?: string
  notas_admin?: string
}

export interface QuotaPaymentOverview {
  total_payments: number
  pending_payments: number
  approved_payments: number
  rejected_payments: number
  total_amount: number
  approved_amount: number
  pending_amount: number
  rejected_amount: number
}

export const useFinancialReports = () => {
  const [overview, setOverview] = useState<FinancialOverview | null>(null)
  const [eventSummaries, setEventSummaries] = useState<EventFinancialSummary[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [paymentMethodStats, setPaymentMethodStats] = useState<PaymentMethodStats[]>([])
  const [quotasOverview, setQuotasOverview] = useState<QuotaPaymentOverview | null>(null)
  const [quotaPayments, setQuotaPayments] = useState<QuotaPaymentSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = async (startDate?: string, endDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiCallWithAuth(
        `financial-reports/overview?${params.toString()}`,
        token
      )
      const data = await response.json()
      setOverview(data.overview)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar visão geral financeira')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventSummaries = async (startDate?: string, endDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiCallWithAuth(
        `financial-reports/events?${params.toString()}`,
        token
      )
      const data = await response.json()
      setEventSummaries(data.events)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar resumo de eventos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyRevenue = async (year?: number) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = year ? `?year=${year}` : ''
      const response = await apiCallWithAuth(
        `financial-reports/monthly${params}`,
        token
      )
      const data = await response.json()
      setMonthlyRevenue(data.months)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar receitas mensais')
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethodStats = async (startDate?: string, endDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiCallWithAuth(
        `financial-reports/payment-methods?${params.toString()}`,
        token
      )
      const data = await response.json()
      setPaymentMethodStats(data.paymentMethods)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas de pagamento')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventRegistrationDetails = async (eventId: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const response = await apiCallWithAuth(
        `financial-reports/events/${eventId}/registrations`,
        token
      )
      const data = await response.json()
      return data.registrations
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar detalhes das inscrições')
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotasOverview = async (startDate?: string, endDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await apiCallWithAuth(
        `financial-reports/quotas/overview?${params.toString()}`,
        token
      )
      const data = await response.json()
      setQuotasOverview(data.overview)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar resumo de quotas')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotaPayments = async (startDate?: string, endDate?: string, status?: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (status) params.append('status', status)

      const response = await apiCallWithAuth(
        `financial-reports/quotas?${params.toString()}`,
        token
      )
      const data = await response.json()
      setQuotaPayments(data.payments)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pagamentos de quotas')
    } finally {
      setLoading(false)
    }
  }

  const downloadFullPDF = async (startDate?: string, endDate?: string, year?: number, includeQuotas = true) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (year) params.append('year', year.toString())
      params.append('includeQuotas', includeQuotas.toString())

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/financial-reports/download-pdf?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao baixar relatório PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao baixar relatório PDF')
    }
  }

  const downloadQuotasPDF = async (startDate?: string, endDate?: string, status?: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (status) params.append('status', status)

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/financial-reports/quotas/download-pdf?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao baixar relatório de quotas PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-quotas-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao baixar relatório de quotas PDF')
    }
  }

  return {
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
    fetchEventRegistrationDetails,
    fetchQuotasOverview,
    fetchQuotaPayments,
    downloadFullPDF,
    downloadQuotasPDF,
  }
}
