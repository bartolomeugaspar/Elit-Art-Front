'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FileText, Search, Calendar as CalendarIcon, User, X, LogIn, LogOut, AlertTriangle, Shield } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuditLog {
  id: number;
  user_id: string | null;
  user?: User | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalLogins: 0,
    totalLogouts: 0,
    failedAttempts: 0,
    suspiciousActivities: 0,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    // O AdminLayout já verifica autenticação, então apenas carregamos os logs
    if (user) {
      fetchLogs();
    }
  }, [user, page, searchTerm, selectedUser, dateFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((page - 1) * itemsPerPage).toString(),
        ...(selectedUser && { userId: selectedUser }),
      });

      const response = await fetch(`${API_URL}/audit-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLogs(data.data || []);
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage));
      } else {
        console.error('Error fetching audit logs:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action: string) => {
    const actions: Record<string, string> = {
      'LOGIN': 'LOGIN',
      'LOGOUT': 'LOGOUT',
      'LOGIN_FAILED': 'Login Falhado',
      'LOGIN_FAILED_VALIDATION': 'Login Falhado (Validação)',
      'user.login': 'Login de Usuário',
      'user.create': 'Criar Usuário',
      'user.update': 'Atualizar Usuário',
      'user.delete': 'Excluir Usuário',
      'event.create': 'Criar Evento',
      'event.update': 'Atualizar Evento',
      'event.delete': 'Excluir Evento',
      'registration.create': 'Nova Inscrição',
      'registration.update': 'Atualizar Inscrição',
      'registration.delete': 'Excluir Inscrição',
    };
    
    return actions[action] || action;
  };

  const formatEntity = (entity: string) => {
    const entities: Record<string, string> = {
      'user': 'Usuário',
      'event': 'Evento',
      'registration': 'Inscrição',
      'newsletter': 'Newsletter',
    };
    
    return entities[entity] || entity;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUser(null);
    setDateFilter(null);
    setPage(1);
  };

  // Audit logs are read-only and cannot be deleted
  // This ensures data integrity and compliance with audit trail requirements

  const calculateStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar todos os logs para calcular estatísticas
      const response = await fetch(`${API_URL}/audit-logs?limit=1000&offset=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      const allLogs = data.data || [];
      
      // Calcular estatísticas
      const totalLogins = allLogs.filter((log: AuditLog) => log.action === 'LOGIN').length;
      const totalLogouts = allLogs.filter((log: AuditLog) => log.action === 'LOGOUT').length;
      const failedAttempts = allLogs.filter((log: AuditLog) => 
        log.action === 'LOGIN_FAILED' || 
        log.action === 'LOGIN_FAILED_VALIDATION' ||
        log.action.includes('FAILED') || 
        log.action.includes('ERROR')
      ).length;
      const suspiciousActivities = allLogs.filter((log: AuditLog) => 
        log.action.includes('DELETE') || 
        log.action.includes('UPDATE') ||
        log.action.includes('FAILED')
      ).length;
      
      setStats({
        totalLogins,
        totalLogouts,
        failedAttempts,
        suspiciousActivities,
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }
  };

  useEffect(() => {
    if (user) {
      calculateStats();
    }
  }, [user]);

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Logins */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Logins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogins}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <LogIn className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Logouts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Logouts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogouts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <LogOut className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Failed Attempts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tentativas Falhadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.failedAttempts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Suspicious Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atividades Suspeitas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.suspiciousActivities}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por ação..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 border text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 border text-gray-900"
              value={dateFilter ? dateFilter.toISOString().split('T')[0] : ''}
              onChange={(e) => setDateFilter(e.target.value ? new Date(e.target.value) : null)}
            />
          </div>
          
          {(searchTerm || dateFilter || selectedUser) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Logs Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum log encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Nenhum registro de log corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-medium text-gray-900">
                        {formatAction(log.action)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.entity_id}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                        log.user?.role === 'Arteist' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.user?.role ? log.user.role.charAt(0).toUpperCase() + log.user.role.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-xs lg:text-sm font-medium text-gray-900">
                            {log.user?.name || 'Sistema'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-500 max-w-xs truncate" title={log.user_agent || 'N/A'}>
                      {log.user_agent || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Logs Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum log encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Nenhum registro de log corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{formatAction(log.action)}</h3>
                  <p className="text-xs text-gray-500 truncate">{log.entity_id}</p>
                </div>
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                  log.user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  log.user?.role === 'Arteist' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {log.user?.role ? log.user.role.charAt(0).toUpperCase() + log.user.role.slice(1) : 'N/A'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                    <User className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900">
                      {log.user?.name || 'Sistema'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {log.user?.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">Data:</span>
                  <span className="text-xs text-gray-600">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 flex-shrink-0">User Agent:</span>
                  <span className="text-xs text-gray-600 truncate" title={log.user_agent || 'N/A'}>{log.user_agent || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg">
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            <div className="mx-4 flex items-center">
              <span className="text-sm text-gray-700">
                Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
              </span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
