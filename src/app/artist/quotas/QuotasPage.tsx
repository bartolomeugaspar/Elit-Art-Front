'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Upload, CheckCircle, XCircle, Clock, Eye, Trash2, DollarSign, Calendar, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Payment {
  id: number
  valor: string
  mes_referencia: string
  metodo_pagamento: string
  comprovante_url?: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  data_pagamento: string
  observacoes?: string
  data_aprovacao?: string
  motivo_rejeicao?: string
}

interface FormData {
  valor: string
  mes_referencia: string
  metodo_pagamento: string
  comprovante_url: string
  observacoes?: string
}

interface Toast {
  show: boolean
  type: 'success' | 'error' | ''
  message: string
}

interface MonthOption {
  value: string
  label: string
  disabled?: boolean
}

const QuotasPage = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [toast, setToast] = useState<Toast>({ show: false, type: '', message: '' })
  const [formData, setFormData] = useState<FormData>({
    valor: '',
    mes_referencia: '',
    metodo_pagamento: 'transferencia',
    comprovante_url: ''
  })
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file')

  useEffect(() => {
    loadPayments()
  }, [])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' })
    }, 5000)
  }

  const loadPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/artist-quota-payments')
      setPayments(response.data.data || [])
    } catch (error) {
      showToast('error', 'Erro ao carregar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamanho (máximo 10MB)
      if (file.size > 10485760) {
        showToast('error', 'Arquivo muito grande. Máximo: 10MB')
        return
      }
      
      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Tipo de arquivo não permitido. Use JPEG, PNG, WEBP ou PDF')
        return
      }
      
      setComprovanteFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.valor || !formData.mes_referencia) {
      showToast('error', 'Preencha todos os campos obrigatórios')
      return
    }

    // Verificar se o mês selecionado já foi pago
    const monthOptions = generateMonthOptions()
    const selectedMonth = monthOptions.find(m => m.value === formData.mes_referencia)
    if (selectedMonth?.disabled) {
      showToast('error', 'Este mês já foi pago. Selecione outro mês.')
      return
    }

    // Validar que há um comprovante (arquivo ou link)
    if (uploadMethod === 'file' && !comprovanteFile) {
      showToast('error', 'Por favor, selecione um arquivo de comprovante')
      return
    }
    
    if (uploadMethod === 'link' && !formData.comprovante_url) {
      showToast('error', 'Por favor, informe o link do comprovante')
      return
    }

    try {
      setSubmitting(true)
      const submitData = new FormData()
      submitData.append('valor', formData.valor)
      submitData.append('mes_referencia', formData.mes_referencia)
      submitData.append('metodo_pagamento', formData.metodo_pagamento)
      if (formData.observacoes) {
        submitData.append('observacoes', formData.observacoes)
      }
      
      if (uploadMethod === 'file' && comprovanteFile) {
        submitData.append('comprovante', comprovanteFile)
      } else if (uploadMethod === 'link') {
        submitData.append('comprovante_url', formData.comprovante_url)
      }

      await api.post('/artist-quota-payments', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      showToast('success', 'Pagamento criado com sucesso! Seu pagamento está pendente de aprovação.')
      setShowNewPaymentModal(false)
      setFormData({
        valor: '',
        mes_referencia: '',
        metodo_pagamento: 'transferencia',
        comprovante_url: ''
      })
      setComprovanteFile(null)
      setUploadMethod('file')
      loadPayments()
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Erro ao criar pagamento')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePayment = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este pagamento?')) {
      try {
        await api.delete(`/artist-quota-payments/${id}`)
        showToast('success', 'Pagamento deletado com sucesso!')
        loadPayments()
      } catch (error) {
        showToast('error', 'Erro ao deletar pagamento')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: Clock,
        label: 'Pendente'
      },
      aprovado: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
        label: 'Aprovado'
      },
      rejeitado: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: XCircle,
        label: 'Rejeitado'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {config.label}
      </span>
    )
  }

  // Gerar opções de meses apenas do ano atual
  const generateMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = []
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() // 0-11
    
    // Criar array com meses pagos (aprovados ou pendentes)
    const paidMonths = new Set(
      payments
        .filter(p => p.status === 'aprovado' || p.status === 'pendente')
        .map(p => p.mes_referencia)
    )
    
    // Gerar todos os meses do ano atual
    for (let month = 0; month < 12; month++) {
      const monthValue = String(month + 1).padStart(2, '0')
      const value = `${currentYear}-${monthValue}`
      const date = new Date(currentYear, month, 1)
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      
      // Apenas adicionar se NÃO foi pago
      if (!paidMonths.has(value)) {
        options.push({ 
          value, 
          label
        })
      }
    }
    
    return options
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Meus Pagamentos</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Gerencie os pagamentos das suas cotas mensais - Ano {new Date().getFullYear()}</p>
        </div>
        <button 
          onClick={() => {
            const availableMonths = generateMonthOptions().length
            if (availableMonths === 0) {
              showToast('error', 'Todos os meses do ano já foram pagos!')
              return
            }
            setShowNewPaymentModal(true)
          }}
          className="btn btn-primary inline-flex items-center justify-center w-full sm:w-auto text-sm sm:text-base"
          title={`${generateMonthOptions().length} meses disponíveis`}
        >
          <CreditCard size={18} className="mr-2" />
          Novo Pagamento
        </button>
      </div>

      {/* Resumo de Pagamentos */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-600 leading-tight">Total</span>
            <DollarSign className="text-blue-500 flex-shrink-0" size={16} />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{payments.length}</p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-600 leading-tight">Disponíveis</span>
            <Calendar className="text-purple-500 flex-shrink-0" size={16} />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
            {generateMonthOptions().filter(m => !m.disabled).length}
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-600 leading-tight">Pendentes</span>
            <Clock className="text-yellow-500 flex-shrink-0" size={16} />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
            {payments.filter(p => p.status === 'pendente').length}
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-600 leading-tight">Aprovados</span>
            <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
            {payments.filter(p => p.status === 'aprovado').length}
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-600 leading-tight">Rejeitados</span>
            <XCircle className="text-red-500 flex-shrink-0" size={16} />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
            {payments.filter(p => p.status === 'rejeitado').length}
          </p>
        </div>
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elit-orange"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 mb-4">Nenhum pagamento registrado</p>
            <button
              onClick={() => setShowNewPaymentModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <CreditCard size={20} className="mr-2" />
              Fazer Primeiro Pagamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabela Desktop */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mês Referência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(payment.mes_referencia + '-01').toLocaleDateString('pt-BR', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {parseFloat(payment.valor).toFixed(2)} AOA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 capitalize">
                        {payment.metodo_pagamento || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.data_pagamento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowDetailsModal(true)
                          }}
                          className="p-2 text-elit-orange hover:bg-orange-50 rounded-lg transition"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        {payment.status === 'pendente' && (
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition hover:text-red-700"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4 p-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(payment.mes_referencia + '-01').toLocaleDateString('pt-BR', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payment.data_pagamento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Valor:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {parseFloat(payment.valor).toFixed(2)} AOA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Método:</span>
                      <span className="text-sm text-gray-700 capitalize">
                        {payment.metodo_pagamento || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowDetailsModal(true)
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-elit-orange to-elit-gold text-white hover:from-elit-gold hover:to-elit-orange rounded-lg text-sm font-medium transition shadow-sm hover:shadow-md"
                    >
                      <Eye size={16} />
                      Ver Detalhes
                    </button>
                    {payment.status === 'pendente' && (
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition hover:text-red-700"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Pagamento */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-2xl w-full my-4 sm:my-8 max-h-[90vh] overflow-y-auto relative">
            {/* Loading Overlay */}
            {submitting && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg sm:rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-elit-orange mx-auto mb-4"></div>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">Processando Pagamento...</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">Por favor, aguarde</p>
                </div>
              </div>
            )}
            
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 z-10 rounded-t-lg sm:rounded-t-xl">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Novo Pagamento de Cota</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Ano: {new Date().getFullYear()} • 
                {' '}{12 - generateMonthOptions().filter(m => m.disabled).length} meses disponíveis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Valor (AOA) *
                  </label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="input text-sm"
                    placeholder="Ex: 5000.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Mês de Referência *
                  </label>
                  <select
                    name="mes_referencia"
                    value={formData.mes_referencia}
                    onChange={handleInputChange}
                    className="input text-sm"
                    required
                  >
                    <option value="">Selecione o mês</option>
                    {generateMonthOptions().map(option => (
                      <option 
                        key={option.value} 
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Apenas meses do ano atual ({new Date().getFullYear()})
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <select
                  name="metodo_pagamento"
                  value={formData.metodo_pagamento}
                  onChange={handleInputChange}
                  className="input text-sm"
                >
                  <option value="transferencia">Transferência Bancária</option>
                  <option value="deposito">Depósito Bancário</option>
                  <option value="express">Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
                  Comprovante de Pagamento *
                </label>
                
                {/* Seletor de método de upload */}
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 lg:gap-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="file"
                      checked={uploadMethod === 'file'}
                      onChange={(e) => setUploadMethod(e.target.value as 'file' | 'link')}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Enviar Arquivo</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="link"
                      checked={uploadMethod === 'link'}
                      onChange={(e) => setUploadMethod(e.target.value as 'file' | 'link')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Link Externo</span>
                  </label>
                </div>

                {uploadMethod === 'file' ? (
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                            <span className="font-semibold">Clique para enviar</span> ou arraste
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            PNG, JPG, WEBP ou PDF (máx. 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {comprovanteFile && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Upload size={16} className="text-green-600" />
                          <span className="text-sm text-green-700">{comprovanteFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setComprovanteFile(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      name="comprovante_url"
                      value={formData.comprovante_url}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Cole o link do comprovante (Google Drive, Dropbox, etc.)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cole o link de um arquivo hospedado no Google Drive ou outro serviço
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewPaymentModal(false)}
                  className="btn btn-secondary text-sm"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm relative"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processando...
                    </>
                  ) : (
                    'Submeter Pagamento'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-2xl w-full my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 z-10 rounded-t-lg sm:rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Detalhes do Pagamento</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                >
                  <XCircle size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Mês de Referência</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {new Date(selectedPayment.mes_referencia + '-01').toLocaleDateString('pt-BR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Valor</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {parseFloat(selectedPayment.valor).toFixed(2)} AOA
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Método de Pagamento</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 capitalize">
                    {selectedPayment.metodo_pagamento || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Data do Pagamento</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {new Date(selectedPayment.data_pagamento).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {selectedPayment.comprovante_url && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Comprovante</p>
                  {selectedPayment.comprovante_url.startsWith('/uploads/') ? (
                    // Arquivo local - criar link absoluto
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${selectedPayment.comprovante_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-elit-orange to-elit-gold text-white hover:from-elit-gold hover:to-elit-orange rounded-lg transition text-sm shadow-sm hover:shadow-md"
                    >
                      <Eye size={16} />
                      Ver Comprovante
                    </a>
                  ) : (
                    // Link externo
                    <a
                      href={selectedPayment.comprovante_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-elit-orange to-elit-gold text-white hover:from-elit-gold hover:to-elit-orange rounded-lg transition text-sm shadow-sm hover:shadow-md"
                    >
                      <Upload size={16} />
                      Ver Comprovante
                    </a>
                  )}
                </div>
              )}

              {selectedPayment.observacoes && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Observações</p>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{selectedPayment.observacoes}</p>
                </div>
              )}

              {selectedPayment.data_aprovacao && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Data de Aprovação/Rejeição</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {new Date(selectedPayment.data_aprovacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {selectedPayment.motivo_rejeicao && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-red-700 mb-1">Motivo da Rejeição</p>
                  <p className="text-sm sm:text-base text-red-600 break-words">{selectedPayment.motivo_rejeicao}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white p-3 sm:p-4 lg:p-6 border-t border-gray-200 flex items-center justify-end rounded-b-lg sm:rounded-b-xl">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary text-sm w-full sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 transition-all duration-300">
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl border-2 min-w-full sm:min-w-[300px] ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-900' 
              : 'bg-red-50 border-red-500 text-red-900'
          }`}>
            <div className={`flex-shrink-0 ${
              toast.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle size={20} className="sm:w-6 sm:h-6" />
              ) : (
                <XCircle size={20} className="sm:w-6 sm:h-6" />
              )}
            </div>
            <p className="font-medium text-sm sm:text-base">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuotasPage
