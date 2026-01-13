'use client'

import { Header, Footer } from '@/components'
import { useEvents } from '@/hooks'
import { Calendar, MapPin, Clock, ArrowRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

export default function EventosPage() {
  const { getUpcomingEvents, getPastEvents } = useEvents()
  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const categories = ['Música', 'Literatura', 'Teatro', 'Dança', 'Cinema', 'Desenho']

  const filteredEvents = useMemo(() => {
    let filtered = upcomingEvents

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery)
      )
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    return filtered
  }, [searchQuery, selectedCategory, upcomingEvents])

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Por favor, insira um email válido')
      return
    }

    setIsSubscribing(true)
    
    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Inscrição realizada com sucesso! Você receberá notificações sobre novos eventos.')
        setNewsletterEmail('')
      } else {
        if (data.message?.includes('already subscribed') || data.error?.includes('already subscribed')) {
          toast.error('Este email já está inscrito na newsletter')
        } else {
          toast.error(data.message || 'Erro ao fazer inscrição')
        }
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4">
              Eventos Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">
              Descubra nossos próximos eventos, workshops e exposições. Junte-se à nossa comunidade criativa.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Search Bar and Category Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-elit-dark/50" />
              <input
                type="text"
                placeholder="Procurar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-elit-orange bg-white text-elit-dark placeholder-elit-dark/50 focus:outline-none focus:ring-2 focus:ring-elit-orange"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5"
                >
                  <X className="w-5 h-5 text-elit-dark/50 hover:text-elit-dark" />
                </button>
              )}
            </div>

            {/* Category Combobox */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-3 rounded-xl border border-elit-orange bg-white text-elit-dark focus:outline-none focus:ring-2 focus:ring-elit-orange font-semibold sm:w-48"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-0">
            <p className="text-elit-dark/70 text-xs">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-0 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {filteredEvents.length > 0 || pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Future Events */}
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Event Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-elit-orange text-elit-light px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                      {event.category}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-elit-dark mb-2 sm:mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                        <span className="truncate">{event.time}</span>
                      </div>
                      <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-elit-dark/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    {/* Price */}
                    <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-elit-orange/30 space-y-1">
                      {!event.isPast && (
                        <>
                          {event.price && !event.isFree && (
                            <p className="text-xs text-elit-dark">
                              <span className="font-semibold text-elit-orange">{event.price.toFixed(2)}</span> AOA
                            </p>
                          )}
                          {event.isFree && (
                            <p className="text-xs text-elit-dark">
                              <span className="font-semibold text-elit-orange">Gratuito</span>
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link href={`/eventos/${event.id}`}>
                      <button className="w-full bg-elit-orange hover:bg-elit-red text-elit-light py-1.5 sm:py-2 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 group mt-auto">
                        <span>Ver Detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}

              {/* Past Events */}
              {pastEvents.map((event: any) => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full opacity-75 hover:opacity-100">
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"  
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-elit-light font-bold text-lg">Evento Terminado</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-elit-dark mb-2 sm:mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center text-elit-dark text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-elit-orange mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-elit-dark/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    {/* Attendees and Price */}
                    <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-elit-orange/30 space-y-1">
                      {event.attendees && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">{event.attendees}</span> Participantes
                        </p>
                      )}
                      {event.price && !event.isFree && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">{event.price.toFixed(2)}</span> AOA
                        </p>
                      )}
                      {event.isFree && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">Gratuito</span>
                        </p>
                      )}
                    </div>
                    
                    {/* CTA Button */}
                    <Link href={`/eventos/${event.id}`}>
                      <button className="w-full bg-elit-orange hover:bg-elit-red text-elit-light py-1.5 sm:py-2 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 group mt-auto">
                        <span>Ver Detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-elit-dark/70 text-lg">Nenhum evento encontrado com esses critérios.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-elit-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-elit-light mb-3 md:mb-4">
              Fique Atualizado
            </h2>
            <p className="text-sm sm:text-base text-elit-light/80 mb-6 md:mb-8">
              Inscreva-se na nossa newsletter para receber informações sobre novos eventos e oportunidades.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Seu email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={isSubscribing}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-elit-orange bg-elit-light text-elit-dark placeholder-elit-dark/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-elit-orange disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-elit-orange hover:bg-elit-gold text-elit-light px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscrevendo...
                  </>
                ) : (
                  'Inscrever'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
