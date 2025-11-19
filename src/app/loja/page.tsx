import { Header, Footer } from '@/components'
import { Zap } from 'lucide-react'

export default function LojaDigitalPage() {
  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4">
              🛍️ Loja Digital Elit'Arte
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">
              Livros, Revistas, Ingressos e Merchandising
            </p>
          </div>
        </div>
      </section>

      {/* Development Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elit-orange/20 mb-6">
              <Zap className="text-elit-orange" size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-elit-dark mb-4">
              Em Desenvolvimento
            </h2>
            
            <p className="text-lg text-elit-dark/70 mb-8">
              Estamos trabalhando para trazer uma experiência de compra incrível para você. 
              Em breve, você poderá adquirir livros, revistas, ingressos e produtos exclusivos 
              da Elit'Arte diretamente aqui.
            </p>
            
            <div className="bg-elit-orange/10 border border-elit-orange/30 rounded-lg p-6 md:p-8">
              <p className="text-elit-dark/80">
                ✨ Fique atento! Em breve teremos uma loja completa com produtos incríveis.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
