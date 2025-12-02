'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header, Footer } from '@/components'
import { ArrowLeft, MessageCircle, Eye, Heart, Share2, Send } from 'lucide-react'

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

interface ForumReply {
  id: string
  topic_id: string
  author_name: string
  content: string
  likes: number
  created_at: string
}

export default function TopicDetailPage() {
  const params = useParams()
  const topicId = params.id as string
  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
        apiUrl = apiUrl.replace(/\/$/, '')

        const response = await fetch(`${apiUrl}/forum/topics/${topicId}`)
        if (!response.ok) throw new Error('Tópico não encontrado')

        const data = await response.json()
        setTopic(data.topic || data)
        setReplies(data.replies || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tópico')
        setTopic(null)
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      fetchTopic()
    }
  }, [topicId])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !topic) return

    setSubmittingReply(true)
    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
      apiUrl = apiUrl.replace(/\/$/, '')

      const response = await fetch(`${apiUrl}/forum/topics/${topicId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_name: 'Anônimo',
          content: replyContent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReplies([...replies, data.reply])
        setReplyContent('')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro ao enviar resposta:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      console.error('Erro ao enviar resposta:', err)
      alert(`Erro ao enviar resposta: ${err instanceof Error ? err.message : 'Tente novamente.'}`)
    } finally {
      setSubmittingReply(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      general: '💬 Geral',
      art: '🎨 Arte',
      events: '🎉 Eventos',
      collaboration: '🤝 Colaboração',
      feedback: '💡 Feedback',
    }
    return categories[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-blue-100 text-blue-800',
      art: 'bg-purple-100 text-purple-800',
      events: 'bg-green-100 text-green-800',
      collaboration: 'bg-orange-100 text-orange-800',
      feedback: 'bg-red-100 text-red-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-elit-red"></div>
          <p className="mt-4 text-gray-600">Carregando tópico...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-6">
              <p className="text-lg font-semibold">Erro ao carregar tópico</p>
              <p className="mt-2">{error || 'Tópico não encontrado'}</p>
            </div>
            <Link
              href="/comunidade"
              className="inline-flex items-center gap-2 px-6 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition"
            >
              <ArrowLeft size={20} />
              Voltar à Comunidade
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
            href="/comunidade"
            className="inline-flex items-center gap-2 text-elit-red hover:text-elit-brown transition"
          >
            <ArrowLeft size={20} />
            Voltar à Comunidade
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 md:py-12 pb-24 md:pb-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Main Post Card - Estilo Facebook */}
            <div className="bg-white rounded-lg shadow mb-4">
              {/* Author Info */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elit-red to-elit-orange flex items-center justify-center text-white font-bold">
                    {topic.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-elit-dark">{topic.author_name}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(topic.category)}`}>
                        {getCategoryLabel(topic.category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-elit-dark/60">
                      <span>
                        {new Date(topic.created_at).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {topic.is_pinned && <span className="text-yellow-600">• 📌 Fixado</span>}
                      {topic.is_closed && <span className="text-red-600">• 🔒 Fechado</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <h1 className="text-xl md:text-2xl font-bold text-elit-dark mb-3">
                  {topic.title}
                </h1>
                <p className="text-elit-dark leading-relaxed whitespace-pre-wrap">
                  {topic.description}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="px-4 py-2 border-t border-b flex items-center justify-between text-sm text-elit-dark/60">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {topic.views} visualizações
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  {replies.length} {replies.length === 1 ? 'comentário' : 'comentários'}
                </span>
              </div>

              {/* Action Buttons (opcional) */}
              <div className="px-4 py-2 flex items-center gap-2">
                <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg transition text-elit-dark/70 font-semibold text-sm">
                  👍 Curtir
                </button>
                <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg transition text-elit-dark/70 font-semibold text-sm">
                  💬 Comentar
                </button>
                <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg transition text-elit-dark/70 font-semibold text-sm">
                  ↗️ Compartilhar
                </button>
              </div>
            </div>

            {/* Comments Section - Estilo Facebook */}
            <div className="bg-white rounded-lg shadow">
              {replies.length === 0 ? (
                <div className="p-6 text-center text-elit-dark/60">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              ) : (
                <div>
                  {replies.map((reply, index) => (
                    <div key={reply.id} className={`p-4 ${index !== 0 ? 'border-t' : ''} hover:bg-gray-50 transition`}>
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elit-dark to-elit-brown flex items-center justify-center text-white font-bold text-sm">
                            {reply.author_name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                            <p className="font-semibold text-elit-dark text-sm mb-1">
                              {reply.author_name}
                            </p>
                            <p className="text-elit-dark text-sm leading-relaxed break-words">
                              {reply.content}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4 mt-1 px-2 text-xs">
                            <button className="text-elit-dark/60 hover:underline font-semibold hover:text-elit-red transition">
                              Curtir
                            </button>
                            <button className="text-elit-dark/60 hover:underline font-semibold hover:text-elit-red transition">
                              Responder
                            </button>
                            <span className="text-elit-dark/50">
                              {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'short',
                                year: new Date(reply.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                              })} às {new Date(reply.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {reply.likes > 0 && (
                              <span className="flex items-center gap-1 text-elit-red font-semibold ml-auto">
                                ❤️ {reply.likes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Input - Estilo Facebook */}
            {!topic.is_closed ? (
              <div className="bg-white rounded-lg shadow mt-4 p-4">
                <form onSubmit={handleSubmitReply}>
                  <div className="flex gap-2">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                        U
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Escreva um comentário..."
                          className="w-full text-elit-dark text-sm px-4 py-2 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-elit-red"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSubmitReply(e)
                            }
                          }}
                        />
                        {replyContent.trim() && (
                          <button
                            type="submit"
                            disabled={submittingReply}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-elit-red hover:text-elit-brown transition disabled:opacity-50"
                          >
                            <Send size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow mt-4 p-6 text-center border-2 border-gray-200">
                <p className="text-gray-600 font-semibold">
                  🔒 Este tópico foi fechado e não aceita mais comentários.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
