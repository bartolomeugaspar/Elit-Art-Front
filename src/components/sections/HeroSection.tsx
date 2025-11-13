'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slides = [
    {
      image: '/WhatsApp Image 2025-11-13 at 16.39.48.jpeg',
      title: 'Liderança Artística',
      subtitle: 'Formando os líderes culturais de amanhã'
    },
    {
      image: '/WhatsApp Image 2025-11-13 at 16.44.22 (1).jpeg',
      title: 'Teatro & Performance',
      subtitle: 'Expressão dramática que toca a alma'
    },
    {
      image: '/WhatsApp Image 2025-11-13 at 16.44.22 (2).jpeg',
      title: 'Música & Dança',
      subtitle: 'Ritmos que celebram nossa identidade'
    },
    {
      image: '/WhatsApp Image 2025-11-13 at 16.39.50 (2).jpeg',
      title: 'Arte Visual',
      subtitle: 'Cores e formas da cultura angolana'
    },
    {
      image: '/WhatsApp Image 2025-11-13 at 16.39.49 (1).jpeg',
      title: 'Comunidade Artística',
      subtitle: 'Unidos pela paixão da arte'
    },
    {
      image: '/tr.jpeg',
      title: 'Tradição & Modernidade',
      subtitle: 'Preservando raízes, criando futuro'
    }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % slides.length
        return next
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section id="home" className="relative h-[98vh] flex items-center justify-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto">
          {/* Frase-mestra */}
          <p className="text-xl md:text-2xl font-light mb-8 text-elit-yellow italic animate-fade-in">
            "Elit'arte: Onde a essência angolana encontra a expressão artística."
          </p>
          
          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block">
              <span className="text-elit-yellow">Elit</span>
              <span className="text-elit-gold">'</span>
              <span className="text-elit-red">Arte</span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Movimento artístico angolano que une teatro, música, dança, literatura, pintura e cinema, 
            celebrando nossa rica cultura através da fusão entre tradição e contemporaneidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8">
            <button className="bg-gradient-to-r from-elit-red to-elit-brown text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:shadow-2xl transition-all transform hover:scale-105 text-base sm:text-lg">
              Conhecer História
            </button>
          </div>
          
          {/* Seta indicativa animada */}
          <div className="flex justify-center mb-8">
            <div className="animate-bounce">
              <ChevronDown className="w-8 h-8 text-elit-gold opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 z-20">
        <button
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all hover:scale-110"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all hover:scale-110"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-elit-gold scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all hover:scale-110"
        >
          {isAutoPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-30 animate-pulse">
        <div className="w-full h-full bg-elit-gold/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-10 w-20 h-20 opacity-30 animate-pulse delay-1000">
        <div className="w-full h-full bg-elit-orange/30 rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 opacity-30 animate-pulse delay-500">
        <div className="w-full h-full bg-elit-red/30 rounded-full"></div>
      </div>
    </section>
  )
}
