'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-elit-red to-elit-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold text-elit-dark">Elit'arte</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-elit-dark hover:text-elit-red transition-colors">Home</a>
            <a href="#sobre" className="text-elit-dark hover:text-elit-red transition-colors">Sobre Nós</a>
            <a href="#areas" className="text-elit-dark hover:text-elit-red transition-colors">Áreas de Atuação</a>
            <a href="#projetos" className="text-elit-dark hover:text-elit-red transition-colors">Projetos</a>
            <a href="#equipa" className="text-elit-dark hover:text-elit-red transition-colors">Equipa</a>
            <a href="#contato" className="text-elit-dark hover:text-elit-red transition-colors">Contato</a>
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
  )
}
