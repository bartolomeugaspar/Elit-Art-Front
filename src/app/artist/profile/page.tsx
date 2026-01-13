'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api, { API_URL } from '@/lib/api';
import { User, Lock, Mail, CheckCircle, XCircle, Loader2, Camera, Shield, Calendar, Phone, Palette } from 'lucide-react';

export default function ArtistProfile() {
  const { user } = useAuth();
  
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    const fetchArtist = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/artists/profile/${user.id}`);
        const artistData = response.data.data || response.data;
        
        setArtist(artistData);
        setImagePreview(artistData.image || artistData.profile_image || null);
      } catch (error) {
        showToast('error', 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [user]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 5000);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      showToast('error', 'Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Imagem não pode ser maior que 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setImagePreview(data.imageUrl);
        showToast('success', 'Imagem enviada com sucesso!');
        
        // Atualizar a foto de perfil imediatamente no backend
        await updateProfileImage(data.imageUrl, token);
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem');
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Erro ao enviar imagem');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const updateProfileImage = async (imageUrl: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile_image: imageUrl })
      });

      if (response.ok) {
        // Recarregar para atualizar o contexto do usuário
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      // Erro silencioso
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validações
    if (passwordData.newPassword.length < 6) {
      showToast('error', 'A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'As senhas não coincidem');
      return;
    }

    setChangingPassword(true);
    try {
      await api.put(`/artists/profile/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      showToast('success', 'Senha alterada com sucesso!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validações
    if (!newName.trim()) {
      showToast('error', 'Nome não pode estar vazio');
      return;
    }

    if (newName.length > 100) {
      showToast('error', 'Nome não pode ter mais de 100 caracteres');
      return;
    }

    setEditingName(true);
    try {
      await api.put(`/artists/profile/${user.id}/name`, {
        name: newName.trim()
      });
      
      showToast('success', 'Nome atualizado com sucesso!');
      setShowNameForm(false);
      setNewName('');
      
      // Recarregar dados do artista
      const response = await api.get(`/artists/profile/${user.id}`);
      const artistData = response.data.data || response.data;
      setArtist(artistData);
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao atualizar nome');
    } finally {
      setEditingName(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elit-orange"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Perfil de artista não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 transition-all duration-300">
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl border-2 min-w-full sm:min-w-[300px] ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-900' 
              : 'bg-red-50 border-red-500 text-red-900'
          }`}>
            <div className={`flex-shrink-0 ${
              toast.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle size={20} className="sm:w-6 sm:h-6" />
              ) : (
                <XCircle size={20} className="sm:w-6 sm:h-6" />
              )}
            </div>
            <p className="font-medium text-sm sm:text-base">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header with Profile Image */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            {imagePreview || artist.image || artist.profile_image ? (
              <img
                src={imagePreview || artist.image || artist.profile_image}
                alt={artist.name}
                className="w-20 h-20 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-elit-orange"
              />
            ) : (
              <div className="w-20 h-20 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-elit-orange to-elit-gold rounded-full flex items-center justify-center">
                <User size={32} className="text-white sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="absolute -bottom-1 -right-1 bg-gradient-to-r from-elit-orange to-elit-gold hover:from-elit-gold hover:to-elit-orange text-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all disabled:opacity-50"
              title="Alterar foto de perfil"
            >
              <Camera size={14} className="sm:w-4 sm:h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">{artist.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{artist.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-elit-orange to-elit-gold text-white rounded-lg text-xs font-semibold">
                <Shield size={12} />
                <span>🎨 Artista</span>
              </div>
              {artist.created_at && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span className="hidden sm:inline">Membro desde {new Date(artist.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="sm:hidden">{new Date(artist.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information (Read Only) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User size={18} className="text-elit-orange sm:w-5 sm:h-5" />
            Informações do Perfil
          </h3>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Name - Editable */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              {showNameForm ? (
                <form onSubmit={handleNameChange} className="space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input w-full"
                    placeholder="Digite seu nome"
                    required
                    maxLength={100}
                    disabled={editingName}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNameForm(false);
                        setNewName('');
                      }}
                      className="btn btn-secondary text-sm"
                      disabled={editingName}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-sm"
                      disabled={editingName}
                    >
                      {editingName ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={14} />
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {artist.name || '-'}
                  </div>
                  <button
                    onClick={() => {
                      setNewName(artist.name || '');
                      setShowNameForm(true);
                    }}
                    className="btn btn-secondary text-sm whitespace-nowrap"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                {artist.email || '-'}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                {artist.phone || '-'}
              </div>
            </div>

            {/* Artistic Name - Read Only */}
            {artist.artisticName && artist.artisticName.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Artístico
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                  <Palette size={16} className="text-gray-500" />
                  {artist.artisticName}
                </div>
              </div>
            )}

            {/* Area - Read Only */}
            {artist.area && artist.area.trim() !== '' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área de Atuação
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {artist.area}
                </div>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conta
              </label>
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-elit-orange to-elit-gold text-white">
                  🎨 Artista
                </span>
              </div>
            </div>

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membro desde
              </label>
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {new Date(artist.created_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            {/* Description - Read Only - Full Width */}
            {artist.description && artist.description.trim() !== '' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {artist.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock size={18} className="text-elit-orange sm:w-5 sm:h-5" />
              Segurança
            </h3>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
              >
                <Lock size={14} className="mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
                Alterar Senha
              </button>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {showPasswordForm ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input"
                  required
                  disabled={changingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input"
                  required
                  minLength={6}
                  disabled={changingPassword}
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input"
                  required
                  minLength={6}
                  disabled={changingPassword}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="btn btn-secondary w-full sm:w-auto"
                  disabled={changingPassword}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto"
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-600">
              Clique em "Alterar Senha" para modificar sua senha de acesso.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
