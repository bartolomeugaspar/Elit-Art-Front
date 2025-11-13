export default function HeroSection() {
  return (
    <section id="home" className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-elit-red">Elit</span>
            <span className="text-elit-yellow">'</span>
            <span className="text-elit-green">Arte</span>
          </h1>
          <p className="text-xl md:text-2xl text-elit-dark mb-8 leading-relaxed">
            Movimento artístico que celebra e preserva a rica cultura angolana através da fusão harmoniosa entre tradição e contemporaneidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-elit-red to-elit-orange text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105">
              Descobrir Arte
            </button>
            <button className="border-2 border-elit-green text-elit-green px-8 py-4 rounded-full font-semibold hover:bg-elit-green hover:text-white transition-all">
              Ver Projetos
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-elit-red/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-elit-yellow/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-elit-green/20 rounded-full animate-pulse delay-500"></div>
    </section>
  )
}
