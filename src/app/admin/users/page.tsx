'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Trash2, Edit2, Plus, CheckCircle, X, User, Eye } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'artist' | 'user';
  is_active: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'artist' | 'user',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar usuários com base no termo de busca
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
    setIsEditing(false);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleNewUserClick = () => {
    resetForm();
    setShowForm(!showForm);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Salvando usuário...');
    
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `${API_URL}/users/${formData.id}` : `${API_URL}/auth/register`;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Se estiver editando e a senha estiver vazia, não envia o campo password
      const requestData = isEditing && !formData.password
        ? { ...formData, password: undefined }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', 
          {
            id: loadingToast,
            icon: <CheckCircle className="text-green-500" />,
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
            duration: 3000,
          }
        );
        
        setFormData({ id: '', name: '', email: '', password: '', role: 'user' });
        setShowForm(false);
        setIsEditing(false);
        fetchUsers();
      } else {
        throw new Error(data.message || 'Erro ao salvar usuário');
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar usuário',
        {
          id: loadingToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Usuário excluído com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        });
        fetchUsers();
      } else {
        throw new Error('Falha ao excluir usuário');
      }
    } catch (error) {
      toast.error('Erro ao excluir usuário', {
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
      console.error('Falha ao excluir usuário:', error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de pesquisa, contador e botão de novo usuário */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        {/* Campo de busca */}
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Pesquisar usuários..."
            className="w-full px-4 py-2 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Contador de usuários */}
        <div className="text-sm text-slate-500 whitespace-nowrap">
          {users.length} usuários cadastrados
        </div>
        
        {/* Botão Novo Usuário */}
        <button
          onClick={handleNewUserClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow hover:shadow-md"
        >
          <Plus size={16} />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Modal de Criação/Edição */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Nome</label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    placeholder="Digite o email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {isEditing ? 'Nova Senha' : 'Senha'}
                    {isEditing && <span className="text-slate-400 ml-1 font-normal">(opcional)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder={isEditing ? "Deixe em branco para manter a senha atual" : "Digite uma senha"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'artist' | 'user' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="user">Usuário</option>
                    <option value="artist">Artista</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  {isEditing ? 'Atualizar' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Função</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Data Criação</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Ações</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-4 text-slate-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : user.role === 'artist'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : user.role === 'artist' ? 'Artista' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active ? '✓ Ativo' : '✗ Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(user)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 font-medium"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 font-medium"
                          title="Editar usuário"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                          title="Excluir usuário"
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

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Confirmar exclusão</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                ref={deleteButtonRef}
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Usuário */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User size={24} className="text-blue-600" />
                Detalhes do Usuário
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Função</span>
                  <span className="text-sm text-slate-900 font-medium capitalize">
                    {selectedUser.role === 'admin' ? 'Administrador' : 
                     selectedUser.role === 'artist' ? 'Artista' : 'Usuário'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Status</span>
                  <span className={`text-sm font-medium ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedUser.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-slate-500">Membro desde</span>
                  <span className="text-sm text-slate-900">
                    {new Date(selectedUser.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    handleEditUser(selectedUser);
                    setShowDetailsModal(false);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
