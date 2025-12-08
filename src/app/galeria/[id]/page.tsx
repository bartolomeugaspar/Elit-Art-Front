'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components'
import { ArrowLeft, Heart, Eye, Share2, Calendar, User } from 'lucide-react'

interface Artwork {
  id: string
  title: string
  description: string
  artist_id: string
  artist_name: string
  type: 'painting' | 'sculpture' | 'photography' | 'digital' | 'mixed_media' | 'other'
  year: number
  image_url: string
  views: number
  likes: number
  created_at: string
  updated_at: string
}

export default function ArtworkDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true)
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
        apiUrl = apiUrl.replace(/\/$/, '')

        const response = await fetch(`${apiUrl}/artworks/${id}`)

        if (!response.ok) {
          throw new Error('Obra não encontrada')
        }

        const data = await response.json()
        setArtwork(data.artwork || data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar obra')
        setArtwork(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArtwork()
    }
  }, [id])

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      painting: '🎨 Pintura',
      sculpture: '🗿 Escultura',
      photography: '📷 Fotografia',
      digital: '💻 Digital',
      mixed_media: '🎭 Mídia Mista',
      other: '✨ Outro',
    }
    return types[type] || type
  }

  const handleLike = async () => {
    if (!artwork) return

    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
      apiUrl = apiUrl.replace(/\/$/, '')

      const endpoint = liked ? 'unlike' : 'like'
      const response = await fetch(`${apiUrl}/artworks/${id}/${endpoint}`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setArtwork({ ...artwork, likes: data.likes })
        setLiked(!liked)
      }
    } catch (error) {
      console.error('Erro ao processar like:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork?.title,
        text: artwork?.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
          <p className="mt-4 text-gray-600">Carregando obra...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-6">
              <p className="text-lg font-semibold">Erro ao carregar obra</p>
              <p className="mt-2">{error || 'Obra não encontrada'}</p>
            </div>
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 px-6 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition"
            >
              <ArrowLeft size={20} />
              Voltar à Galeria
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-elit-red hover:text-elit-brown transition"
          >
            <ArrowLeft size={20} />
            Voltar à Galeria
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 sm:py-12 md:py-16 pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Image Section */}
              <div className="md:col-span-2">
                <div className="relative h-48 sm:h-64 md:h-96 lg:h-full min-h-64 md:min-h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-4 sm:space-y-6">
                {/* Type Badge */}
                <div>
                  <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-elit-light text-elit-red rounded-full text-xs sm:text-sm font-semibold">
                    {getTypeLabel(artwork.type)}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-elit-dark mb-2">
                    {artwork.title}
                  </h1>
                </div>

                {/* Artist Info */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <User size={18} className="sm:w-5 sm:h-5 text-elit-red" />
                    <span className="font-semibold text-elit-dark text-sm sm:text-base">Artista</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm sm:text-base">{artwork.artist_name}</p>
                </div>

                {/* Year */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Calendar size={18} className="sm:w-5 sm:h-5 text-elit-red" />
                    <span className="font-semibold text-elit-dark text-sm sm:text-base">Ano</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm sm:text-base">{artwork.year}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                      <Eye size={16} className="sm:w-5 sm:h-5 text-elit-red" />
                      <span className="font-semibold text-elit-dark text-sm sm:text-base">{artwork.views || 0}</span>
                    </div>
                    <p className="text-xs text-elit-dark/60">Visualizações</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                      <Heart size={16} className={`sm:w-5 sm:h-5 ${liked ? 'fill-elit-red text-elit-red' : 'text-elit-red'}`} />
                      <span className="font-semibold text-elit-dark text-sm sm:text-base">{artwork.likes || 0}</span>
                    </div>
                    <p className="text-xs text-elit-dark/60">Curtidas</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
                  <button
                    onClick={handleLike}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                      liked
                        ? 'bg-elit-red text-white'
                        : 'bg-gray-100 text-elit-dark hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={18} className={`sm:w-5 sm:h-5 ${liked ? 'fill-white' : ''}`} />
                    {liked ? 'Curtida' : 'Curtir'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-elit-orange text-white rounded-lg font-semibold hover:bg-elit-brown transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 sm:mt-12 bg-white rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-elit-dark mb-3 sm:mb-4">Sobre a Obra</h2>
              <p className="text-elit-dark/80 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {artwork.description}
              </p>
            </div>

            {/* Related Works */}
            <div className="mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-elit-dark mb-4 sm:mb-6">Mais Obras do Artista</h2>
              <Link
                href={`/galeria?artist=${artwork.artist_name}`}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition font-semibold text-sm sm:text-base"
              >
                Ver todas as obras de {artwork.artist_name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
