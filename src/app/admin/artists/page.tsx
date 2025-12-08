'use client'

import { useEffect, useState } from 'react'
import { Trash2, Edit2, Plus, Eye, X, Mail, Phone, User } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'
import ArtistForm from '@/components/admin/ArtistForm'

interface Artist {
  id: string
  name: string
  artistic_name?: string
  area: string
  description: string
  email: string
  phone: string
  image?: string
  role?: string
  show_in_public?: boolean
  created_at: string
}

export default function AdminArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchArtists = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/artists?showAll=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar artistas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [])

  const handleDeleteClick = (artist: Artist) => {
    setArtistToDelete(artist)
    setShowDeleteModal(true)
  }

  const handleViewDetails = (artist: Artist) => {
    setSelectedArtist(artist)
    setShowDetailsModal(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingArtist(null)
    fetchArtists()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingArtist(null)
  }

  const handleNewArtistClick = () => {
    setEditingArtist(null)
    setShowForm(!showForm)
  }

  const handleEditArtist = async (artist: Artist) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/artists/${artist.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setEditingArtist(data.artist)
        setShowForm(true)
      } else {
        toast.error('Erro ao carregar artista para edição')
      }
    } catch (error) {
      toast.error('Erro ao carregar artista para edição')
    }
  }

  const handleDeleteArtist = async () => {
    if (!artistToDelete) return

    const loadingToast = toast.loading('Deletando artista...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/artists/${artistToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Artista deletado com sucesso!', { id: loadingToast })
        fetchArtists()
      } else {
        throw new Error('Erro ao deletar artista')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar artista', { id: loadingToast })
    } finally {
      setShowDeleteModal(false)
      setArtistToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar artistas..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewArtistClick}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Novo Artista
        </button>
      </div>

      {/* Artist Form Modal */}
      {showForm && (
        <ArtistForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialData={editingArtist ? {
            id: editingArtist.id,
            name: editingArtist.name,
            artistic_name: editingArtist.artistic_name,
            area: editingArtist.area,
            description: editingArtist.description,
            email: editingArtist.email,
            phone: editingArtist.phone,
            role: editingArtist.role,
            image: editingArtist.image,
            show_in_public: editingArtist.show_in_public,
          } : undefined}
          isEditing={!!editingArtist}
        />
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando artistas...</p>
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum artista encontrado</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredArtists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{artist.name}</p>
                          {artist.artistic_name && (
                            <p className="text-xs text-slate-500">({artist.artistic_name})</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{artist.area}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs sm:text-sm">{artist.email}</td>
                      <td className="px-6 py-4 text-slate-600">{artist.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(artist)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditArtist(artist)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(artist)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Deletar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                <div className="mb-3">
                  {artist.image ? (
                    <div className="w-full h-40 mb-3 overflow-hidden rounded-lg border border-slate-200">
                      <img 
                        src={artist.image} 
                        alt={artist.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 mb-3 bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300">
                      <User size={50} className="text-slate-400" />
                    </div>
                  )}
                  <p className="font-bold text-slate-900">{artist.name}</p>
                  {artist.artistic_name && (
                    <p className="text-xs text-slate-500">({artist.artistic_name})</p>
                  )}
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700 min-w-16">Área:</span>
                    <span>{artist.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{artist.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{artist.phone}</span>
                  </div>
                  {artist.role && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 min-w-16">Cargo:</span>
                      <span>{artist.role}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => handleViewDetails(artist)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-purple-600 hover:bg-purple-50 rounded transition text-sm font-medium"
                  >
                    <Eye size={16} />
                    Detalhes
                  </button>
                  <button
                    onClick={() => handleEditArtist(artist)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-blue-600 hover:bg-blue-50 rounded transition text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(artist)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {selectedArtist.image ? (
                  <div className="w-24 h-24 mb-4 overflow-hidden rounded-lg border-2 border-blue-200">
                    <img 
                      src={selectedArtist.image} 
                      alt={selectedArtist.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mb-4 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-300">
                    <User size={40} className="text-slate-400" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-slate-900">{selectedArtist.name}</h2>
                {selectedArtist.artistic_name && (
                  <p className="text-slate-500 italic">({selectedArtist.artistic_name})</p>
                )}
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Área</p>
                  <p className="text-slate-900 font-medium">{selectedArtist.area}</p>
                </div>
                {selectedArtist.role && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Cargo</p>
                    <p className="text-slate-900 font-medium">{selectedArtist.role}</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-slate-500 uppercase mb-2">Descrição</p>
                <p className="text-slate-700 leading-relaxed">{selectedArtist.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-slate-500" />
                    <p className="text-xs font-medium text-slate-500 uppercase">Email</p>
                  </div>
                  <p className="text-slate-900 font-medium break-all text-sm">{selectedArtist.email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-slate-500" />
                    <p className="text-xs font-medium text-slate-500 uppercase">Telefone</p>
                  </div>
                  <p className="text-slate-900 font-medium">{selectedArtist.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  handleEditArtist(selectedArtist)
                  setShowDetailsModal(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
              >
                <Edit2 size={18} />
                Editar
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2.5 rounded-lg transition font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && artistToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Deletar Artista</h3>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja deletar <strong>{artistToDelete.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteArtist}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Deletar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
