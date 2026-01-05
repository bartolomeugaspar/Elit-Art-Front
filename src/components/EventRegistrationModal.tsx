'use client'

import { useState } from 'react'
import { X, Upload, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_URL } from '@/lib/api'

interface EventRegistrationModalProps {
  eventId: string
  eventTitle: string
  isFree: boolean
  isPast: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EventRegistrationModal({
  eventId,
  eventTitle,
  isFree,
  isPast,
  onClose,
  onSuccess,
}: EventRegistrationModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingProof, setIsUploadingProof] = useState(false)

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo (imagem ou PDF)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas imagens (JPEG, PNG, WebP, GIF) ou PDF são permitidos')
      return
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo não pode ser maior que 10MB')
      return
    }

    setPaymentProofFile(file)

    // Criar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPaymentProofPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPaymentProofPreview(`📄 ${file.name}`)
    }
  }

  const uploadProof = async (): Promise<string | null> => {
    if (!paymentProofFile) {
      return null
    }

    setIsUploadingProof(true)
    const uploadToast = toast.loading('Enviando comprovativo...')

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', paymentProofFile)

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        toast.success('Comprovativo enviado!', { id: uploadToast })
        return data.imageUrl
      } else {
        throw new Error(data.message || 'Erro ao enviar comprovativo')
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar comprovativo',
        { id: uploadToast }
      )
      return null
    } finally {
      setIsUploadingProof(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Bloquear inscrição em eventos passados
    if (isPast) {
      toast.error('Não é possível se inscrever em eventos que já passaram')
      return
    }

    // Validar nome completo
    if (!fullName.trim()) {
      toast.error('Nome completo é obrigatório')
      return
    }

    // Validar e-mail
    if (!email.trim()) {
      toast.error('E-mail é obrigatório')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor, insira um e-mail válido')
      return
    }

    // Validar número de telefone
    if (!phoneNumber.trim()) {
      toast.error('Número de telefone é obrigatório')
      return
    }

    // Validar formato do telefone (aceitar vários formatos angolanos)
    const phoneRegex = /^[\d\s()+-]+$/
    if (!phoneRegex.test(phoneNumber) || phoneNumber.replace(/\D/g, '').length < 9) {
      toast.error('Por favor, insira um número de telefone válido')
      return
    }

    // Validar pagamento para eventos pagos
    if (!isFree) {
      if (!paymentMethod) {
        toast.error('Método de pagamento é obrigatório')
        return
      }

      // Comprovativo só é obrigatório se não for pagamento em dinheiro
      if (paymentMethod !== 'Cash' && !paymentProofFile) {
        toast.error('Comprovativo de pagamento é obrigatório')
        return
      }
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading('Processando inscrição...')

    try {
      let proofUrl = null

      // Upload proof if provided
      if (paymentProofFile) {
        proofUrl = await uploadProof()
        if (!proofUrl) {
          throw new Error('Falha ao enviar comprovativo. Por favor, tente novamente.')
        }
      }

      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const registrationData = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        payment_method: isFree ? null : paymentMethod,
        proof_url: proofUrl,
      }

      const response = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        let errorMessage = 'Erro ao se inscrever'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
          
          // A mensagem já vem em português do backend, não precisa traduzir
          // Apenas garantir que erros antigos em inglês ainda funcionem
          if (errorMessage.includes('already registered') && !errorMessage.includes('pode se inscrever')) {
            errorMessage = 'Voce nome já está registrado para este evento.'
          } else if (errorMessage.includes('No available spots')) {
            errorMessage = 'Não há mais vagas disponíveis para este evento'
          } else if (errorMessage.includes('Event not found')) {
            errorMessage = 'Evento não encontrado'
          }
        } catch (parseError) {
        }
        throw new Error(errorMessage)
      }

      
      toast.success('Inscrição realizada com sucesso!', {
        id: loadingToast,
        icon: <CheckCircle className="text-green-500" />,
        style: {
          background: '#f0fdf4',
          color: '#15803d',
          border: '1px solid #bbf7d0',
        },
      })

      // Disparar evento de notificação para o header
      
      // Disparar evento com pequeno delay para garantir que o listener está pronto
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('newRegistration', {
          detail: {
            name: fullName,
            email: email,
            eventTitle: eventTitle
          }
        }));
      }, 100);

      onSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao se inscrever. Por favor, tente novamente.'
      toast.error(errorMessage, { 
        id: loadingToast,
        duration: 6000,
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '2px solid #fca5a5',
          fontWeight: '500',
          fontSize: '14px',
          maxWidth: '500px',
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-elit-light rounded-xl max-w-md w-full max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-elit-dark">Inscrição</h2>
              <p className="text-elit-dark/70 mt-1 text-sm">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-elit-dark/40 hover:text-elit-dark/60 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isPast && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">
                Este evento já passou e não aceita novas inscrições.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-elit-dark mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2 bg-white border border-elit-dark/20 rounded-lg text-elit-dark placeholder-elit-dark/40 focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-elit-dark mb-1">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full px-4 py-2 bg-white border border-elit-dark/20 rounded-lg text-elit-dark placeholder-elit-dark/40 focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-elit-dark mb-1">
                Número de Telefone *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +244 923 456 789"
                className="w-full px-4 py-2 bg-white border border-elit-dark/20 rounded-lg text-elit-dark placeholder-elit-dark/40 focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
                required
              />
            </div>

            {/* Payment Section (only for paid events) */}
            {!isFree && (
              <>
                <div className="pt-4 border-t border-elit-dark/10">
                  <h3 className="font-semibold text-elit-dark mb-4">Informações de Pagamento</h3>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-elit-dark mb-1">
                      Método de Pagamento *
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-elit-dark/20 rounded-lg text-elit-dark focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
                      required
                    >
                      <option value="">Selecione um método</option>
                      <option value="Bank Transfer">Transferência Bancária</option>
                      <option value="Cash">Dinheiro (Pagamento em mão)</option>
                      <option value="Other">Outro</option>
                    </select>
                  </div>

                  {paymentMethod === 'Cash' && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💵 <strong>Pagamento em Dinheiro:</strong> Você deve trazer o valor exato no dia do evento. 
                        Sua inscrição ficará como "pendente" até a confirmação do pagamento pela nossa equipe.
                      </p>
                    </div>
                  )}

                  {/* Payment Proof */}
                  {paymentMethod !== 'Cash' && (
                  <div>
                    <label className="block text-sm font-medium text-elit-dark mb-2">
                      Comprovativo de Pagamento {paymentMethod && '*'}
                    </label>
                    <p className="text-xs text-elit-dark/60 mb-3">
                      Envie uma imagem ou PDF do comprovativo (recibo, screenshot, etc.)
                    </p>

                    {paymentProofPreview && (
                      <div className="mb-3">
                        {typeof paymentProofPreview === 'string' && paymentProofPreview.startsWith('data:') ? (
                          <img
                            src={paymentProofPreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-elit-dark/20"
                          />
                        ) : (
                          <div className="w-full h-32 bg-elit-light rounded-lg border border-elit-dark/20 flex items-center justify-center">
                            <p className="text-elit-dark/60 text-sm">{paymentProofPreview}</p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProofFile(null)
                            setPaymentProofPreview(null)
                          }}
                          className="mt-2 text-sm text-elit-red hover:text-elit-red/80 font-medium"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    )}

                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-elit-dark/20 rounded-lg cursor-pointer hover:border-elit-orange hover:bg-elit-orange/5 transition">
                      <div className="flex flex-col items-center justify-center">
                        {isUploadingProof ? (
                          <>
                            <div className="w-6 h-6 border-3 border-elit-orange border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-xs text-elit-dark/60">Enviando...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-elit-dark/40 mb-2" />
                            <p className="text-xs text-elit-dark/60 text-center">
                              <span className="font-semibold">Clique</span> ou arraste o arquivo
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                        onChange={handleProofUpload}
                        disabled={isUploadingProof}
                        className="hidden"
                      />
                    </label>
                  </div>
                  )}
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingProof || isPast}
                className="flex-1 bg-gradient-to-r from-elit-orange to-elit-gold hover:from-elit-orange/90 hover:to-elit-gold/90 disabled:from-elit-orange/50 disabled:to-elit-gold/50 disabled:cursor-not-allowed text-elit-light px-4 py-1.5 rounded-lg transition duration-200 font-medium text-sm"
              >
                {isPast 
                  ? 'Evento Terminado' 
                  : isUploadingProof 
                    ? 'Enviando comprovativo...' 
                    : isSubmitting 
                      ? 'Processando...' 
                      : 'Confirmar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isUploadingProof}
                className="flex-1 bg-elit-dark/10 hover:bg-elit-dark/20 disabled:bg-elit-dark/5 disabled:cursor-not-allowed text-elit-dark px-4 py-1.5 rounded-lg transition duration-200 font-medium text-sm"
              >
                Cancelar
              </button>
            </div>

            {!isFree && (
              <p className="text-xs text-elit-dark/60 text-center pt-2">
                {paymentMethod === 'Cash' 
                  ? 'Sua inscrição ficará pendente até o pagamento no dia do evento.' 
                  : 'Seu comprovativo será verificado. Você receberá confirmação em breve.'}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
