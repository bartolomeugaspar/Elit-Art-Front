import { Facebook, Instagram, Youtube, Linkedin, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="pt-8 sm:pt-12 pb-16 sm:pb-20 bg-gray-900 text-white w-full min-h-fit block -mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo e Descrição */}
          <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4 sm:mb-6">
              <img 
                src="/icon.jpeg" 
                alt="Elit'Arte Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg"
              />
              <span className="text-2xl sm:text-3xl font-bold">Elit'Arte</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-w-md mx-auto sm:mx-0">
              Movimento Artístico dedicado à preservacção e celebracção da rica cultura angolana, 
              conectando tradições ancestrais com expressões contemporâneas.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-elit-red rounded-full flex items-center justify-center hover:bg-elit-red/80 transition-colors cursor-pointer">
                <span className="text-xs sm:text-sm font-bold">f</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-elit-yellow rounded-full flex items-center justify-center hover:bg-elit-yellow/80 transition-colors cursor-pointer">
                <span className="text-xs sm:text-sm font-bold">@</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-elit-orange rounded-full flex items-center justify-center hover:bg-elit-orange/80 transition-colors cursor-pointer">
                <span className="text-xs sm:text-sm font-bold">in</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Navegacção</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-elit-yellow transition-colors text-sm sm:text-base">Home</a></li>
              <li><a href="#sobre" className="text-gray-300 hover:text-elit-yellow transition-colors text-sm sm:text-base">Sobre Nós</a></li>
              <li><a href="#areas" className="text-gray-300 hover:text-elit-yellow transition-colors text-sm sm:text-base">Áreas de actuação</a></li>
              <li><a href="#galeria" className="text-gray-300 hover:text-elit-yellow transition-colors text-sm sm:text-base">Galeria</a></li>
              <li><a href="#equipa" className="text-gray-300 hover:text-elit-yellow transition-colors text-sm sm:text-base">Equipa</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contato</h3>
            <div className="space-y-2 sm:space-y-3 text-gray-300">
              <p className="flex items-center justify-center sm:justify-start text-sm sm:text-base">
                <span className="text-elit-orange mr-2">📍</span>
                Luanda, Angola
              </p>
              <p className="flex items-start justify-center sm:justify-start text-sm sm:text-base">
                <span className="text-elit-yellow mr-2 mt-0.5">✉️</span>
                <span className="break-all">elitarte39@gmail.com</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start text-sm sm:text-base">
                <span className="text-elit-red mr-2">📱</span>
                +244 923 456 789
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 Elit'Arte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
