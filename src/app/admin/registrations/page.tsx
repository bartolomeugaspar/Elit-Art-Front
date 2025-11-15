'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  event?: {
    title: string;
  };
}

export default function AdminRegistrations() {
  // O AdminLayout já está sendo aplicado pelo layout.tsx do diretório admin
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Failed to update registration status:', error);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta inscrição?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Failed to delete registration:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const confirmedCount = registrations.filter(
    (r) => r.status === 'confirmed'
  ).length;
  const pendingCount = registrations.filter(
    (r) => r.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Inscrições</h1>
          <p className="text-slate-600 mt-1">Total de {registrations.length} inscrições</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total de Inscrições</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">
                  {registrations.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg">
                <UserCheck size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Confirmadas</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {registrations.filter((r) => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pendentes</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">
                  {registrations.filter((r) => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg">
                <XCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Evento
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Data Inscrição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Carregando...
                      </div>
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Nenhuma inscrição encontrada
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition duration-200"
                    >
                      <td className="px-6 py-4 text-slate-900 font-medium">
                        {registration.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.user?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {registration.event?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            registration.status
                          )}`}
                        >
                          {getStatusLabel(registration.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {new Date(registration.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {registration.status !== 'confirmed' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(registration.id, 'confirmed')
                              }
                              className="p-2 hover:bg-green-100 rounded-lg transition text-green-600 font-medium"
                              title="Confirmar"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {registration.status !== 'cancelled' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(registration.id, 'cancelled')
                              }
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                              title="Cancelar"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteRegistration(registration.id)
                            }
                            className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
