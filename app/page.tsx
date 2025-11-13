'use client'

import { Menu, X, Play, Users, Heart, Lightbulb, TreePine, Crown } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      {/* Header Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">Elit'arte</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors">Home</a>
              <a href="#sobre" className="text-gray-700 hover:text-red-600 transition-colors">Sobre Nós</a>
              <a href="#areas" className="text-gray-700 hover:text-red-600 transition-colors">Áreas de Atuação</a>
              <a href="#projetos" className="text-gray-700 hover:text-red-600 transition-colors">Projetos</a>
              <a href="#equipa" className="text-gray-700 hover:text-red-600 transition-colors">Equipa</a>
              <a href="#contato" className="text-gray-700 hover:text-red-600 transition-colors">Contato</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors">Home</a>
                <a href="#sobre" className="text-gray-700 hover:text-red-600 transition-colors">Sobre Nós</a>
                <a href="#areas" className="text-gray-700 hover:text-red-600 transition-colors">Áreas de Atuação</a>
                <a href="#projetos" className="text-gray-700 hover:text-red-600 transition-colors">Projetos</a>
                <a href="#equipa" className="text-gray-700 hover:text-red-600 transition-colors">Equipa</a>
                <a href="#contato" className="text-gray-700 hover:text-red-600 transition-colors">Contato</a>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-red-600">Elit</span>
              <span className="text-yellow-500">'</span>
              <span className="text-green-600">arte</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Movimento artístico que celebra e preserva a rica cultura angolana através da fusão harmoniosa entre tradição e contemporaneidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                Descobrir Arte
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-all">
                Ver Projetos
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Áreas Artísticas */}
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

      {/* Projetos Destacados */}
      <section id="projetos" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Projetos em Destaque</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Iniciativas que marcaram nossa jornada artística e cultural
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
                  Oficinas de artes visuais que conectam artistas emergentes com mestres tradicionais, 
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

      {/* Valores e Missão */}
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

      {/* Footer */}
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
    </div>
  )
}
