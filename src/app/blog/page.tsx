'use client'

import { useState } from 'react'
import { useBlog } from '@/hooks/useBlog'
import { Search, BookOpen, Heart, MessageCircle, Eye, Filter, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components'

export default function BlogPage() {
  const { posts, loading, error, fetchPosts, searchPosts } = useBlog()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { value: 'magazine', label: '📰 Revista' },
    { value: 'story', label: '📖 Contos' },
    { value: 'article', label: '📝 Artigos' },
    { value: 'poetry', label: '✨ Poesia' },
    { value: 'drama', label: '🎭 Textos Dramáticos' },
  ]

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category) {
      fetchPosts(category)
    } else {
      fetchPosts()
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchPosts(searchQuery)
    }
  }

  const filteredPosts = posts.filter((p) => !selectedCategory || p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4 flex items-center gap-3">
              <BookOpen size={40} />
              Revista Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">
              Revistas, Contos, Artigos, Poesia e Textos Dramáticos
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 pb-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 md:mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar artigos..."
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

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-elit-red" />
              <span className="font-semibold text-elit-dark">
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : 'Filtros'}
              </span>
            </div>
            <ChevronDown size={20} className={`text-elit-red transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Filter Dropdown */}
          {showFilters && (
            <div className="mt-2 bg-white rounded-lg shadow-md p-4 space-y-2">
              <button
                onClick={() => {
                  handleCategoryChange('')
                  setShowFilters(false)
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  !selectedCategory
                    ? 'bg-elit-red text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                }`}
              >
                Todos os Artigos
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    handleCategoryChange(cat.value)
                    setShowFilters(false)
                  }}
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
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categorias (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-6 text-elit-dark">Categorias</h3>

              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    !selectedCategory
                      ? 'bg-elit-red text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                  }`}
                >
                  Todos os Artigos
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
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
                <p className="mt-4 text-gray-600">Carregando artigos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Erro ao carregar artigos: {error}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum artigo encontrado</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative h-48 md:h-full bg-gray-200">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="md:col-span-2 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-3 py-1 bg-elit-light text-elit-red rounded-full text-sm font-semibold">
                              {categories.find((c) => c.value === post.category)?.label}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold mb-2 line-clamp-2 text-elit-dark">{post.title}</h3>
                          <p className="text-elit-dark/70 mb-4 line-clamp-3">{post.excerpt}</p>

                          <div className="flex items-center gap-4 text-sm text-elit-dark/60">
                            <span>Por {post.author_name}</span>
                            <span>
                              {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-elit-red">
                            <Heart size={18} />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-2 text-elit-red">
                            <MessageCircle size={18} />
                            <span>Comentários</span>
                          </div>
                          <div className="flex items-center gap-2 text-elit-red">
                            <Eye size={18} />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
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
