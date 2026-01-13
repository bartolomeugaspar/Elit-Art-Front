'use client'

import { useState, useEffect } from 'react'
import { Header, Footer } from '@/components'
import { ShoppingCart, Search, Filter, Package, X } from 'lucide-react'
import { useProducts, Product } from '@/hooks/useProducts'
import toast from 'react-hot-toast'

export default function LojaDigitalPage() {
  const { products, loading, fetchProducts } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)

  const categories = [
    { id: 'all', name: 'Todos', icon: '🛍️' },
    { id: 'merchandise', name: 'Chapéus', icon: '🧢' },
    { id: 'book', name: 'Camisas', icon: '👕' },
    { id: 'magazine', name: 'Pastas', icon: '📁' },
    { id: 'ticket', name: 'Outros', icon: '🎁' }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && product.is_active && product.stock > 0
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
        toast.success('Quantidade atualizada!')
      } else {
        toast.error('Estoque insuficiente')
      }
    } else {
      setCart([...cart, { product, quantity: 1 }])
      toast.success('Adicionado ao carrinho!')
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
    toast.success('Removido do carrinho')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = cart.find(item => item.product.id === productId)
    if (item && quantity <= item.product.stock) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.discount_price || item.product.price
    return total + (price * item.quantity)
  }, 0)

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4">
              🛍️ Loja Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">
              Chapéus, Camisas, Pastas e muito mais!
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elit-orange"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-elit-red text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed lg:static bottom-4 right-4 lg:bottom-auto lg:right-auto z-40 bg-elit-red text-white p-4 rounded-full shadow-2xl hover:bg-elit-red/90 transition-all flex items-center gap-2"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="bg-elit-yellow text-elit-dark font-bold px-2 py-1 rounded-full text-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-elit-red mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou pesquisa</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discount_price && (
                      <div className="absolute top-3 right-3 bg-elit-red text-white px-3 py-1 rounded-full font-bold text-sm">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-elit-dark mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="mb-4">
                      {product.discount_price ? (
                        <div>
                          <p className="text-2xl font-bold text-elit-red">
                            {product.discount_price.toLocaleString('pt-AO')} Kz
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            {product.price.toLocaleString('pt-AO')} Kz
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-elit-dark">
                          {product.price.toLocaleString('pt-AO')} Kz
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-elit-red to-elit-orange text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-elit-dark">Carrinho</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 border-b pb-4">
                        <img
                          src={item.product.image_url || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-sm mb-1">{item.product.name}</h3>
                          <p className="text-elit-red font-bold">
                            {(item.product.discount_price || item.product.price).toLocaleString('pt-AO')} Kz
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-elit-red">
                        {cartTotal.toLocaleString('pt-AO')} Kz
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        toast.success('Funcionalidade de checkout em breve!')
                      }}
                      className="w-full bg-gradient-to-r from-elit-red to-elit-orange text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
