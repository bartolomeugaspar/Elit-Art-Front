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
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Inscrição no Evento</h2>
              <p className="text-slate-600 mt-1">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!isFree && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Valor do evento:</span>
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {eventPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'MZN',
                })}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
            </div>

            {/* Método de Pagamento (apenas para eventos pagos) */}
            {!isFree && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Método de Pagamento *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-900">
                      M-Pesa
                    </span>
                  </label>
                  <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-900">
                      Transferência Bancária
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Comprovativo de Pagamento (apenas para eventos pagos) */}
            {!isFree && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Comprovativo de Pagamento *
                </label>

                {proofPreview && (
                  <div className="mb-4 relative">
                    <img
                      src={proofPreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null)
                        setProofPreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                      title="Remover"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {proofFile && !proofPreview && (
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-2">
                    <FileText size={20} className="text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {proofFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProofFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {proofFile ? (
                      <>
                        <FileText className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Clique para alterar</span> o comprovativo
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Clique para enviar</span> ou arraste
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Imagem ou PDF (máx. 10MB)
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
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-purple-400 disabled:to-purple-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Processando...' : 'Confirmar Inscrição'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-900 px-6 py-3 rounded-lg transition duration-200 font-medium"
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
