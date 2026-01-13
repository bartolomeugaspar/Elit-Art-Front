import { useState } from 'react';
import api from '@/lib/api';

export interface ArtistQuota {
  id: string;
  artist_id: string;
  artist_name?: string;
  artist_email?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  payment_reference?: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_of_payment?: string;
  notes?: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuotaStats {
  total_quotas: number;
  pending_quotas: number;
  approved_quotas: number;
  rejected_quotas: number;
  total_amount_paid: number;
  total_amount_pending: number;
  total_amount_approved: number;
  total_amount_rejected: number;
}

export function useAdminQuotas() {
  const [quotas, setQuotas] = useState<ArtistQuota[]>([]);
  const [stats, setStats] = useState<QuotaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotas = async (status?: string) => {
    try {
      setLoading(true);
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/artist-quotas${params}`);
      setQuotas(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar quotas');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/artist-quotas');
      const allQuotas: ArtistQuota[] = response.data;
      
      const stats: QuotaStats = {
        total_quotas: allQuotas.length,
        pending_quotas: allQuotas.filter(q => q.status === 'pending').length,
        approved_quotas: allQuotas.filter(q => q.status === 'approved').length,
        rejected_quotas: allQuotas.filter(q => q.status === 'rejected').length,
        total_amount_paid: allQuotas.reduce((sum, q) => sum + q.amount, 0),
        total_amount_pending: allQuotas.filter(q => q.status === 'pending').reduce((sum, q) => sum + q.amount, 0),
        total_amount_approved: allQuotas.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.amount, 0),
        total_amount_rejected: allQuotas.filter(q => q.status === 'rejected').reduce((sum, q) => sum + q.amount, 0),
      };
      
      setStats(stats);
    } catch (err: any) {
    }
  };

  const approveQuota = async (id: string, notes?: string) => {
    try {
      await api.patch(`/artist-quotas/${id}/approve`, { status: 'approved', notes });
      await fetchQuotas();
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao aprovar quota');
    }
  };

  const rejectQuota = async (id: string, notes?: string) => {
    try {
      await api.patch(`/artist-quotas/${id}/approve`, { status: 'rejected', notes });
      await fetchQuotas();
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao rejeitar quota');
    }
  };

  const deleteQuota = async (id: string) => {
    try {
      await api.delete(`/artist-quotas/${id}`);
      await fetchQuotas();
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao excluir quota');
    }
  };

  return {
    quotas,
    stats,
    loading,
    error,
    fetchQuotas,
    fetchStats,
    approveQuota,
    rejectQuota,
    deleteQuota,
  };
}
