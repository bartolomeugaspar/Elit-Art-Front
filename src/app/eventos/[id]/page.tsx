'use client'

import { Header, Footer } from '@/components'
import { useEvents } from '@/hooks'
import { Calendar, MapPin, Clock, Share2, Heart, Users, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { getEventById, getTestimonialsByEventId } = useEvents()
  const event = getEventById(params.id)
  const testimonials = event ? getTestimonialsByEventId(event.id as number) : []
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  if (!event) {
    return (
      <div className="min-h-screen bg-elit-light">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold text-elit-dark mb-4">Evento não encontrado</h1>
          <Link href="/eventos" className="text-elit-orange hover:text-elit-gold">
            Voltar aos eventos
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const shareEvent = (platform: string) => {
    const url = `${window.location.origin}/eventos/${event.id}`
    const text = `Confira este evento: ${event.title}`
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`,
      email: `mailto:?subject=${event.title}&body=${text}\n${url}`
    }
    
    if (platform === 'email') {
      window.location.href = shareUrls[platform]
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const addToCalendar = () => {
    const eventDate = new Date(event.date).toISOString().split('T')[0]
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate}/${eventDate}&details=${encodeURIComponent(event.fullDescription || event.description)}&location=${encodeURIComponent(event.location)}`
    window.open(calendarUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />

      {/* Back Button */}
      <div className="pt-20 md:pt-24 pb-3 md:pb-4">
        <div className="container mx-auto px-4 sm:px-6">
          <Link href="/eventos" className="inline-flex items-center text-elit-orange hover:text-elit-gold transition-colors text-sm md:text-base">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Voltar aos eventos
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative h-48 sm:h-64 md:h-96 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6">
              <div className="inline-block bg-elit-orange text-elit-light px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-2 md:mb-4">
                {event.category}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-elit-light line-clamp-3">{event.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg">
                  <div className="flex items-center mb-2 md:mb-3">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-elit-orange mr-2 md:mr-3" />
                    <span className="font-semibold text-elit-dark text-sm md:text-base">Data</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm md:text-base">{event.date}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg">
                  <div className="flex items-center mb-2 md:mb-3">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-elit-orange mr-2 md:mr-3" />
                    <span className="font-semibold text-elit-dark text-sm md:text-base">Horário</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm md:text-base">{event.time}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg">
                  <div className="flex items-center mb-2 md:mb-3">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-elit-orange mr-2 md:mr-3" />
                    <span className="font-semibold text-elit-dark text-sm md:text-base">Local</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm md:text-base">{event.location}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg">
                  <div className="flex items-center mb-2 md:mb-3">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-elit-orange mr-2 md:mr-3" />
                    <span className="font-semibold text-elit-dark text-sm md:text-base">Inscritos</span>
                  </div>
                  <p className="text-elit-dark/70 text-sm md:text-base">{event.attendees} pessoas</p>
                </div>
                {event.availableSpots !== undefined && (
                  <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg">
                    <div className="flex items-center mb-2 md:mb-3">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-elit-orange mr-2 md:mr-3" />
                      <span className="font-semibold text-elit-dark text-sm md:text-base">Vagas Disponíveis</span>
                    </div>
                    <p className={`font-bold text-sm md:text-lg ${event.availableSpots === 0 ? 'text-elit-red' : 'text-elit-orange'}`}>
                      {event.availableSpots === 0 ? 'Evento Lotado' : `${event.availableSpots} vagas`}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-4 md:p-8 rounded-lg md:rounded-xl shadow-lg mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-elit-dark mb-3 md:mb-4">Sobre o Evento</h2>
                <p className="text-elit-dark/70 leading-relaxed text-sm md:text-base">
                  {event.fullDescription || event.description}
                </p>
              </div>

              {/* Gallery */}
              {event.images && event.images.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-elit-dark mb-3 md:mb-4">Galeria</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="rounded-lg md:rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={image}
                          alt={`${event.title} ${index + 1}`}
                          className="w-full h-40 sm:h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Action Buttons */}
              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg sticky top-20 md:top-24 space-y-2 md:space-y-3">
                <button className="w-full bg-elit-orange hover:bg-elit-gold text-elit-light py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300">
                  Inscrever-se
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
                    isLiked
                      ? 'bg-elit-red/20 text-elit-red'
                      : 'bg-elit-dark/10 text-elit-dark hover:bg-elit-dark/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isLiked ? 'Adicionado' : 'Favoritos'}</span>
                  <span className="sm:hidden">{isLiked ? '✓' : '♡'}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-elit-dark/10 text-elit-dark hover:bg-elit-dark/20 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Compartilhar</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl p-2 z-10 w-full">
                      <button
                        onClick={() => shareEvent('facebook')}
                        className="w-full text-left px-3 md:px-4 py-2 hover:bg-elit-light rounded text-elit-dark text-xs md:text-sm"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => shareEvent('twitter')}
                        className="w-full text-left px-3 md:px-4 py-2 hover:bg-elit-light rounded text-elit-dark text-xs md:text-sm"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => shareEvent('whatsapp')}
                        className="w-full text-left px-3 md:px-4 py-2 hover:bg-elit-light rounded text-elit-dark text-xs md:text-sm"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => shareEvent('email')}
                        className="w-full text-left px-3 md:px-4 py-2 hover:bg-elit-light rounded text-elit-dark text-xs md:text-sm"
                      >
                        Email
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={addToCalendar}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-elit-dark/10 text-elit-dark hover:bg-elit-dark/20 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Calendário</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
