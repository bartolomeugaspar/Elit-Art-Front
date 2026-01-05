import { Target, Eye, Heart, Users, Lightbulb, Crown, Star } from 'lucide-react'

export default function IdentitySection() {
  return (
    <section id="identidade" className="py-20 bg-gradient-to-br from-elit-light to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Frase-mestra */}
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl font-light text-elit-gold italic mb-8">
              "Celebramos o que somos ao criar o que podemos ser."
            </p>
          </div>

          {/* Missão, Visão, Linha Orientadora */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Missão */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-elit-red rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-elit-dark">Missão</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Promover a Arte nas suas múltiplas expressões (teatro, dança, música, pintura, cinema e literatura) 
                como ferramentas de transformação da nossa sociedade e de desenvolvimento dos angolanos, 
                marcadamente com traços da nossa cultura angolana tradicional.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-elit-yellow rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-elit-dark">Visão</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ser reconhecido como o maior movimento Artístico de Angola, em inovaçãoArtística, 
                inspirando gerações e transformando vidas por meio da Arte.
              </p>
            </div>

            {/* Linha Orientadora */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-elit-orange rounded-full flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-elit-dark">Linha Orientadora</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A Nossa linha orientadora está voltada para a produção de conteúdos Artísticos de vanguarda, 
                focados, unicamente, nos hábitos, costumes, vivências, indumentária, linguagem do angolano.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-elit-dark mb-4">Nossos Valores</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-elit-red to-elit-orange mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Liderança */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Liderança</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Todo Elit'Arteano dentro do movimento deve ter uma mentalidade de líder, 
                  sem depender do seu director ou coordenador para agir em prol do Elit'Arte.
                </p>
              </div>

              {/* Humanismo */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Humanismo</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  O ser humano deve ser o centro das nossas intenções e não o dinheiro.
                </p>
              </div>

              {/* Tradicionalismo */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Tradicionalismo</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Toda a produção preserva e promove as raízes angolanas.
                </p>
              </div>

              {/* Transcendência */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-brown rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Transcendência</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  O que produzimos deve ser do interesse da nossa gente e não nosso.
                </p>
              </div>

              {/* Espírito de Família */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Espírito de Família</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Todo mundo deve ver no outro o seu irmão.
                </p>
              </div>

              {/* Excelência */}
              <div className="text-center">
                <div className="w-16 h-16 bg-elit-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-3">Excelência</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Buscamos sempre a perfeição em cada obra e apresentaçãoArtística.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
