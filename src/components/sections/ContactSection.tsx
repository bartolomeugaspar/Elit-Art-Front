import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "faustinodomingos83@hotmail.com",
      description: "Para comunicação formal"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "+244 927 935 543",
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

  const socialMedia = [
    {
      icon: Facebook,
      name: "Facebook",
      handle: "@ElitArteAngola",
      color: "bg-blue-600"
    },
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@elit_arte_angola",
      color: "bg-pink-600"
    },
    {
      icon: Youtube,
      name: "YouTube",
      handle: "Elit'Arte Angola",
      color: "bg-red-600"
    }
  ]

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-elit-dark to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-yellow italic mb-8">
            "Junte-se ao Movimento artístico que vai mudar Angola."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Contacto e <span className="text-elit-red">Redes Sociais</span>
          </h2>
          <p className="text-xl text-elit-light">
            Apoie o Elit'arte e partilhe a nossa paixão pela arte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Entre em Contacto</h3>
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-elit-red rounded-full flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-elit-yellow">{contact.title}</h4>
                    <p className="text-white text-lg">{contact.value}</p>
                    <p className="text-elit-light text-sm">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Envie uma Mensagem</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-elit-yellow font-medium mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2">Assunto</label>
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-elit-yellow focus:outline-none">
                  <option value="">Selecione um assunto</option>
                  <option value="parceria">Parceria</option>
                  <option value="financiamento">Financiamento</option>
                  <option value="participacao">Participação</option>
                  <option value="informacoes">Informações Gerais</option>
                </select>
              </div>
              <div>
                <label className="block text-elit-yellow font-medium mb-2">Mensagem</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-elit-yellow focus:outline-none resize-none"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-elit-red to-elit-yellow text-white font-bold py-3 px-6 rounded-lg hover:from-elit-yellow hover:to-elit-red transition-all transform hover:scale-105"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-8">Siga-nos nas Redes Sociais</h3>
          <div className="flex justify-center space-x-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href="#"
                className={`${social.color} p-4 rounded-full hover:scale-110 transition-transform group`}
              >
                <social.icon className="w-8 h-8 text-white" />
              </a>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            {socialMedia.map((social, index) => (
              <p key={index} className="text-elit-light">
                <span className="text-elit-yellow font-medium">{social.name}:</span> {social.handle}
              </p>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-elit-red via-elit-yellow to-elit-green p-8 rounded-2xl text-center">
          <h3 className="text-3xl font-bold mb-4">Junte-se a Nós!</h3>
          <p className="text-xl mb-6">
            Faça parte desta jornada de transformação cultural. Apoie o Elit'arte!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-elit-red px-8 py-3 rounded-full font-bold hover:bg-elit-light transition-colors">
              Torne-se Membro
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-elit-red transition-colors">
              Seja Nosso Parceiro
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <p className="text-elit-light">
            © 2024 Elit'Arte - Movimento Artístico Cultural de Angola
          </p>
          <p className="text-elit-yellow font-medium mt-2">
            "A arte é a nossa linguagem universal; a cultura, a nossa assinatura."
          </p>
        </div>
      </div>
    </section>
  )
}
