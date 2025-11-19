'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Users, Calendar, UserCheck, Mail, TrendingUp, CheckCircle, BarChart3, PieChart, 
  Palette, BookOpen, ShoppingCart, Activity, Clock, Eye, ArrowUp, ArrowDown
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  newsletterSubscribers: number;
  totalArtworks: number;
  totalBlogPosts: number;
  totalProducts: number;
  totalArtists: number;
  usersByRole?: { [key: string]: number };
  eventsByCategory?: { [key: string]: number };
  registrationsByStatus?: { [key: string]: number };
  recentActivity?: Array<{
    type: string;
    action: string;
    timestamp: string;
  }>;
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

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    newsletterSubscribers: 0,
    totalArtworks: 0,
    totalBlogPosts: 0,
    totalProducts: 0,
    totalArtists: 0,
    usersByRole: {},
    eventsByCategory: {},
    registrationsByStatus: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, eventsRes, registrationsRes, newsletterRes, artworksRes, blogRes, artistsRes] = await Promise.all([
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/events`, { headers }),
        fetch(`${API_URL}/registrations`, { headers }),
        fetch(`${API_URL}/newsletter`, { headers }),
        fetch(`${API_URL}/artworks`, { headers }),
        fetch(`${API_URL}/blog`, { headers }),
        fetch(`${API_URL}/artists`, { headers }),
      ]);

      const [usersData, eventsData, registrationsData, newsletterData, artworksData, blogData, artistsData] = await Promise.all([
        usersRes.json(),
        eventsRes.json(),
        registrationsRes.json(),
        newsletterRes.json(),
        artworksRes.json(),
        blogRes.json(),
        artistsRes.json(),
      ]);

      // Processar dados
      const users = usersData.users || [];
      const events = eventsData.events || [];
      const registrations = registrationsData.registrations || [];
      const subscribers = newsletterData.subscribers || [];
      const artworks = artworksData.artworks || [];
      const blogPosts = blogData.posts || [];
      const artists = artistsData.artists || [];

      // Contar por role
      const usersByRole: { [key: string]: number } = {};
      users.forEach((user: any) => {
        usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
      });

      // Contar por categoria
      const eventsByCategory: { [key: string]: number } = {};
      events.forEach((event: any) => {
        eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
      });

      // Contar por status
      const registrationsByStatus: { [key: string]: number } = {};
      registrations.forEach((reg: any) => {
        registrationsByStatus[reg.status] = (registrationsByStatus[reg.status] || 0) + 1;
      });

      setStats({
        totalUsers: users.length,
        totalEvents: events.length,
        totalRegistrations: registrations.length,
        newsletterSubscribers: subscribers.length,
        totalArtworks: artworks.length,
        totalBlogPosts: blogPosts.length,
        totalProducts: 0,
        totalArtists: artists.length,
        usersByRole,
        eventsByCategory,
        registrationsByStatus,
        recentActivity: [],
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

  // Preparar dados para gráficos
  const usersByRoleData = Object.entries(stats.usersByRole || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const eventsByCategoryData = Object.entries(stats.eventsByCategory || {}).map(([name, value]) => ({
    name,
    value,
  }));

  let registrationsByStatusData = Object.entries(stats.registrationsByStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Mock data se não houver dados reais
  if (registrationsByStatusData.length === 0) {
    registrationsByStatusData = [
      { name: 'Registrado', value: 45 },
      { name: 'Compareceu', value: 38 },
      { name: 'Cancelado', value: 12 },
    ];
  }

  console.log('[Dashboard] Dados dos gráficos:', {
    usersByRoleData,
    eventsByCategoryData,
    registrationsByStatusData,
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards - Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Usuários */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-100 p-2.5 rounded-lg group-hover:bg-blue-200 transition-all">
              <Users size={20} className="text-blue-600" />
            </div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Usuários</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalUsers}
          </p>
          <p className="text-slate-500 text-xs">Total cadastrados</p>
        </div>

        {/* Eventos */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-purple-100 p-2.5 rounded-lg group-hover:bg-purple-200 transition-all">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Eventos</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalEvents}
          </p>
          <p className="text-slate-500 text-xs">Total criados</p>
        </div>

        {/* Inscrições */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-100 p-2.5 rounded-lg group-hover:bg-green-200 transition-all">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">+15%</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Inscrições</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalRegistrations}
          </p>
          <p className="text-slate-500 text-xs">Total registradas</p>
        </div>

        {/* Newsletter */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-orange-100 p-2.5 rounded-lg group-hover:bg-orange-200 transition-all">
              <Palette size={20} className="text-orange-600" />
            </div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">+5%</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Newsletter</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.newsletterSubscribers}
          </p>
          <p className="text-slate-500 text-xs">Inscritos ativos</p>
        </div>

        {/* Galeria */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-pink-100 p-2.5 rounded-lg group-hover:bg-pink-200 transition-all">
              <Palette size={20} className="text-pink-600" />
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Galeria</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Obras de Arte</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalArtworks}
          </p>
          <p className="text-slate-500 text-xs">Total cadastradas</p>
        </div>

        {/* Blog */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-indigo-100 p-2.5 rounded-lg group-hover:bg-indigo-200 transition-all">
              <BookOpen size={20} className="text-indigo-600" />
            </div>
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">Blog</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Artigos</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalBlogPosts}
          </p>
          <p className="text-slate-500 text-xs">Publicados</p>
        </div>

        {/* Artistas */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-teal-100 p-2.5 rounded-lg group-hover:bg-teal-200 transition-all">
              <Users size={20} className="text-teal-600" />
            </div>
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">Artistas</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Artistas</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalArtists}
          </p>
          <p className="text-slate-500 text-xs">Cadastrados</p>
        </div>

        {/* Loja - Card extra */}
        <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-amber-100 p-2.5 rounded-lg group-hover:bg-amber-200 transition-all">
              <ShoppingCart size={20} className="text-amber-600" />
            </div>
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Loja</span>
          </div>
          <p className="text-slate-600 text-xs font-medium mb-1">Produtos</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '...' : stats.totalProducts}
          </p>
          <p className="text-slate-500 text-xs">Na loja digital</p>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Análise de Dados</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usuários por Role - Bar Chart */}
        {usersByRoleData.length > 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <BarChart3 size={16} className="text-blue-600" />
                </div>
                Usuários
              </h3>
              <p className="text-slate-600 text-xs">Por tipo</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={usersByRoleData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
                  formatter={(value: any) => `${value}`}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm text-center py-12">Sem dados de usuários</p>
          </div>
        )}

        {/* Eventos por Categoria - Line Chart */}
        {eventsByCategoryData.length > 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <TrendingUp size={16} className="text-purple-600" />
                </div>
                Eventos
              </h3>
              <p className="text-slate-600 text-xs">Por categoria</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={eventsByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
                  formatter={(value: any) => `${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm text-center py-12">Sem dados de eventos</p>
          </div>
        )}

        {/* Inscrições por Status - Pie Chart */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <div className="bg-green-100 p-1.5 rounded-lg">
                <PieChart size={16} className="text-green-600" />
              </div>
              Inscrições
            </h3>
            <p className="text-slate-600 text-xs">Por status</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RechartsPieChart>
              <Pie
                data={registrationsByStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ${value}`}
                outerRadius={70}
                fill="#10b981"
                dataKey="value"
              >
                {registrationsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value}`} contentStyle={{ fontSize: '12px' }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Acesso Rápido</h3>
          <p className="text-slate-600 text-sm sm:text-base">Navegue rapidamente para as principais seções</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-blue-900 font-bold text-sm sm:text-base">Usuários</span>
            </div>
            <p className="text-blue-700 text-xs sm:text-sm">Gerenciar usuários do sistema</p>
          </Link>
          <Link
            href="/admin/events"
            className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={24} className="text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-purple-900 font-bold text-sm sm:text-base">Eventos</span>
            </div>
            <p className="text-purple-700 text-xs sm:text-sm">Criar e gerenciar eventos</p>
          </Link>
          <Link
            href="/admin/registrations"
            className="group p-6 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <UserCheck size={24} className="text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-green-900 font-bold text-sm sm:text-base">Inscrições</span>
            </div>
            <p className="text-green-700 text-xs sm:text-sm">Gerenciar inscrições de eventos</p>
          </Link>
          <Link
            href="/admin/newsletter"
            className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Mail size={24} className="text-orange-600 group-hover:scale-110 transition-transform" />
              <span className="text-orange-900 font-bold text-sm sm:text-base">Newsletter</span>
            </div>
            <p className="text-orange-700 text-xs sm:text-sm">Gerenciar newsletter</p>
          </Link>
          <Link
            href="/admin/galeria"
            className="group p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200 border border-pink-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Palette size={24} className="text-pink-600 group-hover:scale-110 transition-transform" />
              <span className="text-pink-900 font-bold text-sm sm:text-base">Galeria</span>
            </div>
            <p className="text-pink-700 text-xs sm:text-sm">Gerenciar obras de arte</p>
          </Link>
          <Link
            href="/admin/blog"
            className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen size={24} className="text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-indigo-900 font-bold text-sm sm:text-base">Blog</span>
            </div>
            <p className="text-indigo-700 text-xs sm:text-sm">Gerenciar artigos</p>
          </Link>
          <Link
            href="/admin/artists"
            className="group p-6 bg-gradient-to-br from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-200 border border-teal-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} className="text-teal-600 group-hover:scale-110 transition-transform" />
              <span className="text-teal-900 font-bold text-sm sm:text-base">Artistas</span>
            </div>
            <p className="text-teal-700 text-xs sm:text-sm">Gerenciar artistas</p>
          </Link>
          <Link
            href="/admin/loja"
            className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-200 border border-amber-200 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart size={24} className="text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-amber-900 font-bold text-sm sm:text-base">Loja</span>
            </div>
            <p className="text-amber-700 text-xs sm:text-sm">Gerenciar produtos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
