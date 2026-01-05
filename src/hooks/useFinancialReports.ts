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

export const useFinancialReports = () => {
  const [overview, setOverview] = useState<FinancialOverview | null>(null)
  const [eventSummaries, setEventSummaries] = useState<EventFinancialSummary[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [paymentMethodStats, setPaymentMethodStats] = useState<PaymentMethodStats[]>([])
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

  return {
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
    fetchEventRegistrationDetails,
  }
}
