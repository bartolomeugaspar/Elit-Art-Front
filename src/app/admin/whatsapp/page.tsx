'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'
import { QRCodeSVG } from 'qrcode.react'

interface WhatsAppStatus {
  connected: boolean
  initializing: boolean
  message: string
  qr?: string | null
}

interface MessageHistory {
  id: string
  from: string
  body: string
  timestamp: number
  type: 'sent' | 'received'
}

export default function WhatsAppControlPanel() {
  const { showToast } = useToast()
  const [status, setStatus] = useState<WhatsAppStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([])
  const [qrSize, setQrSize] = useState(256)

  useEffect(() => {
    // Set QR code size based on screen width
    const handleResize = () => {
      setQrSize(window.innerWidth < 640 ? 200 : 256)
    }
    
    handleResize() // Set initial size
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    checkStatus()
    loadMessageHistory()
    const interval = setInterval(() => {
      checkStatus()
      loadMessageHistory()
    }, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const whatsappApiUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://elit-art-back.onrender.com'
      const response = await fetch(`${whatsappApiUrl}/api/whatsapp-api/status`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setStatus(data.status)
    } catch (error) {
      setStatus({
        connected: false,
        initializing: false,
        message: 'Erro ao conectar com o servidor'
      })
    }
  }

  const loadMessageHistory = async () => {
    try {
      const whatsappApiUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://elit-art-back.onrender.com'
      const response = await fetch(`${whatsappApiUrl}/api/whatsapp-api/messages`)
      const data = await response.json()
      if (data.success) {
        setMessageHistory(data.messages || [])
      }
    } catch (error) {
      // Erro ao carregar histórico
    }
  }

  const initializeWhatsApp = async () => {
    setLoading(true)
    try {
      const whatsappApiUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://elit-art-back.onrender.com'
      const token = localStorage.getItem('token')
      const response = await fetch(`${whatsappApiUrl}/api/whatsapp-api/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        showToast('WhatsApp inicializado! Verifique o console do servidor para o QR Code.', 'success')
        setTimeout(checkStatus, 3000)
      } else {
        showToast(data.message || 'Erro ao inicializar WhatsApp', 'error')
      }
    } catch (error) {
      showToast('Erro ao conectar com o servidor', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || !message) {
      showToast('Preencha todos os campos', 'error')
      return
    }

    setLoading(true)
    try {
      const whatsappApiUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://elit-art-back.onrender.com'
      const response = await fetch(`${whatsappApiUrl}/api/whatsapp-api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message })
      })
      const data = await response.json()
      
      if (data.success) {
        showToast('Mensagem enviada com sucesso!', 'success')
        setPhoneNumber('')
        setMessage('')
        // Reload message history after sending
        setTimeout(loadMessageHistory, 1000)
      } else {
        showToast(data.message || 'Erro ao enviar mensagem', 'error')
      }
    } catch (error) {
      showToast('Erro ao enviar mensagem', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
              {status ? (
                <p className={`text-sm sm:text-base font-medium ${status.connected ? 'text-green-600' : status.initializing ? 'text-yellow-600' : 'text-red-600'}`}>
                  {status.message}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-gray-500">Verificando...</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={checkStatus}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                🔄 Atualizar
              </button>
              <button
                onClick={initializeWhatsApp}
                disabled={loading || status?.connected}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg ${
                  status?.connected
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Iniciando...' : status?.connected ? '✅ Conectado' : 'Inicializar'}
              </button>
            </div>
          </div>

          {/* QR Code Display */}
          {status?.qr && !status.connected && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                  📱 Escaneie o QR Code com seu WhatsApp
                </p>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg">
                    <QRCodeSVG 
                      value={status.qr} 
                      size={qrSize}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1 text-left sm:text-center max-w-md mx-auto">
                  <p>1. Abra o WhatsApp no seu celular</p>
                  <p>2. Toque em <strong>Mais opções</strong> ou <strong>Configurações</strong></p>
                  <p>3. Toque em <strong>Aparelhos conectados</strong></p>
                  <p>4. Toque em <strong>Conectar um aparelho</strong></p>
                  <p>5. Aponte seu celular para esta tela para escanear o código</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Send Message Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">📤 Enviar Mensagem</h2>
          <form onSubmit={sendMessage} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="921389141"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">9 dígitos ou 12 com código 244</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sua mensagem..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !status?.connected}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base ${
                loading || !status?.connected
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? '⏳ Enviando...' : '📨 Enviar'}
            </button>
          </form>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">💬 Histórico</h2>
            <button
              onClick={loadMessageHistory}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
            >
              🔄 Atualizar
            </button>
          </div>
          
          {messageHistory.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-8">
              Nenhuma mensagem ainda
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-96 overflow-y-auto">
              {messageHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 sm:p-4 rounded-lg border ${
                    msg.type === 'sent'
                      ? 'bg-blue-50 border-blue-200 ml-4 sm:ml-8'
                      : 'bg-gray-50 border-gray-200 mr-4 sm:mr-8'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 break-all">
                        {msg.type === 'sent' ? 'Para: ' : 'De: '}
                        {msg.from.replace('@c.us', '')}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          msg.type === 'sent'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {msg.type === 'sent' ? '📤' : '📥'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(msg.timestamp).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {msg.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}
