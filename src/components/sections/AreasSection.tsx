import { Theater, Music, Palette, BookOpen, Film, Users, Lightbulb, Play, TreePine, Zap } from 'lucide-react'

export default function AreasSection() {
  return (
    <section id="areas" className="py-20 bg-gradient-to-br from-elit-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-orange italic mb-8">
            "Multiplicamos vozes através da música, dança, literatura e teatro."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-elit-dark mb-6">
            Áreas de <span className="text-elit-red">Atuação</span>
          </h2>
        </div>

        {/* Teatro */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-elit-red rounded-full flex items-center justify-center mr-4">
                  <Theater className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Teatro</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área do teatro do Elit'arte, formada por não mais de 10 actores, procura dramatizar peças teatrais 
                  de vanguarda, com temáticas sociais e culturais com traços marcantes da vivência do angolano.
                </p>
                <div className="mb-4">
                  <h4 className="font-bold text-elit-red mb-2">Espetáculos de Destaque:</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>"Octhali"</strong> - O quanto custa a tua humanidade (27 de setembro, Horizonte NJinga Mbandi)</li>
                    <li>• <strong>"O preço da ingratidão"</strong> (27 de Dezembro, LAASP)</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Produção de espectáculos teatrais clássicos, contemporâneos e infantis; 
                  engajamento comunitário (teatro social nas comunidades); e concursos teatrais.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 16.39.49.jpeg" alt="Teatro Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 16.39.49 (1).jpeg" alt="Teatro Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

        {/* Música */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-elit-yellow rounded-full flex items-center justify-center mr-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Música</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área da música do Elit'arte, formada por não mais de 06 artistas, procura interpretar e produzir 
                  canções angolanas, cujo conteúdo seja de vanguarda e numa fusão de estilos tradicionais com modernos.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Concursos, oficinas de canto, composição musical; instrumentalização; 
                  palestras; produção de espectáculo musical.
                </p>
              </div>
            </div>
            <div className="lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 16.44.21.jpeg" alt="Música Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 16.44.22.jpeg" alt="Música Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

        {/* Dança */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-elit-green rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-8 h-8 text-elit-dark" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Dança</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área da dança do Elit'arte, formada por não mais de 08 artistas, procura produzir estilos 
                  de dança que celebram raízes angolanas, mas com um toque modernista.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Concursos, oficinas de dança; palestras e produção de espectáculo de dança.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 16.44.23.jpeg" alt="Dança Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 16.44.24.jpeg" alt="Dança Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

        {/* Literatura */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-elit-blue rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-8 h-8 text-elit-dark" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Literatura e Poesia</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área da literatura, formada por não mais de 06 artistas, procura produzir textos literários 
                  de vanguarda, nas modalidades do conto e poesia, com presença vincada dos nossos hábitos e costumes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Bibliotecas de rua; alfabetização; oficinas literárias; concursos de redacção.
                </p>
              </div>
            </div>
            <div className="lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 16.55.22.jpeg" alt="Literatura Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 16.55.36.jpeg" alt="Literatura Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

        {/* Cinema */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-elit-orange rounded-full flex items-center justify-center mr-4">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Cinema</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área do cinema do Elit'arte, formada por não mais de 10 integrantes, produz conteúdo audiovisual 
                  com programas de debate sobre obras literárias angolanas.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Documentários; filmes de curta-metragem e vídeos de sensibilização social.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 16.55.57.jpeg" alt="Cinema Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 17.02.52 (1).jpeg" alt="Cinema Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

        {/* Pintura */}
        <div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-elit-red to-elit-orange rounded-full flex items-center justify-center mr-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-elit-dark">Pintura</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A área de pintura do Elit'arte, formada por 06 artistas, procura produzir obras que retratam 
                  a identidade e a alma do povo angolano.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Linha de ação:</strong> Oficinas de pinturas nas ruas, escolas, parques e eventos culturais.
                </p>
              </div>
            </div>
            <div className="lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img src="/WhatsApp Image 2025-11-13 at 17.02.51.jpeg" alt="Pintura Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
              <img src="/WhatsApp Image 2025-11-13 at 17.02.52.jpeg" alt="Pintura Elit'Arte" className="w-full h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
