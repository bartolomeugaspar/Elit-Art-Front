'use client'

import { Header, Footer } from '@/components'
import { useEvents } from '@/hooks'
import { Calendar, MapPin, Clock, ArrowRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export default function EventosPage() {
  const { getEvents, getPastEvents, searchEvents } = useEvents()
  const upcomingEvents = getEvents()
  const pastEvents = getPastEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['Workshop', 'Exposição', 'Masterclass', 'Networking']

  const filteredEvents = useMemo(() => {
    let filtered = searchQuery ? searchEvents(searchQuery) : upcomingEvents

    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    return filtered
  }, [searchQuery, selectedCategory, upcomingEvents, searchEvents])

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

                    {/* Attendees and Available Spots */}
                    <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-elit-orange/30 space-y-1">
                      {event.attendees && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">{event.attendees}</span>   Inscritos
                        </p>
                      )}
                      {event.availableSpots !== undefined && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">{event.availableSpots}</span> vagas disponíveis
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
                      <span className="text-elit-light font-bold text-lg">Evento Passado</span>
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

                    {/* Attendees */}
                    <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-elit-orange/30">
                      {event.attendees && (
                        <p className="text-xs text-elit-dark">
                          <span className="font-semibold text-elit-orange">{event.attendees}</span> Participantes
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-elit-orange bg-elit-light text-elit-dark placeholder-elit-dark/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-elit-orange"
              />
              <button className="bg-elit-orange hover:bg-elit-gold text-elit-light px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
