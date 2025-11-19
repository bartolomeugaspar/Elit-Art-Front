'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import Image from 'next/image'
import { Header, Footer } from '@/components'

export default function LojaDigitalPage() {
  const { products, loading, error, fetchProducts, searchProducts } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<any[]>([])

  const categories = [
    { value: 'book', label: 'Livros' },
    { value: 'magazine', label: 'Revistas' },
    { value: 'ticket', label: 'Ingressos' },
    { value: 'merchandise', label: 'Merchandising' },
  ]

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category) {
      fetchProducts(category)
    } else {
      fetchProducts()
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchProducts(searchQuery)
    }
  }

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const filteredProducts = products.filter((p) => !selectedCategory || p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4">
              🛍️ Loja Digital Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">
              Livros, Revistas, Ingressos e Merchandising
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elit-red"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-elit-red" />
                <h3 className="text-lg font-bold text-elit-dark">Filtros</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    !selectedCategory
                      ? 'bg-elit-red text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                  }`}
                >
                  Todos os Produtos
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === cat.value
                        ? 'bg-elit-red text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Carrinho */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart size={20} className="text-elit-red" />
                  <h4 className="font-bold text-elit-dark">Carrinho ({cart.length})</h4>
                </div>
                {cart.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-elit-dark">
                        <span>{item.name}</span>
                        <span className="font-bold">R$ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t font-bold text-elit-dark">
                      Total: R$ {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition">
                      Ir para Checkout
                    </button>
                  </div>
                ) : (
                  <p className="text-elit-dark/60 text-sm">Carrinho vazio</p>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Erro ao carregar produtos: {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount_price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -
                          {Math.round(
                            ((product.price - product.discount_price) / product.price) * 100
                          )}
                          %
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-elit-dark">{product.name}</h3>
                      <p className="text-elit-dark/70 text-sm mb-3 line-clamp-2">{product.description}</p>

                      {product.author && <p className="text-sm text-elit-dark/60 mb-2">Autor: {product.author}</p>}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {product.discount_price ? (
                            <>
                              <span className="text-elit-dark/50 line-through text-sm">
                                R$ {product.price.toFixed(2)}
                              </span>
                              <p className="text-2xl font-bold text-elit-orange">
                                R$ {product.discount_price.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-elit-red">
                              R$ {product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Estoque</p>
                          <p className="text-lg font-bold text-elit-red">{product.stock}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
