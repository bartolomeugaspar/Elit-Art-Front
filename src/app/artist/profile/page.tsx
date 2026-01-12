'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Image from 'next/image';

export default function ArtistProfile() {
  const { user } = useAuth();
  
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    artisticName: '',
    area: '',
    description: '',
    email: '',
    phone: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/artists/${user.id}`);
        const artistData = response.data;
        
        setArtist(artistData);
        setFormData({
          name: artistData.name || '',
          artisticName: artistData.artisticName || '',
          area: artistData.area || '',
          description: artistData.description || '',
          email: artistData.email || '',
          phone: artistData.phone || '',
        });
        setImagePreview(artistData.image);
      } catch (error) {
        console.error('Erro ao carregar artista:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artist || !user) return;

    setSaving(true);
    try {
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.put(`/artists/${user.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        artisticName: artist.artisticName || '',
        area: artist.area || '',
        description: artist.description || '',
        email: artist.email || '',
        phone: artist.phone || '',
      });
      setImagePreview(artist.image);
      setImageFile(null);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            ✏️ Editar Perfil
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Profile Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Perfil
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                <p className="text-xs text-gray-500 mt-2">PNG, JPG até 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
              required
            />
          </div>

          {/* Artistic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Artístico
            </label>
            <input
              type="text"
              value={formData.artisticName}
              onChange={(e) => setFormData({ ...formData, artisticName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Area */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área Artística
            </label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              disabled={!isEditing}
              placeholder="Ex: Pintura, Escultura, Fotografia..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição / Biografia
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={!isEditing}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
            >
              {saving ? 'Guardando...' : 'Guardar Alterações'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
