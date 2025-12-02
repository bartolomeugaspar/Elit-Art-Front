'use client';

import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle, UserCheck, AlertCircle, X } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Registration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  status: 'registered' | 'attended' | 'cancelled';
  payment_status: string;
  payment_method?: string;
  proof_url?: string;
  created_at: string;
  event?: {
    id: string;
    title: string;
  };
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function AdminRegistrations() {
  // O AdminLayout já está sendo aplicado pelo layout.tsx do diretório admin
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  
  // Filtrar inscrições com base no termo de busca
  const filteredRegistrations = registrations.filter(registration => 
    registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleUpdateStatus = async (id: string, status: 'registered' | 'attended' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchRegistrations();
        const statusLabel = status === 'attended' ? 'confirmada' : status === 'cancelled' ? 'cancelada' : 'registrada';
        showToast(`Inscrição ${statusLabel} com sucesso!`, 'success');
      } else {
        showToast('Erro ao atualizar inscrição', 'error');
      }
    } catch (error) {
      showToast('Erro ao atualizar inscrição', 'error');
    }
  };

  const handleDeleteClick = (registration: Registration) => {
    setRegistrationToDelete(registration);
    setShowDeleteModal(true);
  };

  const handleDeleteRegistration = async () => {
    if (!registrationToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/registrations/${registrationToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('Inscrição deletada com sucesso!', 'success');
        fetchRegistrations();
      } else {
        showToast('Erro ao deletar inscrição', 'error');
      }
    } catch (error) {
      showToast('Erro ao deletar inscrição', 'error');
    } finally {
      setShowDeleteModal(false);
      setRegistrationToDelete(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'registered':
        return 'Registrada';
      case 'attended':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-100 text-blue-700';
      case 'attended':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const attendedCount = registrations.filter(
    (r) => r.status === 'attended'
  ).length;
  const registeredCount = registrations.filter(
    (r) => r.status === 'registered'
  ).length;

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Inscrições</h1>
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Pesquisar inscrições..."
              className="w-full px-4 py-2 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
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
                  {attendedCount}
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
                <p className="text-slate-600 text-sm font-medium">Registradas</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {registeredCount}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg">
                <XCircle size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Data Inscrição
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Carregando inscrições...
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                      {searchTerm ? 'Nenhuma inscrição encontrada para a busca' : 'Nenhuma inscrição encontrada'}
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs lg:text-sm font-medium text-slate-900">{registration.full_name || 'N/A'}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs lg:text-sm text-slate-600">{registration.email || 'N/A'}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs lg:text-sm text-slate-600">{registration.event?.title || 'N/A'}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            registration.status
                          )}`}
                        >
                          {getStatusLabel(registration.status)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs lg:text-sm text-slate-600">
                          {new Date(registration.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                        <div className="flex justify-end space-x-1 lg:space-x-2">
                          {registration.status !== 'attended' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(registration.id, 'attended')
                              }
                              className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 transition-colors"
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
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                              title="Cancelar"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          {registration.proof_url && (
                            <a
                              href={registration.proof_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                              title="Baixar comprovativo"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </a>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteClick(registration)
                            }
                            className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
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

        {/* Registrations Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-500">Carregando inscrições...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? 'Nenhuma inscrição encontrada para a busca' : 'Nenhuma inscrição encontrada'}
            </div>
          ) : (
            filteredRegistrations.map((registration) => (
              <div key={registration.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{registration.full_name || 'N/A'}</h3>
                    <p className="text-xs text-slate-500 truncate">{registration.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Evento:</span>
                    <span className="text-xs text-slate-600 truncate">{registration.event?.title || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        registration.status
                      )}`}
                    >
                      {getStatusLabel(registration.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Inscrição:</span>
                    <span className="text-xs text-slate-600">{new Date(registration.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {registration.status !== 'attended' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(registration.id, 'attended')
                      }
                      className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
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
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Cancelar"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  {registration.proof_url && (
                    <a
                      href={registration.proof_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Baixar comprovativo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() =>
                      handleDeleteClick(registration)
                    }
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Deletar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-right-4 ${
                toast.type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && registrationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Deletar Inscrição</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRegistrationToDelete(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-slate-600 mb-4">
                  Tem certeza que deseja deletar esta inscrição? Esta ação não pode ser desfeita.
                </p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Usuário:</span>
                    <span className="text-sm text-slate-900 font-semibold">{registrationToDelete.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Email:</span>
                    <span className="text-sm text-slate-900 font-semibold">{registrationToDelete.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Evento:</span>
                    <span className="text-sm text-slate-900 font-semibold">{registrationToDelete.event?.title || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Status:</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${getStatusColor(registrationToDelete.status)}`}>
                      {getStatusLabel(registrationToDelete.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRegistrationToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteRegistration}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
