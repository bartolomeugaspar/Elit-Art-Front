import { Camera, Play, Image as ImageIcon } from 'lucide-react'

export default function GallerySection() {
  const galleryItems = [
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.47 (1).jpeg',
      alt: 'Fundadores do Elit\'Arte',
      category: 'Fundação'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.48.jpeg',
      alt: 'Membros fundadores',
      category: 'Equipa'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.49.jpeg',
      alt: 'Teatro Elit\'Arte',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.39.49 (1).jpeg',
      alt: 'Teatro Elit\'Arte',
      category: 'Teatro'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.21.jpeg',
      alt: 'Música Elit\'Arte',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 16.44.22.jpeg',
      alt: 'Música Elit\'Arte',
      category: 'Música'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.02.51.jpeg',
      alt: 'Pintura Elit\'Arte',
      category: 'Pintura'
    },
    {
      type: 'image',
      src: '/WhatsApp Image 2025-11-13 at 17.02.52.jpeg',
      alt: 'Pintura Elit\'Arte',
      category: 'Pintura'
    }
  ]

  const categories = ['Todos', 'Fundação', 'Teatro', 'Música', 'Pintura', 'Equipa']

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
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-full border border-elit-yellow text-elit-yellow hover:bg-elit-yellow hover:text-elit-dark transition-colors"
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
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <Play className="w-16 h-16 text-elit-yellow" />
              </div>
              <h4 className="text-xl font-bold mb-2">Espetáculo "Octhali"</h4>
              <p className="text-elit-light text-sm">O quanto custa a tua humanidade - 27 de setembro</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <Play className="w-16 h-16 text-elit-yellow" />
              </div>
              <h4 className="text-xl font-bold mb-2">"O preço da ingratidão"</h4>
              <p className="text-elit-light text-sm">Apresentação no LAASP - 27 de Dezembro</p>
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
            <div className="bg-elit-green/10 p-6 rounded-xl">
              <Play className="w-12 h-12 text-elit-green mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Apresentações</h4>
              <p className="text-elit-light">Os momentos mais marcantes no palco</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
