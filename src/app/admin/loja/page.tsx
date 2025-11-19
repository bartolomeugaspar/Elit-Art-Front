'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, Edit2, Plus, CheckCircle, X } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  category: 'book' | 'magazine' | 'ticket' | 'merchandise'
  price: number
  discount_price?: number
  stock: number
  image_url: string
}

export default function LojaAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'book' as 'book' | 'magazine' | 'ticket' | 'merchandise',
    price: 0,
    stock: 0,
    sku: '',
    image_url: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas')
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem não pode ser maior que 5MB')
      return
    }

    setIsUploadingImage(true)
    const uploadToast = toast.loading('Enviando imagem...')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl,
        }))
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
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar imagem',
        {
          id: uploadToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image_url) {
      toast.error('Por favor, envie uma imagem do produto')
      return
    }

    const loadingToast = toast.loading('Criando produto...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Produto criado com sucesso!', {
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
          name: '',
          description: '',
          category: 'book',
          price: 0,
          stock: 0,
          sku: '',
          image_url: '',
        })
        setImagePreview(null)
        setShowForm(false)
        fetchProducts()
      } else {
        throw new Error(data.message || 'Erro ao criar produto')
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar produto',
        {
          id: loadingToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      )
    }
  }

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setShowDeleteModal(true)
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/products/${productToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Produto excluído com sucesso!', {
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        })
        fetchProducts()
      } else {
        throw new Error('Falha ao excluir produto')
      }
    } catch (error) {
      toast.error('Erro ao excluir produto', {
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
      setProductToDelete(null)
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
            placeholder="Buscar produtos..."
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
          Novo Produto
        </button>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estoque
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
                      Carregando produtos...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    {searchTerm ? 'Nenhum produto encontrado para a busca' : 'Nenhum produto cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-medium text-slate-900">{product.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-600">R$ {product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-600">{product.stock}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          title="Editar produto"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir produto"
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

      {/* Products Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando produtos...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? 'Nenhum produto encontrado para a busca' : 'Nenhum produto cadastrado'}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{product.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Categoria:</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Preço:</span>
                  <span className="text-xs text-slate-900 font-medium">R$ {product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Estoque:</span>
                  <span className="text-xs text-slate-900 font-medium">{product.stock}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Editar produto"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir produto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação de Produto */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Criar Novo Produto</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    name: '',
                    description: '',
                    category: 'book',
                    price: 0,
                    stock: 0,
                    sku: '',
                    image_url: '',
                  })
                  setImagePreview(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Seção de Imagem */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shrink-0">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Imagem do Produto *</label>
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
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <img src={imagePreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                        <span className="text-sm text-green-700 font-medium">Imagem enviada</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Nome *</label>
                    <input
                      type="text"
                      placeholder="Ex: Livro de Arte"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Categoria *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    >
                      <option value="book">📚 Livro</option>
                      <option value="magazine">📰 Revista</option>
                      <option value="ticket">🎫 Ingresso</option>
                      <option value="merchandise">🎁 Merchandising</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Descrição *</label>
                  <textarea
                    placeholder="Descreva o produto em detalhes..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    required
                  />
                </div>
              </div>

              {/* Seção de Preço e Estoque */}
              <div className="space-y-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900">Preço e Estoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Estoque *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">SKU *</label>
                    <input
                      type="text"
                      placeholder="Ex: PROD-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      name: '',
                      description: '',
                      category: 'book',
                      price: 0,
                      stock: 0,
                      sku: '',
                      image_url: '',
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
                  Criar Produto
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
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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
                onClick={handleDeleteProduct}
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
