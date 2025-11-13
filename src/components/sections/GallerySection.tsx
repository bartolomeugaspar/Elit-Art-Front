import { Camera, Play, Image as ImageIcon } from 'lucide-react'

export default function GallerySection() {
  const galleryItems = [
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.48 (1).jpeg',
      alt: 'Momentos únicos do Elit\'Arte',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.48 (2).jpeg',
      alt: 'Comunidade artística unida',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.49 (2).jpeg',
      alt: 'Expressão teatral autêntica',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.50 (1).jpeg',
      alt: 'Arte em movimento',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.50 (3).jpeg',
      alt: 'Talento em ação',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.51 (1).jpeg',
      alt: 'Ritmos angolanos',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.51 (2).jpeg',
      alt: 'Música tradicional',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.21 (1).jpeg',
      alt: 'Dança contemporânea',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.22 (1).jpeg',
      alt: 'Expressão musical',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.23 (1).jpeg',
      alt: 'Arte visual contemporânea',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.24 (1).jpeg',
      alt: 'Criação artística',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.02.52 (2).jpeg',
      alt: 'Produção audiovisual',
      category: 'Cinema'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.21 (1).jpeg',
      alt: 'Bastidores do cinema',
      category: 'Cinema'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.21 (2).jpeg',
      alt: 'Equipa criativa',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.22 (1).jpeg',
      alt: 'Colaboração artística',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.22 (2).jpeg',
      alt: 'Trabalho em equipa',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.24 (1).jpeg',
      alt: 'Momentos especiais',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.25 (1).jpeg',
      alt: 'História do movimento',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.25 (2).jpeg',
      alt: 'Legado cultural',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.26.jpeg',
      alt: 'Tradição preservada',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/S.jpeg',
      alt: 'Arte contemporânea',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/Sem título.jpeg',
      alt: 'Criação visual',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/Sem.jpeg',
      alt: 'Expressão artística',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/tes.jpeg',
      alt: 'Talento emergente',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.45.jpeg',
      alt: 'Momentos artísticos únicos',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.47 (1).jpeg',
      alt: 'Expressão cultural angolana',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.47.jpeg',
      alt: 'Performance teatral',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.48.jpeg',
      alt: 'Arte em movimento',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.50.jpeg',
      alt: 'Criatividade sem limites',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.51.jpeg',
      alt: 'Música tradicional',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.20.jpeg',
      alt: 'Bastidores cinematográficos',
      category: 'Cinema'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.21.jpeg',
      alt: 'Produção audiovisual',
      category: 'Cinema'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.22.jpeg',
      alt: 'Trabalho colaborativo',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.24 (1).jpeg',
      alt: 'Momentos especiais da fundação',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.25 (1).jpeg',
      alt: 'História do movimento',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.41.25 (2).jpeg',
      alt: 'Legado cultural preservado',
      category: 'Fundação'
    }
  ]

  const categories = ['Todos', 'Fundação', 'Teatro', 'Música', 'Pintura', 'Literatura', 'Cinema', 'Equipa']

  return (
    <section id="galeria" className="py-20 bg-gradient-to-br from-elit-dark to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-yellow italic mb-8">
            "Reviva os momentos que moldaram nossa jornada."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Galeria de <span className="text-elit-red">Imagens</span> e Vídeos
          </h2>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-3 sm:px-6 py-2 text-sm sm:text-base rounded-full border border-elit-yellow text-elit-yellow hover:bg-elit-yellow hover:text-elit-dark transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl bg-gray-800 aspect-square">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-elit-red text-white text-sm rounded-full mb-2">
                    {item.category}
                  </span>
                  <p className="text-white text-sm">{item.alt}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === 'video' ? (
                  <Play className="w-8 h-8 text-white" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Video Highlights Section */}
        <div className="bg-gradient-to-r from-elit-red/20 to-elit-yellow/20 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Vídeos em Destaque</h3>
            <p className="text-elit-light">Assista aos nossos momentos mais marcantes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-full h-48 sm:h-56 rounded-lg mb-4 overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  poster="/WhatsApp Image 2025-11-13 at 17.41.23 (2).jpeg"
                >
                  <source src="/otchale.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">Espetáculo "Octhali"</h4>
              <p className="text-elit-light text-sm">O quanto custa a tua humanidade - 27 de setembro</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-full h-48 sm:h-56 rounded-lg mb-4 overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  poster="/WhatsApp Image 2025-11-13 at 17.41.23 (2).jpeg"
                >
                  <source src="/ter.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">"O preço da ingratidão"</h4>
              <p className="text-elit-light text-sm">Apresentação no LAASP - 27 de Dezembro</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-full h-48 sm:h-56 rounded-lg mb-4 overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  poster="/WhatsApp Image 2025-11-13 at 17.41.23 (2).jpeg"
                >
                  <source src="/qw.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">Apresentação Especial</h4>
              <p className="text-elit-light text-sm">Momento artístico do Elit'Arte</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-full h-48 sm:h-56 rounded-lg mb-4 overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  poster="/WhatsApp Image 2025-11-13 at 17.41.23 (2).jpeg"
                >
                  <source src="/res.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">Performance Artística</h4>
              <p className="text-elit-light text-sm">Expressão cultural angolana</p>
            </div>
          </div>
        </div>

        {/* Behind the Scenes */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-8">Bastidores e Ensaios</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-elit-red/10 p-6 rounded-xl">
              <Camera className="w-12 h-12 text-elit-red mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Ensaios</h4>
              <p className="text-elit-light">Momentos de preparação e dedicação</p>
            </div>
            <div className="bg-elit-yellow/10 p-6 rounded-xl">
              <ImageIcon className="w-12 h-12 text-elit-yellow mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Bastidores</h4>
              <p className="text-elit-light">A magia por trás dos espetáculos</p>
            </div>
            <div className="bg-elit-orange/10 p-6 rounded-xl">
              <Play className="w-12 h-12 text-elit-orange mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Apresentações</h4>
              <p className="text-elit-light">Os momentos mais marcantes no palco</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
