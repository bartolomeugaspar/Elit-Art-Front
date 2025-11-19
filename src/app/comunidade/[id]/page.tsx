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
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        apiUrl = apiUrl.replace(/\/api\/$/, '').replace(/\/$/, '')

        const response = await fetch(`${apiUrl}/api/forum/topics/${topicId}`)
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
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      apiUrl = apiUrl.replace(/\/api\/$/, '').replace(/\/$/, '')

      const response = await fetch(`${apiUrl}/api/forum/topics/${topicId}/replies`, {
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
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Topic Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(topic.category)}`}>
                      {getCategoryLabel(topic.category)}
                    </span>
                    {topic.is_pinned && (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        📌 Fixado
                      </span>
                    )}
                    {topic.is_closed && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        🔒 Fechado
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold text-elit-dark mb-4">
                    {topic.title}
                  </h1>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-elit-dark/70 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{topic.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {new Date(topic.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-elit-dark/60">
                  <Eye size={20} />
                  <span>{topic.views} visualizações</span>
                </div>
                <div className="flex items-center gap-2 text-elit-dark/60">
                  <MessageCircle size={20} />
                  <span>{topic.replies_count} respostas</span>
                </div>
              </div>
            </div>

            {/* Topic Description */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-elit-dark/80 leading-relaxed whitespace-pre-wrap">
                  {topic.description}
                </p>
              </div>
            </div>

            {/* Replies Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-elit-dark mb-6">
                Respostas ({replies.length})
              </h2>

              {replies.length === 0 ? (
                <p className="text-elit-dark/60 text-center py-8">
                  Nenhuma resposta ainda. Seja o primeiro a responder!
                </p>
              ) : (
                <div className="space-y-6">
                  {replies.map((reply) => (
                    <div key={reply.id} className="border-l-4 border-elit-red pl-6 py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-elit-dark">{reply.author_name}</p>
                          <p className="text-sm text-elit-dark/60">
                            {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <button className="flex items-center gap-1 text-elit-dark/60 hover:text-elit-red transition">
                          <Heart size={18} />
                          <span className="text-sm">{reply.likes}</span>
                        </button>
                      </div>
                      <p className="text-elit-dark/80 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            {!topic.is_closed ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-elit-dark mb-6">Enviar Resposta</h3>
                <form onSubmit={handleSubmitReply}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva sua resposta aqui..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elit-red resize-none"
                    rows={5}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReply || !replyContent.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <Send size={20} />
                      Enviar Resposta
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600 font-semibold">
                  🔒 Este tópico foi fechado e não aceita mais respostas.
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
