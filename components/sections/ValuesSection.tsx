import { Crown, Heart, TreePine, Lightbulb, Users } from 'lucide-react'

export default function ValuesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Valores</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Princípios que guiam nossa missão de preservar e celebrar a cultura angolana
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Liderança */}
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Liderança</h3>
            <p className="text-gray-600 text-sm">Inspiramos mudanças positivas através da arte</p>
          </div>

          {/* Humanismo */}
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Humanismo</h3>
            <p className="text-gray-600 text-sm">Valorizamos a dignidade e expressão humana</p>
          </div>

          {/* Tradicionalismo */}
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TreePine className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tradicionalismo</h3>
            <p className="text-gray-600 text-sm">Preservamos as raízes culturais angolanas</p>
          </div>

          {/* Transcendência */}
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Transcendência</h3>
            <p className="text-gray-600 text-sm">Elevamos a arte além das fronteiras</p>
          </div>

          {/* Espírito de Família */}
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Espírito de Família</h3>
            <p className="text-gray-600 text-sm">Cultivamos união e colaboração</p>
          </div>
        </div>
      </div>
    </section>
  )
}
