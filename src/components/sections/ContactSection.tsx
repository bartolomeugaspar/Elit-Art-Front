import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

export default function ContactSection() {
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
            "Junte-se ao Movimento Arteístico que vai mudar Angola."
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Contacto e <span className="text-elit-red">Redes Sociais</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-elit-light px-4">
            Apoie o Elit'Arte e pArteilhe a nossa paixão pela Arte.
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
            <form className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Nome</label>
                <input
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none text-sm sm:text-base"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Assunto</label>
                <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-elit-yellow focus:outline-none text-sm sm:text-base">
                  <option value="">Selecione um assunto</option>
                  <option value="parceria">Parceria</option>
                  <option value="financiamento">Financiamento</option>
                  <option value="pArteicipacao">PArteicipacção</option>
                  <option value="informacoes">Informações Gerais</option>
                </select>
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2 text-sm sm:text-base">Mensagem</label>
                <textarea
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none resize-none text-sm sm:text-base"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-elit-red to-elit-yellow text-white font-bold py-3 sm:py-4 px-6 rounded-lg hover:from-elit-yellow hover:to-elit-red transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
