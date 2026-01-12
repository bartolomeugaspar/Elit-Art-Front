import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface ArtistQuota {
  id: number;
  artist_id: number;
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
  updated_at: string;
}

export interface QuotaStats {
  total_quotas: number;
  pending_quotas: number;
  approved_quotas: number;
  rejected_quotas: number;
  total_amount_paid: number;
}

export interface ArtworkStats {
  total_artworks: number;
  available_artworks: number;
  sold_artworks: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

export interface SalesStats {
  total_sales: number;
  total_revenue: number;
  unique_customers: number;
  avg_sale_value: number;
}

export interface RecentPerformance {
  recent_sales: number;
  recent_revenue: number;
}

export interface MonthlyTrend {
  month: string;
  sales_count: number;
  revenue: number;
}

export interface TopArtwork {
  id: number;
  title: string;
  price: number;
  times_sold: number;
  total_quantity_sold: number;
  total_revenue: number;
}

export interface PerformanceStats {
  artwork_stats: ArtworkStats;
  sales_stats: SalesStats;
  recent_performance: RecentPerformance;
  monthly_trend: MonthlyTrend[];
  top_artworks: TopArtwork[];
}

export function useArtistQuotas() {
  const [quotas, setQuotas] = useState<ArtistQuota[]>([]);
  const [stats, setStats] = useState<QuotaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/artist-quotas/my-quotas');
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
      const response = await api.get('/artist-quotas/my-stats');
      setStats(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const createQuota = async (formData: FormData) => {
    try {
      const response = await api.post('/artist-quotas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchQuotas();
      await fetchStats();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar quota');
    }
  };

  const updateQuota = async (id: number, formData: FormData) => {
    try {
      const response = await api.put(`/artist-quotas/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchQuotas();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao atualizar quota');
    }
  };

  const deleteQuota = async (id: number) => {
    try {
      await api.delete(`/artist-quotas/${id}`);
      await fetchQuotas();
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao excluir quota');
    }
  };

  useEffect(() => {
    fetchQuotas();
    fetchStats();
  }, []);

  return {
    quotas,
    stats,
    loading,
    error,
    createQuota,
    updateQuota,
    deleteQuota,
    refreshQuotas: fetchQuotas,
    refreshStats: fetchStats
  };
}

export function useArtistPerformance() {
  const [performance, setPerformance] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/artist-performance/my-stats');
      setPerformance(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar desempenho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  return {
    performance,
    loading,
    error,
    refreshPerformance: fetchPerformance
  };
}
