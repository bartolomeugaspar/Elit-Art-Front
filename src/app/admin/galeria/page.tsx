'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, Edit2, Plus, CheckCircle, X, Search, Eye } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'
import { useArtists } from '@/hooks/useArtists'

interface Artwork {
  id: string
  title: string
  artist_name: string
  type: 'painting' | 'sculpture' | 'photography' | 'digital' | 'other'
  image_url: string
  created_at: string
}

export default function GaleriaAdminPage() {
  const { artists, loading: artistsLoading } = useArtists()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingArtwork, setViewingArtwork] = useState<any>(null)
  const [artworkToDelete, setArtworkToDelete] = useState<string | null>(null)
  const [editingArtwork, setEditingArtwork] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artist_id: '',
    artist_name: '',
    type: 'painting' as 'painting' | 'sculpture' | 'photography' | 'digital' | 'mixed_media' | 'other',
    year: new Date().getFullYear(),
    image_url: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [artistSearchTerm, setArtistSearchTerm] = useState('')
  const [showArtistDropdown, setShowArtistDropdown] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase()) ||
    artist.artisticName?.toLowerCase().includes(artistSearchTerm.toLowerCase())
  )

  const types = [
    { value: 'all', label: 'Todos' },
    { value: 'painting', label: 'Pintura' },
    { value: 'sculpture', label: 'Escultura' },
    { value: 'photography', label: 'Fotografia' },
    { value: 'digital', label: 'Digital' },
    { value: 'other', label: 'Outro' },
  ]

  const filteredArtworks = artworks.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || a.type === filterType
    return matchesSearch && matchesType
  })

  const fetchArtworks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/artworks`)
      if (response.ok) {
        const data = await response.json()
        setArtworks(data.artworks || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar obras')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArtworks()
  }, [fetchArtworks])

  const handleDeleteClick = (artworkId: string) => {
    setArtworkToDelete(artworkId)
    setShowDeleteModal(true)
  }

  const handleDeleteArtwork = async () => {
    if (!artworkToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/artworks/${artworkToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Obra excluída com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        fetchArtworks()
      } else {
        throw new Error('Falha ao excluir obra')
      }
    } catch (error) {
      toast.error('Erro ao excluir obra', {
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      })
    } finally {
      setShowDeleteModal(false)
      setArtworkToDelete(null)
    }
  }

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
        setFormData(prev => ({ ...prev, image_url: data.imageUrl }))
        setImagePreview(data.imageUrl)
        toast.success('Imagem enviada com sucesso!', {
          id: uploadToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 2000,
        })
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem', {
        id: uploadToast,
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleViewClick = async (artwork: Artwork) => {
    try {
      const response = await fetch(`${API_URL}/artworks/${artwork.id}`)
      if (response.ok) {
        const data = await response.json()
        setViewingArtwork(data.artwork)
        setShowViewModal(true)
      } else {
        toast.error('Erro ao carregar obra')
      }
    } catch (error) {
      toast.error('Erro ao carregar obra')
    }
  }

  const handleEditClick = async (artwork: Artwork) => {
    try {
      const response = await fetch(`${API_URL}/artworks/${artwork.id}`)
      if (response.ok) {
        const data = await response.json()
        const fullArtwork = data.artwork
        
        setEditingArtwork(artwork.id)
        setFormData({
          title: fullArtwork.title,
          description: fullArtwork.description || '',
          artist_id: fullArtwork.artist_id || '',
          artist_name: fullArtwork.artist_name,
          type: fullArtwork.type,
          year: fullArtwork.year || new Date(fullArtwork.created_at).getFullYear(),
          image_url: fullArtwork.image_url,
        })
        setImagePreview(fullArtwork.image_url)
        setArtistSearchTerm(fullArtwork.artist_name)
        setShowForm(true)
      } else {
        toast.error('Erro ao carregar obra para edição')
      }
    } catch (error) {
      toast.error('Erro ao carregar obra para edição')
    }
  }

  const handleCreateArtwork = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_url) {
      toast.error('Por favor, envie uma imagem da obra')
      return
    }

    const loadingToast = toast.loading(editingArtwork ? 'Atualizando obra...' : 'Criando obra...')

    try {
      const token = localStorage.getItem('token')
      // Gerar UUID para artist_id se não estiver preenchido
      const artworkData = {
        ...formData,
        artist_id: formData.artist_id || crypto.randomUUID(),
      }
      
      const url = editingArtwork 
        ? `${API_URL}/artworks/${editingArtwork}`
        : `${API_URL}/artworks`
      
      const response = await fetch(url, {
        method: editingArtwork ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(artworkData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(editingArtwork ? 'Obra atualizada com sucesso!' : 'Obra criada com sucesso!', {
          id: loadingToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        setFormData({
          title: '',
          description: '',
          artist_id: '',
          artist_name: '',
          type: 'painting',
          year: new Date().getFullYear(),
          image_url: '',
        })
        setImagePreview(null)
        setShowForm(false)
        setEditingArtwork(null)
        setArtistSearchTerm('')
        fetchArtworks()
      } else {
        const errorMsg = data.message || data.errors?.[0]?.msg || 'Erro ao salvar obra'
        throw new Error(errorMsg)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar obra'
      toast.error(errorMessage, {
        id: loadingToast,
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por título ou artista..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
          >
            {types.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Nova Obra
          </button>
        </div>
      </div>

      {/* Artworks Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando obras...</p>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">{searchTerm ? 'Nenhuma obra encontrada para a busca' : 'Nenhuma obra cadastrada'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-2">{artwork.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Por {artwork.artist_name}</p>
                <p className="text-xs text-gray-500 mb-4">
                  {types.find(t => t.value === artwork.type)?.label}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewClick(artwork)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition"
                    title="Visualizar obra"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleEditClick(artwork)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Editar obra"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(artwork.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition"
                    title="Deletar obra"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Obra */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingArtwork ? 'Editar Obra' : 'Criar Nova Obra'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingArtwork(null)
                  setFormData({
                    title: '',
                    description: '',
                    artist_id: '',
                    artist_name: '',
                    type: 'painting',
                    year: new Date().getFullYear(),
                    image_url: '',
                  })
                  setImagePreview(null)
                  setArtistSearchTerm('')
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateArtwork} className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Seção de Imagem */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shrink-0">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Imagem da Obra *</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                    >
                      <Plus size={18} />
                      {isUploadingImage ? 'Enviando...' : 'Selecionar Imagem'}
                    </button>
                    {imagePreview && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg relative">
                        <img src={imagePreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                        <span className="text-sm text-green-700 font-medium">Imagem enviada</span>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setFormData({ ...formData, image_url: '' })
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 transition"
                          title="Remover imagem"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {!formData.image_url && (
                    <p className="text-xs text-slate-500">Formatos: JPEG, PNG, WebP, GIF (máx 5MB)</p>
                  )}
                </div>
              </div>

              {/* Seção de Informações Básicas */}
              <div className="space-y-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900">Informações Básicas</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Título *</label>
                  <input
                    type="text"
                    placeholder="Ex: Paisagem Noturna"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                    <label className="block text-sm font-medium text-slate-700">Artista *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar artista..."
                        value={artistSearchTerm}
                        onChange={(e) => {
                          setArtistSearchTerm(e.target.value)
                          setShowArtistDropdown(true)
                        }}
                        onFocus={() => setShowArtistDropdown(true)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required={!formData.artist_id}
                      />
                      {showArtistDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {artistsLoading ? (
                            <div className="px-4 py-3 text-sm text-slate-500">Carregando artistas...</div>
                          ) : filteredArtists.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-slate-500">Nenhum artista encontrado</div>
                          ) : (
                            filteredArtists.map((artist) => (
                              <button
                                key={artist.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    artist_id: artist.id,
                                    artist_name: artist.name,
                                  })
                                  setArtistSearchTerm(artist.name)
                                  setShowArtistDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition border-b border-slate-100 last:border-b-0"
                              >
                                <div className="font-medium text-slate-900">{artist.name}</div>
                                {artist.artisticName && (
                                  <div className="text-xs text-slate-500">{artist.artisticName}</div>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {formData.artist_id && (
                      <div className="text-xs text-green-600 mt-1">✓ Artista selecionado</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Tipo *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    >
                      <option value="painting">🎨 Pintura</option>
                      <option value="sculpture">🗿 Escultura</option>
                      <option value="photography">📷 Fotografia</option>
                      <option value="digital">💻 Digital</option>
                      <option value="mixed_media">🎭 Mídia Mista</option>
                      <option value="other">📋 Outro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Ano *</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Descrição *</label>
                  <textarea
                    placeholder="Descreva a obra em detalhes..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingArtwork(null)
                    setFormData({
                      title: '',
                      description: '',
                      artist_id: '',
                      artist_name: '',
                      type: 'painting',
                      year: new Date().getFullYear(),
                      image_url: '',
                    })
                    setImagePreview(null)
                    setArtistSearchTerm('')
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle size={16} />
                  {editingArtwork ? 'Atualizar Obra' : 'Criar Obra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && viewingArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{viewingArtwork.title}</h2>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setViewingArtwork(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4">
              {/* Imagem da obra */}
              {viewingArtwork.image_url && (
                <div className="w-full h-96 bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={viewingArtwork.image_url}
                    alt={viewingArtwork.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Informações da obra */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Artista</p>
                  <p className="font-medium text-slate-900">{viewingArtwork.artist_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-medium text-slate-900 capitalize">{viewingArtwork.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Ano</p>
                  <p className="font-medium text-slate-900">
                    {viewingArtwork.year || new Date(viewingArtwork.created_at).getFullYear()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Data de Criação</p>
                  <p className="font-medium text-slate-900 text-sm">
                    {new Date(viewingArtwork.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Descrição */}
              {viewingArtwork.description && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Descrição</h3>
                  <div className="text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                    {viewingArtwork.description}
                  </div>
                </div>
              )}

              {/* Dimensões */}
              {(viewingArtwork.width || viewingArtwork.height) && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Dimensões</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {viewingArtwork.width} x {viewingArtwork.height} cm
                  </p>
                </div>
              )}

              {/* Técnica */}
              {viewingArtwork.technique && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Técnica</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {viewingArtwork.technique}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setViewingArtwork(null)
                }}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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
              Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.
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
                onClick={handleDeleteArtwork}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
