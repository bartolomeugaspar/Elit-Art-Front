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
        
        // Se os replies vieram na resposta do tópico, usar eles
        if (data.replies && Array.isArray(data.replies)) {
          setReplies(data.replies)
        } else {
          // Caso contrário, buscar os replies separadamente
          const repliesResponse = await fetch(`${apiUrl}/forum/topics/${topicId}/replies`)
          if (repliesResponse.ok) {
            const repliesData = await repliesResponse.json()
            setReplies(repliesData.replies || [])
          } else {
            setReplies([])
          }
        }
        
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
        // Atualizar contador de comentários do tópico
        if (topic) {
          setTopic({ ...topic, replies_count: topic.replies_count + 1 })
        }
        // Recarregar os comentários do servidor para garantir sincronização
        const repliesResponse = await fetch(`${apiUrl}/forum/topics/${topicId}/replies`)
        if (repliesResponse.ok) {
          const repliesData = await repliesResponse.json()
          setReplies(repliesData.replies || [])
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
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
      general: 'bg-elit-light text-elit-dark border border-elit-orange',
      art: 'bg-elit-orange text-white',
      events: 'bg-elit-yellow text-elit-dark',
      collaboration: 'bg-elit-red text-white',
      feedback: 'bg-elit-brown text-white',
    }
    return colors[category] || 'bg-elit-light text-elit-dark'
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

      {/* Hero Section */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-2 text-elit-light hover:text-elit-yellow transition mb-6"
          >
            <ArrowLeft size={20} />
            Voltar à Comunidade
          </Link>
          {topic && (
            <div className="max-w-3xl">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getCategoryColor(topic.category)}`}>
                {getCategoryLabel(topic.category)}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-elit-light mb-3">
                {topic.title}
              </h1>
              <div className="flex items-center gap-4 text-elit-light/80 text-sm">
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {topic.views} visualizações
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {replies.length} {replies.length === 1 ? 'comentário' : 'comentários'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="py-8 md:py-12 pb-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Main Post Card */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              {/* Author Info */}
              <div className="p-6 border-b border-elit-light">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-elit-red to-elit-orange flex items-center justify-center text-white font-bold text-lg">
                    {topic.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-elit-dark text-lg">{topic.author_name}</p>
                    <div className="flex items-center gap-2 text-sm text-elit-dark/60">
                      <span>
                        {new Date(topic.created_at).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {topic.is_pinned && <span className="text-elit-orange">• 📌 Fixado</span>}
                      {topic.is_closed && <span className="text-elit-red">• 🔒 Fechado</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-elit-dark leading-relaxed text-base whitespace-pre-wrap">
                  {topic.description}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="p-6 border-b border-elit-light">
                <h2 className="text-xl font-bold text-elit-dark flex items-center gap-2">
                  <MessageCircle size={24} className="text-elit-orange" />
                  Comentários ({replies.length})
                </h2>
              </div>
              
              {replies.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle size={48} className="mx-auto text-elit-orange/30 mb-3" />
                  <p className="text-elit-dark/60">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                </div>
              ) : (
                <div className="divide-y divide-elit-light">
                  {replies.map((reply) => (
                    <div key={reply.id} className="p-6 hover:bg-elit-light/50 transition">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elit-red to-elit-orange flex items-center justify-center text-white font-bold">
                            {reply.author_name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-elit-dark">
                              {reply.author_name}
                            </p>
                            <span className="text-xs text-elit-dark/50">
                              {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'short',
                                year: new Date(reply.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                              })} às {new Date(reply.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-elit-dark leading-relaxed break-words mb-3">
                            {reply.content}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                            <button className="text-sm text-elit-red hover:text-elit-orange transition font-semibold flex items-center gap-1">
                              <Heart size={16} />
                              {reply.likes > 0 ? `Curtir (${reply.likes})` : 'Curtir'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Input */}
            {!topic.is_closed ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-elit-dark mb-4">Deixe seu comentário</h3>
                <form onSubmit={handleSubmitReply}>
                  <div className="space-y-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Compartilhe sua opinião..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-elit-light rounded-xl focus:outline-none focus:ring-2 focus:ring-elit-orange focus:border-transparent text-elit-dark placeholder-elit-dark/40 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReply || !replyContent.trim()}
                        className="px-6 py-3 bg-elit-red text-white rounded-xl hover:bg-elit-brown transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submittingReply ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Comentar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-elit-light border-2 border-elit-orange rounded-xl p-8 text-center">
                <p className="text-elit-dark font-semibold flex items-center justify-center gap-2">
                  <MessageCircle size={20} className="text-elit-orange" />
                  Este tópico foi fechado e não aceita mais comentários.
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
