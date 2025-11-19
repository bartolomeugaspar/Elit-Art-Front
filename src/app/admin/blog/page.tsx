'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, Edit2, Plus, CheckCircle, X, Eye } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: 'magazine' | 'story' | 'article' | 'poetry' | 'drama'
  author_name: string
  status: 'draft' | 'published' | 'archived'
  views: number
  created_at: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingPost, setViewingPost] = useState<any>(null)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'article' as 'magazine' | 'story' | 'article' | 'poetry' | 'drama' | 'other',
    author_id: '',
    author_name: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/blog`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      toast.error('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setShowDeleteModal(true)
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/blog/${postToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Artigo excluído com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        fetchPosts()
      } else {
        throw new Error('Falha ao excluir artigo')
      }
    } catch (error) {
      toast.error('Erro ao excluir artigo', {
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
      setPostToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        setFormData(prev => ({ ...prev, featured_image: data.imageUrl }))
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
      console.error('Failed to upload image:', error)
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

  const handleViewClick = async (post: BlogPost) => {
    try {
      const response = await fetch(`${API_URL}/blog/${post.id}`)
      if (response.ok) {
        const data = await response.json()
        setViewingPost(data.post)
        setShowViewModal(true)
      } else {
        toast.error('Erro ao carregar artigo')
      }
    } catch (error) {
      console.error('Erro ao buscar artigo:', error)
      toast.error('Erro ao carregar artigo')
    }
  }

  const handleEditClick = async (post: BlogPost) => {
    try {
      const response = await fetch(`${API_URL}/blog/${post.id}`)
      if (response.ok) {
        const data = await response.json()
        const fullPost = data.post
        
        setEditingPost(post.id)
        setFormData({
          title: fullPost.title,
          slug: fullPost.slug,
          content: fullPost.content || '',
          excerpt: fullPost.excerpt || '',
          featured_image: fullPost.featured_image || '',
          category: fullPost.category,
          author_id: fullPost.author_id || '',
          author_name: fullPost.author_name,
        })
        setImagePreview(fullPost.featured_image || null)
        setShowForm(true)
      } else {
        toast.error('Erro ao carregar artigo para edição')
      }
    } catch (error) {
      console.error('Erro ao buscar artigo:', error)
      toast.error('Erro ao carregar artigo para edição')
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.featured_image && !editingPost) {
      toast.error('Por favor, envie uma imagem do artigo')
      return
    }

    const loadingToast = toast.loading(editingPost ? 'Atualizando artigo...' : 'Criando artigo...')

    try {
      const token = localStorage.getItem('token')
      // Gerar UUID para author_id se não estiver preenchido
      const postData = {
        ...formData,
        author_id: formData.author_id || crypto.randomUUID(),
      }
      
      const url = editingPost 
        ? `${API_URL}/blog/${editingPost}`
        : `${API_URL}/blog`
      
      const response = await fetch(url, {
        method: editingPost ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(editingPost ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!', {
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
          slug: '',
          content: '',
          excerpt: '',
          featured_image: '',
          category: 'article',
          author_id: '',
          author_name: '',
        })
        setImagePreview(null)
        setShowForm(false)
        setEditingPost(null)
        fetchPosts()
      } else {
        const errorMsg = data.message || data.errors?.[0]?.msg || 'Erro ao salvar artigo'
        throw new Error(errorMsg)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar artigo'
      console.error('Erro ao salvar artigo:', errorMessage, error)
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
            placeholder="Buscar artigos..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
          >
            <option value="all">Todos</option>
            <option value="published">Publicado</option>
            <option value="draft">Rascunho</option>
            <option value="archived">Arquivado</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Novo Artigo
          </button>
        </div>
      </div>

      {/* Posts Table - Desktop */}
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
                  Status
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
                      Carregando artigos...
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    {searchTerm ? 'Nenhum artigo encontrado para a busca' : 'Nenhum artigo cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-medium text-slate-900">{post.title}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-600">{post.views}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        <button
                          onClick={() => handleViewClick(post)}
                          className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                          title="Visualizar artigo"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditClick(post)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          title="Editar artigo"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir artigo"
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

      {/* Posts Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando artigos...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? 'Nenhum artigo encontrado para a busca' : 'Nenhum artigo cadastrado'}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{post.title}</h3>
                  <p className="text-xs text-slate-500 truncate">{post.category}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Visualizações:</span>
                  <span className="text-xs text-slate-900 font-medium">{post.views}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleViewClick(post)}
                  className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                  title="Visualizar artigo"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEditClick(post)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Editar artigo"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(post.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir artigo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação de Artigo */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingPost ? 'Editar Artigo' : 'Criar Novo Artigo'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingPost(null)
                  setFormData({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    featured_image: '',
                    category: 'article',
                    author_id: '',
                    author_name: '',
                  })
                  setImagePreview(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Seção de Imagem */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shrink-0">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Imagem Destaque *</label>
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
                            setFormData({ ...formData, featured_image: '' })
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 transition"
                          title="Remover imagem"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {!formData.featured_image && (
                    <p className="text-xs text-slate-500">Formatos: JPEG, PNG, WebP, GIF (máx 5MB)</p>
                  )}
                </div>
              </div>

              {/* Seção de Informações Básicas */}
              <div className="space-y-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Título *</label>
                    <input
                      type="text"
                      placeholder="Ex: Meu Artigo"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Slug *</label>
                    <input
                      type="text"
                      placeholder="meu-artigo"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
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
                      <option value="article">Artigo</option>
                      <option value="story">Conto</option>
                      <option value="poetry">Poesia</option>
                      <option value="drama">Drama</option>
                      <option value="magazine">Revista</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Nome do Autor *</label>
                    <input
                      type="text"
                      placeholder="Nome do autor"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Resumo (Excerpt) *</label>
                  <textarea
                    placeholder="Resumo do artigo..."
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Conteúdo *</label>
                  <textarea
                    placeholder="Escreva o conteúdo do artigo..."
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                    setEditingPost(null)
                    setFormData({
                      title: '',
                      slug: '',
                      content: '',
                      excerpt: '',
                      featured_image: '',
                      category: 'article',
                      author_id: '',
                      author_name: '',
                    })
                    setImagePreview(null)
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
                  {editingPost ? 'Atualizar Artigo' : 'Criar Artigo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && viewingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{viewingPost.title}</h2>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setViewingPost(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4">
              {/* Imagem destaque */}
              {viewingPost.featured_image && (
                <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={viewingPost.featured_image}
                    alt={viewingPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Informações do artigo */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Categoria</p>
                  <p className="font-medium text-slate-900">{viewingPost.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Autor</p>
                  <p className="font-medium text-slate-900">{viewingPost.author_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                    viewingPost.status === 'published' ? 'bg-green-100 text-green-800' :
                    viewingPost.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingPost.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Visualizações</p>
                  <p className="font-medium text-slate-900">{viewingPost.views || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Slug</p>
                  <p className="font-medium text-slate-900 text-sm">{viewingPost.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Data de Criação</p>
                  <p className="font-medium text-slate-900 text-sm">
                    {new Date(viewingPost.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Resumo */}
              {viewingPost.excerpt && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Resumo</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{viewingPost.excerpt}</p>
                </div>
              )}

              {/* Conteúdo */}
              {viewingPost.content && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Conteúdo</h3>
                  <div className="text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                    {viewingPost.content}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setViewingPost(null)
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
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
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
                onClick={handleDeletePost}
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
