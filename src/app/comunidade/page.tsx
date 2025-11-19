'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Plus, Eye, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Header, Footer } from '@/components'

interface ForumTopic {
  id: string
  title: string
  description: string
  category: 'general' | 'art' | 'events' | 'collaboration' | 'feedback'
  author_name: string
  replies_count: number
  views: number
  is_pinned: boolean
  is_closed: boolean
  created_at: string
  updated_at: string
}

export default function ComunidadePage() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'art', label: 'Arte' },
    { value: 'events', label: 'Eventos' },
    { value: 'collaboration', label: 'Colaboração' },
    { value: 'feedback', label: 'Feedback' },
  ]

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        apiUrl = apiUrl.replace(/\/api\/$/, '').replace(/\/$/, '')
        
        const url = selectedCategory
          ? `${apiUrl}/api/forum/topics?category=${selectedCategory}`
          : `${apiUrl}/api/forum/topics`

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch topics')

        const data = await response.json()
        setTopics(data.topics || [])
      } catch (err) {
        setError('Erro ao carregar tópicos')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4 flex items-center gap-3">
              <MessageCircle size={40} />
              Comunidade Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">Fórum de Discussão - Compartilhe Ideias e Experiências</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <button className="w-full px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition flex items-center justify-center gap-2 mb-6">
                <Plus size={20} />
                Novo Tópico
              </button>

              <h3 className="text-lg font-bold mb-4 text-elit-dark">Categorias</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    !selectedCategory
                      ? 'bg-elit-red text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-elit-dark'
                  }`}
                >
                  Todos os Tópicos
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
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

              {/* Stats */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-bold mb-4 text-elit-dark">Estatísticas</h4>
                <div className="space-y-3 text-sm text-elit-dark/70">
                  <div className="flex justify-between">
                    <span>Total de Tópicos</span>
                    <span className="font-bold text-elit-dark">{topics.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Respostas</span>
                    <span className="font-bold text-elit-dark">{topics.reduce((sum, t) => sum + t.replies_count, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visualizações</span>
                    <span className="font-bold text-elit-dark">{topics.reduce((sum, t) => sum + t.views, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
                <p className="mt-4 text-gray-600">Carregando tópicos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            ) : topics.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">Nenhum tópico encontrado</p>
                <p className="text-gray-500 mt-2">Seja o primeiro a criar um tópico!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pinned Topics */}
                {topics.filter((t) => t.is_pinned).map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/comunidade/${topic.id}`}
                    className="block bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-600 font-bold">📌 FIXADO</span>
                          <span className="inline-block px-2 py-1 bg-elit-light text-elit-red rounded text-xs font-semibold">
                            {categories.find((c) => c.value === topic.category)?.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-elit-dark">{topic.title}</h3>
                        <p className="text-elit-dark/70 text-sm line-clamp-2">{topic.description}</p>
                        <p className="text-xs text-elit-dark/60 mt-2">
                          Por {topic.author_name} • {new Date(topic.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="flex items-center gap-4 text-sm text-elit-dark/60">
                          <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            <span>{topic.replies_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{topic.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Regular Topics */}
                {topics.filter((t) => !t.is_pinned).map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/comunidade/${topic.id}`}
                    className={`block bg-white rounded-lg p-4 hover:shadow-md transition border ${
                      topic.is_closed ? 'border-elit-orange opacity-75' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.is_closed && (
                            <span className="text-red-600 font-bold text-xs">🔒 FECHADO</span>
                          )}
                          <span className="inline-block px-2 py-1 bg-elit-light text-elit-red rounded text-xs font-semibold">
                            {categories.find((c) => c.value === topic.category)?.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-elit-dark">{topic.title}</h3>
                        <p className="text-elit-dark/90 text-sm line-clamp-2">{topic.description}</p>
                        <p className="text-xs text-elit-dark mt-2">
                          Por {topic.author_name} • {new Date(topic.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="flex items-center gap-4 text-sm text-elit-dark/60">
                          <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            <span>{topic.replies_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{topic.views}</span>
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
