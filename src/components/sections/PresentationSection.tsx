export default function PresentationSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Frase-mestra */}
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl font-light text-elit-red italic mb-8">
              "Somos o sopro criativo que transforma histórias em emoção."
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div>
              {/* Logo do grupo */}
              <div className="flex items-center mb-8">
                <img 
                  src="/icon.jpeg" 
                  alt="Elit'Arte Logo" 
                  className="w-20 h-20 rounded-full object-cover shadow-lg mr-4"
                />
                <h2 className="text-4xl font-bold text-elit-dark">
                  <span className="text-elit-red">Elit</span>
                  <span className="text-elit-yellow">'</span>
                  <span className="text-elit-brown">Arte</span>
                </h2>
              </div>

              {/* Mensagem de Boas-Vindas */}
              <div className="bg-gradient-to-r from-elit-light to-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-elit-dark mb-6">Mensagem de Boas-Vindas</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Somos o <strong className="text-elit-red">Elit'arte</strong>, um Movimento artístico angolano que une 
                  <span className="text-elit-orange font-semibold"> teatro, música, dança, literatura, pintura e cinema</span>, 
                  com o objectivo de promover e celebrar a nossa rica cultura. 
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  O nosso trabalho visa <span className="text-elit-gold font-semibold">transformar, inspirar e conectar</span> a 
                  sociedade angolana com a arte que junta o tradicional ao contemporâneo.
                </p>
              </div>
            </div>

            {/* Imagem */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/lideres.jpeg" 
                  alt="Elit'Arte em acção" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
              </div>
              
              {/* Elemento decorativo - Símbolo Angolano */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-elit-yellow/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-elit-red/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
