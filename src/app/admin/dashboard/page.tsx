'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, Calendar, UserCheck, Mail, TrendingUp, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  newsletterSubscribers: number;
}

// Skeleton Loader Component
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
          <div className="h-10 bg-slate-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-20"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    newsletterSubscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, eventsRes, registrationsRes, newsletterRes] = await Promise.all([
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/events`, { headers }),
        fetch(`${API_URL}/registrations`, { headers }),
        fetch(`${API_URL}/newsletter`, { headers }),
      ]);

      const [usersData, eventsData, registrationsData, newsletterData] = await Promise.all([
        usersRes.json(),
        eventsRes.json(),
        registrationsRes.json(),
        newsletterRes.json(),
      ]);

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalEvents: eventsData.events?.length || 0,
        totalRegistrations: registrationsData.registrations?.length || 0,
        newsletterSubscribers: newsletterData.subscribers?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Usuários</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">
                {loading ? '...' : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Eventos</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">
                {loading ? '...' : stats.totalEvents}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Inscrições</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">
                {loading ? '...' : stats.totalRegistrations}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Newsletter</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">
                {loading ? '...' : stats.newsletterSubscribers}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
