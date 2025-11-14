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
        // Auto-play bloqueado pelo browser, tentar novamente com interacção do usuário
        console.log('Auto-play bloqueado. Tentando novamente...')
        
        // Adicionar listener para primeira interacção do usuário
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

        // Escutar qualquer interacção do usuário
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

      {/* Controles de Música - Versão Compacta */}
      <div className="fixed bottom-4 right-4 z-50 bg-elit-dark/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-elit-yellow/10">
        <div className="flex items-center space-x-1">
          {/* Botão Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-6 h-6 bg-elit-red hover:bg-elit-red/80 rounded-full flex items-center justify-center transition-colors touch-manipulation"
            aria-label={isPlaying ? 'Pausar música' : 'Reproduzir música'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-white" />
            ) : (
              <Play className="w-3 h-3 text-white ml-0.5" />
            )}
          </button>

          {/* Botão Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="w-5 h-5 bg-elit-yellow hover:bg-elit-yellow/80 rounded-full flex items-center justify-center transition-colors touch-manipulation"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-2.5 h-2.5 text-elit-dark" />
            ) : (
              <Volume2 className="w-2.5 h-2.5 text-elit-dark" />
            )}
          </button>

          {/* Controle de Volume - Apenas Desktop */}
          <div className="hidden lg:flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-elit-yellow/30 rounded-lg appearance-none cursor-pointer slider ml-1"
              style={{
                background: `linear-gradient(to right, #F4A460 0%, #F4A460 ${volume * 100}%, rgba(244, 164, 96, 0.3) ${volume * 100}%, rgba(244, 164, 96, 0.3) 100%)`
              }}
            />
          </div>
        </div>

        {/* Indicador de música tocando */}
        {isPlaying && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
