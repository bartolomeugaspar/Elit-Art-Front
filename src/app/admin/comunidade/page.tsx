'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, Edit2, Plus, CheckCircle, X, Lock, Unlock } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

interface ForumTopic {
  id: string
  title: string
  category: 'general' | 'art' | 'events' | 'collaboration' | 'feedback'
  author_name: string
  replies_count: number
  views: number
  is_pinned: boolean
  is_closed: boolean
  created_at: string
}

export default function ComunidadeAdminPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general' as 'general' | 'art' | 'events' | 'collaboration' | 'feedback',
    author_name: '',
  })
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'general', label: 'Geral' },
    { value: 'art', label: 'Arte' },
    { value: 'events', label: 'Eventos' },
    { value: 'collaboration', label: 'Colaboração' },
    { value: 'feedback', label: 'Feedback' },
  ]

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const fetchTopics = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/forum/topics`)
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      console.error('Erro ao carregar tópicos:', error)
      toast.error('Erro ao carregar tópicos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  const handleDeleteClick = (topicId: string) => {
    setTopicToDelete(topicId)
    setShowDeleteModal(true)
  }

  const handleDeleteTopic = async () => {
    if (!topicToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/forum/topics/${topicToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Tópico excluído com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        fetchTopics()
      } else {
        throw new Error('Falha ao excluir tópico')
      }
    } catch (error) {
      toast.error('Erro ao excluir tópico', {
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
      setTopicToDelete(null)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingToast = toast.loading('Criando tópico...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/forum/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Tópico criado com sucesso!', {
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
          category: 'general',
          author_name: '',
        })
        setShowForm(false)
        fetchTopics()
      } else {
        throw new Error(data.message || 'Erro ao criar tópico')
      }
    } catch (error) {
      console.error('Erro ao criar tópico:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar tópico', {
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
            placeholder="Buscar tópicos..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Novo Tópico
          </button>
        </div>
      </div>

      {/* Topics Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Respostas
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Visualizações
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando tópicos...
                    </div>
                  </td>
                </tr>
              ) : filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    {searchTerm ? 'Nenhum tópico encontrado para a busca' : 'Nenhum tópico cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-medium text-slate-900">{topic.title}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {topic.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-600">{topic.replies_count}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-600">{topic.views}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        {topic.is_closed && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Fechado
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteClick(topic.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir tópico"
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

      {/* Topics Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando tópicos...</span>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? 'Nenhum tópico encontrado para a busca' : 'Nenhum tópico cadastrado'}
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{topic.title}</h3>
                  <p className="text-xs text-slate-500 truncate">{topic.category}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Respostas:</span>
                  <span className="text-xs text-slate-900 font-medium">{topic.replies_count}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Visualizações:</span>
                  <span className="text-xs text-slate-900 font-medium">{topic.views}</span>
                </div>
                {topic.is_closed && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Fechado</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleDeleteClick(topic.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir tópico"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação de Tópico */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Criar Novo Tópico</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    title: '',
                    description: '',
                    category: 'general',
                    author_name: '',
                  })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Seção de Informações Básicas */}
              <div className="space-y-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900">Informações Básicas</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Título *</label>
                  <input
                    type="text"
                    placeholder="Ex: Discussão sobre arte moderna"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Categoria *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    >
                      <option value="general">🌐 Geral</option>
                      <option value="art">🎨 Arte</option>
                      <option value="events">🎪 Eventos</option>
                      <option value="collaboration">🤝 Colaboração</option>
                      <option value="feedback">💬 Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Autor *</label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Descrição *</label>
                  <textarea
                    placeholder="Descreva o tópico em detalhes..."
                    rows={5}
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
                    setFormData({
                      title: '',
                      description: '',
                      category: 'general',
                      author_name: '',
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
                  Criar Tópico
                </button>
              </div>
            </form>
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
              Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.
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
                onClick={handleDeleteTopic}
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
