import { GraduationCap, BookOpen, Music2, Calculator, Languages, PalmtreeIcon } from 'lucide-react'

export default function ServicesSection() {
  return (
    <section id="servicos" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-elit-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-dark mb-4 sm:mb-6 px-2">
            Nossos <span className="text-elit-orange">Serviços</span> Educacionais
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Além da promoção artística e cultural, oferecemos serviços educacionais para o desenvolvimento 
            académico e artístico da comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Preparatório para Ensino Médio e Superior */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-elit-red to-elit-orange p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center px-2">
                Preparatório Académico
              </h3>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed mb-6 text-center text-base sm:text-lg">
                Preparação especializada para o ingresso no ensino médio e superior
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-elit-red/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-elit-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-elit-dark text-base sm:text-lg mb-2">Língua Portuguesa</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Gramática, interpretação de textos, redação e literatura para preparação completa
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-elit-orange/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-elit-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-elit-dark text-base sm:text-lg mb-2">Matemática</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Álgebra, geometria, trigonometria e resolução de problemas
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                  <strong className="text-elit-red">Destinado a:</strong> Estudantes que desejam ingressar no ensino médio e superior
                </p>
              </div>
            </div>
          </div>

          {/* Plano de Aulas nas Férias */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-elit-yellow to-elit-gold p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <PalmtreeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center px-2">
                Plano de Aulas nas Férias
              </h3>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed mb-6 text-center text-base sm:text-lg">
                Aproveitamento das férias com aprendizado e desenvolvimento de talentos
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-elit-brown/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-elit-brown" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-elit-dark text-base sm:text-lg mb-2">Disciplinas Académicas</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Língua Portuguesa e Matemática com metodologia dinâmica e envolvente
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-elit-gold/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-elit-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-elit-dark text-base sm:text-lg mb-2">Educação Artística</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Aulas de guitarra e piano para desenvolvimento musical
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                  <strong className="text-elit-brown">Destinado a:</strong> Alunos do I ciclo e ensino médio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 px-4">
          <div className="bg-gradient-to-r from-elit-red via-elit-orange to-elit-yellow rounded-2xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto shadow-xl text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
              Interessado nos nossos serviços educacionais?
            </h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 px-2">
              Entre em contacto connosco para mais informações sobre horários, valores e inscrições.
            </p>
            <a 
              href="#contacto" 
              className="inline-block bg-white text-elit-red font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full hover:bg-elit-light transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Fale Connosco
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
