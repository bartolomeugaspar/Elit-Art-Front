'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotifications } from '@/hooks/useNotifications'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ContactSection() {
  const [loading, setLoading] = useState(false)
  const { addNotification, refreshNotifications } = useNotifications()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || 'Erro ao enviar mensagem'
        throw new Error(errorMessage)
      }

      const result = await response.json()
      toast.success('Mensagem enviada com sucesso! Entraremos em contacto em breve.')
      
      // Adicionar notificação local para admins
      addNotification({
        type: 'contact',
        title: 'Nova Mensagem de Contacto',
        message: `${formData.name}: ${formData.subject}`,
        link: '/admin/newsletter'
      })
      
      // Disparar evento global para atualizar notificações em tempo real
      window.dispatchEvent(new CustomEvent('newContactMessage', {
        detail: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject
        }
      }))
      
      // Atualizar lista de notificações do servidor
      setTimeout(() => {
        refreshNotifications()
      }, 1000)
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error: any) {
      const message = error.message || 'Erro ao enviar mensagem. Tente novamente.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "faustinodomingos83@hotmail.com",
      description: "Para comunicacção formal"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "+244 950 281 335",
      description: "Para ligações diretas"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+244 950 291 335",
      description: "Mensagens rápidas"
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Luanda, Angola",
      description: "Local de ensaios e sede"
    }
  ]
  return (
    <section id="contacto" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-elit-dark to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-elit-yellow italic mb-6 sm:mb-8 px-4">
            "Junte-se ao Movimento Artístico que vai mudar Angola."
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Contacto e <span className="text-elit-red">Redes Sociais</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-elit-light px-4">
            Apoie o Elit'Arte e Partilhe a nossa paixão pela Arte.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center lg:text-left">Entre em Contacto</h3>
            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-stArte space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-elit-red rounded-full flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-elit-yellow">{contact.title}</h4>
                    <p className="text-white text-sm sm:text-base lg:text-lg break-all">{contact.value}</p>
                    <p className="text-elit-light text-xs sm:text-sm">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center lg:text-left">Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                  placeholder="+244 000 000 000"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Assunto *</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Financiamento">Financiamento</option>
                  <option value="Participação">Participação</option>
                  <option value="Informações Gerais">Informações Gerais</option>
                </select>
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Mensagem *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none resize-none text-sm sm:text-base"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-elit-red to-elit-yellow text-white font-bold py-3 sm:py-4 px-6 rounded-lg hover:from-elit-yellow hover:to-elit-red transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
