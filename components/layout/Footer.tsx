export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-3xl font-bold">Elit'arte</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Movimento artístico dedicado à preservação e celebração da rica cultura angolana, 
              conectando tradições ancestrais com expressões contemporâneas.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center hover:bg-yellow-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">@</span>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
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
