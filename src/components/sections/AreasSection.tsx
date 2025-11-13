import { Play, Users, Heart, Lightbulb, TreePine } from 'lucide-react'

export default function AreasSection() {
  return (
    <section id="areas" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Áreas de Atuação</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exploramos diversas formas de expressão artística, conectando gerações através da arte
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Teatro */}
          <div className="group bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Teatro</h3>
            <p className="text-gray-600 leading-relaxed">
              Narrativas que ecoam as vozes ancestrais e contemporâneas de Angola, trazendo histórias que conectam passado e presente.
            </p>
          </div>

          {/* Música */}
          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Música</h3>
            <p className="text-gray-600 leading-relaxed">
              Ritmos tradicionais angolanos reimaginados com sonoridades contemporâneas, criando pontes entre gerações.
            </p>
          </div>

          {/* Dança */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Dança</h3>
            <p className="text-gray-600 leading-relaxed">
              Movimentos que celebram a identidade cultural angolana, expressando emoções através da linguagem corporal ancestral.
            </p>
          </div>

          {/* Literatura */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Literatura</h3>
            <p className="text-gray-600 leading-relaxed">
              Palavras que carregam a sabedoria ancestral e as aspirações contemporâneas do povo angolano.
            </p>
          </div>

          {/* Cinema */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Cinema</h3>
            <p className="text-gray-600 leading-relaxed">
              Narrativas visuais que documentam e reimaginam a experiência angolana através das lentes contemporâneas.
            </p>
          </div>

          {/* Pintura */}
          <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TreePine className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pintura</h3>
            <p className="text-gray-600 leading-relaxed">
              Cores e formas que capturam a essência da paisagem angolana e a alma do seu povo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
