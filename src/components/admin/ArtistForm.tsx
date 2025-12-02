'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

interface ArtistFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: {
    id: string
    name: string
    artistic_name?: string
    area: string
    description: string
    email: string
    phone: string
    role?: string
    image?: string
  }
  isEditing: boolean
}

export default function ArtistForm({ onSuccess, onCancel, initialData, isEditing }: ArtistFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    artistic_name: initialData?.artistic_name || '',
    area: initialData?.area || '',
    description: initialData?.description || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || '',
    image: initialData?.image || '',
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Atualizar preview quando os dados iniciais mudam
  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image)
    }
  }, [initialData?.image])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem não pode ser maior que 5MB')
      return
    }

    setIsUploadingImage(true)
    const uploadToast = toast.loading('Enviando imagem...')

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token não encontrado')

      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        setFormData({ ...formData, image: data.imageUrl })
        setImagePreview(data.imageUrl)
        toast.success('Imagem enviada com sucesso!', {
          id: uploadToast,
          duration: 2000,
        })
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload', {
        id: uploadToast,
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = isEditing ? `${API_URL}/artists/${initialData?.id}` : `${API_URL}/artists`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        toast.success(
          isEditing ? 'Artista atualizado com sucesso!' : 'Artista criado com sucesso!',
          { duration: 3000 }
        )
      } else {
        throw new Error('Erro ao salvar artista')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar artista')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Editar Artista' : 'Novo Artista'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome Artístico
              </label>
              <input
                type="text"
                value={formData.artistic_name}
                onChange={(e) => setFormData({ ...formData, artistic_name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Área *
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cargo (opcional)
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Imagem do Artista
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <Upload size={18} className="text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {isUploadingImage ? 'Enviando...' : 'Selecionar imagem'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({ ...formData, image: '' })
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                    title="Remover imagem"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
              rows={5}
              required
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 text-white px-6 py-2.5 rounded-lg transition font-medium"
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-2.5 rounded-lg transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
