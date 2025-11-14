'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3) // Volume baixo por padrão
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Configurar áudio
    audio.volume = volume
    audio.loop = true

    // Função para tentar reproduzir automaticamente
    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        // Auto-play bloqueado pelo browser, tentar novamente com interação do usuário
        console.log('Auto-play bloqueado. Tentando novamente...')
        
        // Adicionar listener para primeira interação do usuário
        const handleUserInteraction = async () => {
          try {
            await audio.play()
            setIsPlaying(true)
            // Remover listeners após sucesso
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
          } catch (err) {
            console.error('Erro ao reproduzir áudio:', err)
          }
        }

        // Escutar qualquer interação do usuário
        document.addEventListener('click', handleUserInteraction, { once: true })
        document.addEventListener('touchstart', handleUserInteraction, { once: true })
        document.addEventListener('keydown', handleUserInteraction, { once: true })
      }
    }

    // Tentar reproduzir imediatamente
    playAudio()

    // Também tentar após um pequeno delay
    const timer = setTimeout(playAudio, 500)

    return () => {
      clearTimeout(timer)
      // Limpar listeners se o componente for desmontado
      document.removeEventListener('click', playAudio)
      document.removeEventListener('touchstart', playAudio)
      document.removeEventListener('keydown', playAudio)
    }
  }, [volume])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Erro ao controlar áudio:', error)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    const audio = audioRef.current
    if (audio) {
      audio.volume = newVolume
    }
  }

  return (
    <>
      {/* Áudio */}
      <audio
        ref={audioRef}
        preload="auto"
        autoPlay
        loop
        playsInline
        muted={false}
      >
        <source src="/musica-fundo.mp3" type="audio/mpeg" />
        <source src="/musica-fundo.ogg" type="audio/ogg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Controles de Música */}
      <div className="fixed bottom-3 right-3 xs:bottom-4 xs:right-4 z-50 bg-elit-dark/90 backdrop-blur-sm rounded-full p-1.5 xs:p-2 sm:p-3 shadow-lg border border-elit-yellow/20">
        <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
          {/* Botão Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-elit-red hover:bg-elit-red/80 rounded-full flex items-center justify-center transition-colors touch-manipulation"
            aria-label={isPlaying ? 'Pausar música' : 'Reproduzir música'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
            )}
          </button>

          {/* Botão Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 bg-elit-yellow hover:bg-elit-yellow/80 rounded-full flex items-center justify-center transition-colors touch-manipulation"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-elit-dark" />
            ) : (
              <Volume2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-elit-dark" />
            )}
          </button>

          {/* Controle de Volume - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 lg:w-20 h-1 bg-elit-yellow/30 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #F4A460 0%, #F4A460 ${volume * 100}%, rgba(244, 164, 96, 0.3) ${volume * 100}%, rgba(244, 164, 96, 0.3) 100%)`
              }}
            />
          </div>
        </div>

        {/* Controle de Volume Mobile - Expandido */}
        <div className="md:hidden mt-2 px-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-elit-yellow/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #F4A460 0%, #F4A460 ${volume * 100}%, rgba(244, 164, 96, 0.3) ${volume * 100}%, rgba(244, 164, 96, 0.3) 100%)`
            }}
          />
        </div>

        {/* Indicador de música tocando */}
        {isPlaying && (
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Estilos CSS para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #F4A460;
          cursor: pointer;
          border: 2px solid #DAA520;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #F4A460;
          cursor: pointer;
          border: 2px solid #DAA520;
        }
      `}</style>
    </>
  )
}
