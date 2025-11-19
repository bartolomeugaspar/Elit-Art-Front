'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, Edit2, Plus, CheckCircle, X } from 'lucide-react'
import { buildApiUrl } from '@/lib/api'
import toast from 'react-hot-toast'

interface PressRelease {
  id: string
  title: string
  summary: string
  publication_date: string
  author: string
  views: number
}

interface MediaKit {
  id: string
  title: string
  file_type: string
  downloads: number
}

export default function ImprensaAdminPage() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'releases' | 'kits'>('releases')
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [releaseFormData, setReleaseFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: '',
    publication_date: new Date().toISOString().split('T')[0],
  })
  const [mediaKitFormData, setMediaKitFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_type: 'pdf' as 'pdf' | 'zip' | 'doc',
    file_size: 0,
  })
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const fetchData = useCallback(async () => {
    try {
      const [releasesRes, kitsRes] = await Promise.all([
        fetch(buildApiUrl('press/releases')),
        fetch(buildApiUrl('press/media-kit')),
      ])

      if (releasesRes.ok) {
        const data = await releasesRes.json()
        setReleases(data.releases || [])
      }

      if (kitsRes.ok) {
        const data = await kitsRes.json()
        setMediaKits(data.kits || [])
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteModal(true)
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const token = localStorage.getItem('token')
      const endpoint = activeTab === 'releases' 
        ? buildApiUrl(`press/releases/${itemToDelete}`)
        : buildApiUrl(`press/media-kit/${itemToDelete}`)

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Item excluído com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        fetchData()
      } else {
        throw new Error('Falha ao excluir item')
      }
    } catch (error) {
      toast.error('Erro ao excluir item', {
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      })
      console.error('Erro ao deletar:', error)
    } finally {
      setShowDeleteModal(false)
      setItemToDelete(null)
    }
  }

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingToast = toast.loading('Criando press release...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl('press/releases'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(releaseFormData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Press release criado com sucesso!', {
          id: loadingToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        setReleaseFormData({
          title: '',
          content: '',
          summary: '',
          author: '',
          publication_date: new Date().toISOString().split('T')[0],
        })
        setShowForm(false)
        fetchData()
      } else {
        throw new Error(data.message || 'Erro ao criar press release')
      }
    } catch (error) {
      console.error('Erro ao criar press release:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar press release', {
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

  const handleCreateMediaKit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingToast = toast.loading('Criando media kit...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl('press/media-kit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mediaKitFormData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Media kit criado com sucesso!', {
          id: loadingToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        setMediaKitFormData({
          title: '',
          description: '',
          file_url: '',
          file_type: 'pdf',
          file_size: 0,
        })
        setShowForm(false)
        fetchData()
      } else {
        throw new Error(data.message || 'Erro ao criar media kit')
      }
    } catch (error) {
      console.error('Erro ao criar media kit:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar media kit', {
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

  const filteredReleases = releases.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredKits = mediaKits.filter(k =>
    k.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            placeholder="Buscar..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Novo Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('releases')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'releases'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Press Releases
        </button>
        <button
          onClick={() => setActiveTab('kits')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'kits'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Kit de Imprensa
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      ) : activeTab === 'releases' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Autor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Visualizações</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReleases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      {searchTerm ? 'Nenhum press release encontrado' : 'Nenhum press release cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredReleases.map((release) => (
                    <tr key={release.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-slate-900">{release.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">{release.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">{new Date(release.publication_date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">{release.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                        <div className="flex justify-end space-x-1 lg:space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(release.id)}
                            className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
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
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Downloads</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredKits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      {searchTerm ? 'Nenhum kit encontrado' : 'Nenhum kit cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredKits.map((kit) => (
                    <tr key={kit.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-slate-900">{kit.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">{kit.file_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">{kit.downloads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                        <div className="flex justify-end space-x-1 lg:space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(kit.id)}
                            className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
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
      )}

      {/* Modal de Criação */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {activeTab === 'releases' ? 'Criar Press Release' : 'Criar Media Kit'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  if (activeTab === 'releases') {
                    setReleaseFormData({
                      title: '',
                      content: '',
                      summary: '',
                      author: '',
                      publication_date: new Date().toISOString().split('T')[0],
                    })
                  } else {
                    setMediaKitFormData({
                      title: '',
                      description: '',
                      file_url: '',
                      file_type: 'pdf',
                      file_size: 0,
                    })
                  }
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {activeTab === 'releases' ? (
              <form onSubmit={handleCreateRelease} className="space-y-6 overflow-y-auto flex-1 pr-2">
                <div className="space-y-4 shrink-0">
                  <h3 className="text-sm font-semibold text-slate-900">Informações do Press Release</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Título *</label>
                    <input
                      type="text"
                      placeholder="Ex: Novo Projeto Artístico"
                      value={releaseFormData.title}
                      onChange={(e) => setReleaseFormData({ ...releaseFormData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Autor *</label>
                      <input
                        type="text"
                        placeholder="Nome do autor"
                        value={releaseFormData.author}
                        onChange={(e) => setReleaseFormData({ ...releaseFormData, author: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Data de Publicação *</label>
                      <input
                        type="date"
                        value={releaseFormData.publication_date}
                        onChange={(e) => setReleaseFormData({ ...releaseFormData, publication_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Resumo *</label>
                    <textarea
                      placeholder="Resumo do press release..."
                      rows={2}
                      value={releaseFormData.summary}
                      onChange={(e) => setReleaseFormData({ ...releaseFormData, summary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Conteúdo *</label>
                    <textarea
                      placeholder="Conteúdo completo do press release..."
                      rows={5}
                      value={releaseFormData.content}
                      onChange={(e) => setReleaseFormData({ ...releaseFormData, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setReleaseFormData({
                        title: '',
                        content: '',
                        summary: '',
                        author: '',
                        publication_date: new Date().toISOString().split('T')[0],
                      })
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
                    Criar Release
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateMediaKit} className="space-y-6 overflow-y-auto flex-1 pr-2">
                <div className="space-y-4 shrink-0">
                  <h3 className="text-sm font-semibold text-slate-900">Informações do Media Kit</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Título *</label>
                    <input
                      type="text"
                      placeholder="Ex: Kit de Imprensa 2025"
                      value={mediaKitFormData.title}
                      onChange={(e) => setMediaKitFormData({ ...mediaKitFormData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Descrição *</label>
                    <textarea
                      placeholder="Descreva o conteúdo do media kit..."
                      rows={3}
                      value={mediaKitFormData.description}
                      onChange={(e) => setMediaKitFormData({ ...mediaKitFormData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Tipo de Arquivo *</label>
                      <select
                        value={mediaKitFormData.file_type}
                        onChange={(e) => setMediaKitFormData({ ...mediaKitFormData, file_type: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      >
                        <option value="pdf">📄 PDF</option>
                        <option value="zip">📦 ZIP</option>
                        <option value="doc">📝 DOC</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Tamanho (bytes) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={mediaKitFormData.file_size}
                        onChange={(e) => setMediaKitFormData({ ...mediaKitFormData, file_size: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">URL do Arquivo *</label>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/arquivo.pdf"
                      value={mediaKitFormData.file_url}
                      onChange={(e) => setMediaKitFormData({ ...mediaKitFormData, file_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setMediaKitFormData({
                        title: '',
                        description: '',
                        file_url: '',
                        file_type: 'pdf',
                        file_size: 0,
                      })
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
                    Criar Media Kit
                  </button>
                </div>
              </form>
            )}
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
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
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
                onClick={handleDeleteItem}
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
