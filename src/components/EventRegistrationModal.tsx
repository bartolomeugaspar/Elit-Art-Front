'use client'

import { useState } from 'react'
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_URL } from '@/lib/api'

interface EventRegistrationModalProps {
  eventId: string
  eventTitle: string
  eventPrice: number
  isFree: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EventRegistrationModal({
  eventId,
  eventTitle,
  eventPrice,
  isFree,
  onClose,
  onSuccess,
}: EventRegistrationModalProps) {
  const [fullName, setFullName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'transfer' | ''>('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
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

    setProofFile(file)

    // Criar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProofPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProofPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!fullName.trim()) {
      toast.error('Nome completo é obrigatório')
      return
    }

    if (!isFree) {
      if (!paymentMethod) {
        toast.error('Selecione um método de pagamento')
        return
      }

      if (!proofFile) {
        toast.error('Comprovativo de pagamento é obrigatório')
        return
      }
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading('Processando inscrição...')

    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        Authorization: token ? `Bearer ${token}` : '',
      }

      // Se for evento pago, fazer upload do comprovativo primeiro
      let proofUrl = ''
      if (!isFree && proofFile) {
        const formData = new FormData()
        formData.append('file', proofFile)

        const uploadResponse = await fetch(`${API_URL}/upload/proof`, {
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Erro ao enviar comprovativo')
        }

        const uploadData = await uploadResponse.json()
        proofUrl = uploadData.fileUrl
      }

      // Fazer inscrição
      const registrationResponse = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          paymentMethod: isFree ? null : paymentMethod,
          proofUrl: isFree ? null : proofUrl,
        }),
      })

      if (!registrationResponse.ok) {
        const error = await registrationResponse.json()
        throw new Error(error.message || 'Erro ao se inscrever')
      }

      toast.success(
        isFree
          ? 'Inscrição realizada com sucesso!'
          : 'Inscrição enviada! Aguarde confirmação do pagamento.',
        {
          id: loadingToast,
          duration: 3000,
        }
      )

      onSuccess()
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao se inscrever',
        {
          id: loadingToast,
        }
      )
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
        className="bg-white rounded-xl max-w-sm w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-elit-orange to-elit-gold p-4 text-white">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h2 className="text-xl font-bold">Inscrição</h2>
              <p className="text-elit-light/90 mt-0.5 text-xs line-clamp-2">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-elit-light hover:text-white transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {!isFree && (
            <div className="mb-4 p-3 bg-gradient-to-br from-elit-orange/10 to-elit-gold/10 border border-elit-orange/30 rounded-lg">
              <p className="text-xs text-elit-dark font-semibold">
                Valor:
              </p>
              <p className="text-2xl font-bold text-elit-orange mt-1">
                {eventPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'MZN',
                })}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nome Completo */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-elit-dark mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-3 py-2 bg-elit-light border-2 border-elit-light rounded-lg text-sm text-elit-dark placeholder-elit-dark/50 focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
                required
              />
            </div>

            {/* Método de Pagamento (apenas para eventos pagos) */}
            {!isFree && (
              <div>
                <label className="block text-xs font-medium text-elit-dark mb-2">
                  Método de Pagamento *
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center p-2 border-2 border-elit-light rounded-lg cursor-pointer hover:bg-elit-light/50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
                      className="w-3 h-3 text-elit-orange"
                    />
                    <span className="ml-2 text-xs font-medium text-elit-dark">
                      M-Pesa
                    </span>
                  </label>
                  <label className="flex items-center p-2 border-2 border-elit-light rounded-lg cursor-pointer hover:bg-elit-light/50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
                      className="w-3 h-3 text-elit-orange"
                    />
                    <span className="ml-2 text-xs font-medium text-elit-dark">
                      Transferência Bancária
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Comprovativo de Pagamento (apenas para eventos pagos) */}
            {!isFree && (
              <div>
                <label className="block text-xs font-medium text-elit-dark mb-1">
                  Comprovativo *
                </label>

                {proofPreview && (
                  <div className="mb-2 relative">
                    <img
                      src={proofPreview}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg border-2 border-elit-orange"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null)
                        setProofPreview(null)
                      }}
                      className="absolute top-1 right-1 bg-elit-red hover:bg-elit-red/80 text-white p-1 rounded-full transition"
                      title="Remover"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {proofFile && !proofPreview && (
                  <div className="mb-2 p-2 bg-elit-light border-2 border-elit-orange rounded-lg flex items-center gap-2">
                    <FileText size={16} className="text-elit-orange flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-elit-dark truncate">
                        {proofFile.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProofFile(null)}
                      className="text-elit-red hover:text-elit-red/80 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full p-3 border-2 border-dashed border-elit-orange/30 rounded-lg cursor-pointer hover:border-elit-orange hover:bg-elit-orange/5 transition">
                  <div className="flex flex-col items-center justify-center">
                    {proofFile ? (
                      <>
                        <FileText className="w-5 h-5 text-elit-orange mb-1" />
                        <p className="text-xs text-elit-dark text-center">
                          <span className="font-semibold">Alterar</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-elit-orange/60 mb-1" />
                        <p className="text-xs text-elit-dark text-center">
                          <span className="font-semibold">Enviar</span> comprovativo
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2 pt-3 border-t border-elit-light">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-elit-orange to-elit-gold hover:from-elit-gold hover:to-elit-orange disabled:from-elit-orange/50 disabled:to-elit-gold/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-200 font-medium text-sm shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Processando...' : 'Confirmar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-elit-light hover:bg-elit-light/80 disabled:bg-elit-light/50 disabled:cursor-not-allowed text-elit-dark px-4 py-2 rounded-lg transition duration-200 font-medium text-sm border border-elit-light"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
