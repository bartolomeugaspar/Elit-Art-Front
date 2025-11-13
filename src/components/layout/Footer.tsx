export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/icon.jpeg" 
                alt="Elit'Arte Logo" 
                className="w-14 h-14 rounded-full object-cover shadow-lg"
              />
              <span className="text-3xl font-bold">Elit'Arte</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Movimento artístico dedicado à preservação e celebração da rica cultura angolana, 
              conectando tradições ancestrais com expressões contemporâneas.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-elit-red rounded-full flex items-center justify-center hover:bg-elit-red/80 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-elit-yellow rounded-full flex items-center justify-center hover:bg-elit-yellow/80 transition-colors cursor-pointer">
                <span className="text-sm font-bold">@</span>
              </div>
              <div className="w-10 h-10 bg-elit-orange rounded-full flex items-center justify-center hover:bg-elit-orange/80 transition-colors cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#sobre" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#areas" className="text-gray-300 hover:text-white transition-colors">Áreas de Atuação</a></li>
              <li><a href="#projetos" className="text-gray-300 hover:text-white transition-colors">Projetos</a></li>
              <li><a href="#equipa" className="text-gray-300 hover:text-white transition-colors">Equipa</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contato</h3>
            <div className="space-y-3 text-gray-300">
              <p>Luanda, Angola</p>
              <p>info@elitarte.ao</p>
              <p>+244 900 000 000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Elit'arte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
