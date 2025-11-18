import { Lightbulb, TreePine } from 'lucide-react'

export default function ProjectsSection() {
  return (
    <section id="projetos" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Projetos em Destaque</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Iniciativas que marcaram nossa jornadaArtística e cultural
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Páginas Ambulantes */}
          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="h-64 bg-gradient-to-br from-red-400 to-yellow-400 flex items-center justify-center">
              <div className="text-center text-white">
                <Lightbulb className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Páginas Ambulantes</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 leading-relaxed mb-6">
                Projeto literário itinerante que leva a literatura angolana às comunidades, 
                promovendo o acesso à cultura e incentivando novos talentos literários.
              </p>
              <button className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Saber mais →
              </button>
            </div>
          </div>

          {/* Pincel Artístico */}
          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="h-64 bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
              <div className="text-center text-white">
                <TreePine className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Pincel Artístico</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 leading-relaxed mb-6">
                Oficinas de Artes visuais que conectam Artistas emergentes com mestres tradicionais, 
                preservando técnicas ancestrais através da expressão contemporânea.
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Saber mais →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
