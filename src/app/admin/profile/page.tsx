'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Calendar, Save, X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Upload, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { API_URL } from '@/lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordLength, setPasswordLength] = useState(12); // Tamanho padrão da senha
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profile_image: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        profile_image: user.profile_image || ''
      }));
      setImagePreview(user.profile_image || null);
    }
  }, [user]);

  // Buscar o tamanho real da senha do usuário
  useEffect(() => {
    const fetchPasswordLength = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/auth/password-length`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.passwordLength) {
            setPasswordLength(data.passwordLength);
          }
        }
      } catch (error) {
        // Em caso de erro, manter o tamanho padrão
        console.error('Erro ao buscar tamanho da senha:', error);
      }
    };

    if (user) {
      fetchPasswordLength();
    }
  }, [user]);

  // Calcular força da senha
  useEffect(() => {
    if (!formData.newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.newPassword.length >= 8) strength += 25;
    if (formData.newPassword.length >= 12) strength += 15;
    if (/[a-z]/.test(formData.newPassword)) strength += 15;
    if (/[A-Z]/.test(formData.newPassword)) strength += 15;
    if (/[0-9]/.test(formData.newPassword)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(formData.newPassword)) strength += 15;

    setPasswordStrength(Math.min(strength, 100));
  }, [formData.newPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Fraca';
    if (passwordStrength < 70) return 'Média';
    return 'Forte';
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem não pode ser maior que 5MB');
      return;
    }

    setIsUploadingImage(true);
    const uploadToast = toast.loading('Enviando imagem...');

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
        setFormData(prev => ({ ...prev, profile_image: data.imageUrl }));
        setImagePreview(data.imageUrl);
        toast.success('Imagem enviada com sucesso!', { id: uploadToast });
        
        // Atualizar a foto de perfil imediatamente no backend
        await updateProfileImage(data.imageUrl, token);
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem', { id: uploadToast });
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
      console.error('Erro ao atualizar foto de perfil:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validações
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error('A nova senha deve ter pelo menos 6 caracteres');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Atualizar perfil
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          ...(formData.newPassword && {
            newPassword: formData.newPassword
          })
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }

      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Recarregar a página para atualizar os dados do usuário
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profile_image: user.profile_image || ''
      });
      setImagePreview(user.profile_image || null);
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            {imagePreview || user.profile_image ? (
              <img
                src={imagePreview || user.profile_image}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50"
                title="Alterar foto de perfil"
              >
                <Camera size={14} />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{user.name}</h2>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold">
                <Shield size={12} />
                <span className="hidden xs:inline">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                <span className="xs:hidden">{user.role === 'admin' ? 'Admin' : 'User'}</span>
              </div>
              {user.created_at && (
                <div className="text-xs text-gray-500">
                  Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card de Informações Básicas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informações Pessoais</h3>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isEditing 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
                placeholder="Digite seu nome completo"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
            </div>

            {/* Password Field - Display Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={'•'.repeat(passwordLength)}
                disabled
                readOnly
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Para alterar sua senha, clique em "Editar Perfil"</p>
            </div>
          </div>
        </div>

        {/* Card de Segurança - Password Section */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alterar Senha</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Deixe em branco se não quiser alterar</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Força:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength < 40 ? 'text-red-600' : 
                        passwordStrength < 70 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                      <span className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                        ✓ 8+ caracteres
                      </span>
                      <span className={/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Maiúsculas/Minúsculas
                      </span>
                      <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Números
                      </span>
                      <span className={/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Caracteres especiais
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 ${
                      formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600">✓ As senhas coincidem</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <X size={18} />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
