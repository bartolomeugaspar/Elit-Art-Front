'use client'

import { useState } from 'react'
import { useArtworks } from '@/hooks/useArtworks'
import { Search, Filter, Palette, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components'

export default function GaleriaPage() {
  const { artworks, loading, error, fetchArtworks } = useArtworks()
  const [selectedType, setSelectedType] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const types = [
    { value: 'painting', label: '🎨 Pintura' },
    { value: 'sculpture', label: '🗿 Escultura' },
    { value: 'photography', label: '📷 Fotografia' },
    { value: 'digital', label: '💻 Digital' },
    { value: 'mixed_media', label: '🎭 Mídia Mista' },
  ]

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    if (type) {
      fetchArtworks(type)
    } else {
      fetchArtworks()
    }
  }

  const filteredArtworks = artworks.filter(
    (a) => !selectedType || a.type === selectedType
  )

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4 flex items-center gap-3">
              <Palette size={40} />
              Galeria de Obras
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">Conheça as obras dos nossos artistas</p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            className="mb-6 md:mb-8"
          >
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar obras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elit-red"
                />
              </div>
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
                  {selectedType ? types.find(t => t.value === selectedType)?.label : 'Filtros'}
                </span>
              </div>
              <ChevronDown size={20} className={`text-elit-red transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Filter Dropdown */}
            {showFilters && (
              <div className="mt-2 bg-white rounded-lg shadow-md p-4 space-y-2">
                <button
                  onClick={() => {
                    handleTypeChange('')
                    setShowFilters(false)
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    !selectedType
                      ? 'bg-elit-red text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                  }`}
                >
                  Todos os Tipos
                </button>
                {types.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      handleTypeChange(type.value)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedType === type.value
                        ? 'bg-elit-red text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Sidebar - Filtros (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-elit-red" />
                  <h3 className="text-lg font-bold text-elit-dark">Filtros</h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleTypeChange('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      !selectedType
                        ? 'bg-elit-red text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                    }`}
                  >
                    Todos os Tipos
                  </button>
                  {types.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleTypeChange(type.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedType === type.value
                          ? 'bg-elit-red text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          {/* Artworks Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
                <p className="mt-4 text-gray-600">Carregando obras...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Erro ao carregar obras: {error}
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhuma obra encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-64 bg-gray-200">
                      <Image
                        src={artwork.image_url}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                      {artwork.is_featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Em Destaque
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 text-elit-dark">{artwork.title}</h3>
                      <p className="text-sm text-elit-dark/70 mb-2">
                        {types.find((t) => t.value === artwork.type)?.label}
                      </p>
                      <p className="text-sm text-elit-dark/60 mb-3">
                        Artista: {artwork.artist_name}
                      </p>

                      <p className="text-elit-dark/70 text-sm mb-3 line-clamp-2">
                        {artwork.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-elit-dark/60">
                          <p>Ano: {artwork.year}</p>
                          {artwork.dimensions && <p>Dimensões: {artwork.dimensions}</p>}
                        </div>
                        {artwork.price && (
                          <p className="text-lg font-bold text-elit-red">
                            R$ {artwork.price.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <Link href={`/artworks/${artwork.id}`}>
                        <button className="w-full px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition">
                          Ver Detalhes
                        </button>
                      </Link>
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
