'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components'
import { ArrowLeft, Heart, Eye, Share2, Clock, User } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  category: string
  author_name: string
  author_id?: string
  status: string
  views: number
  likes: number
  published_at: string
  created_at: string
  updated_at: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
        
        // Remove barra final se existir
        apiUrl = apiUrl.replace(/\/$/, '')
        
        const response = await fetch(`${apiUrl}/blog/slug/${slug}`)
        
        if (!response.ok) {
          throw new Error('Artigo não encontrado')
        }
        
        const data = await response.json()
        setPost(data.post || data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar artigo')
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  const handleLike = async () => {
    if (!post) return
    
    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
      
      // Remove barra final se existir
      apiUrl = apiUrl.replace(/\/$/, '')
      
      const response = await fetch(`${apiUrl}/blog/${post.id}/like`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setLiked(!liked)
        setPost({
          ...post,
          likes: liked ? post.likes - 1 : post.likes + 1,
        })
      }
    } catch (err) {
    }
  }

  const handleShare = async () => {
    if (!post) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      magazine: '📰 Revista',
      story: '📖 Contos',
      article: '📝 Artigos',
      poetry: '✨ Poesia',
      drama: '🎭 Textos Dramáticos',
      other: '📚 Outros',
    }
    return categories[category] || category
  }

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, idx) => (
        <p key={idx} className="mb-6 text-elit-dark/80 leading-relaxed text-lg">
          {paragraph}
        </p>
      ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
          <p className="mt-4 text-gray-600">Carregando artigo...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-6">
              <p className="text-lg font-semibold">Erro ao carregar artigo</p>
              <p className="mt-2">{error || 'Artigo não encontrado'}</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition"
            >
              <ArrowLeft size={20} />
              Voltar a Revista
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
            href="/blog"
            className="inline-flex items-center gap-2 text-elit-red hover:text-elit-brown transition"
          >
            <ArrowLeft size={20} />
            Voltar ao Blog
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-48 sm:h-64 md:h-96 lg:h-[500px] bg-gray-200 overflow-hidden">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <article className="py-12 md:py-16 pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-4 py-2 bg-elit-light text-elit-red rounded-full text-sm font-semibold">
                  {getCategoryLabel(post.category)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-elit-dark">
                {post.title}
              </h1>

              <div className="flex flex-col gap-2 text-elit-dark/70 mb-6 pb-6 border-b text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <User size={16} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold">{post.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="sm:w-5 sm:h-5" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-sm sm:text-base">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition ${
                    liked ? 'text-elit-red' : 'text-elit-dark/60 hover:text-elit-red'
                  }`}
                >
                  <Heart size={18} className="sm:w-5 sm:h-5" fill={liked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-elit-dark/60">
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{post.views} visualizações</span>
                  <span className="sm:hidden">{post.views}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-elit-dark/60 hover:text-elit-red transition"
                >
                  <Share2 size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Compartilhar</span>
                  <span className="sm:hidden">Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none mb-12">
              <p className="text-base sm:text-lg md:text-xl text-elit-dark/80 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="text-elit-dark/70 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {post.content}
              </div>
            </div>

            {/* Related Posts Section */}
            <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-elit-dark">Mais Artigos</h3>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-elit-red text-white text-sm sm:text-base rounded-lg hover:bg-elit-brown transition"
              >
                Ver todos os artigos
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
