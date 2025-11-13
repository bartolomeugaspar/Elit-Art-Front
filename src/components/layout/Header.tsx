'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/icon.jpeg" 
              alt="Elit'Arte Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
            <span className="text-2xl font-bold text-elit-dark">Elit'Arte</span>
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
              <a href="#home" className="text-elit-dark hover:text-elit-red transition-colors">Home</a>
              <a href="#sobre" className="text-elit-dark hover:text-elit-red transition-colors">Sobre Nós</a>
              <a href="#areas" className="text-elit-dark hover:text-elit-red transition-colors">Áreas de Atuação</a>
              <a href="#projetos" className="text-elit-dark hover:text-elit-red transition-colors">Projetos</a>
              <a href="#equipa" className="text-elit-dark hover:text-elit-red transition-colors">Equipa</a>
              <a href="#contato" className="text-elit-dark hover:text-elit-red transition-colors">Contato</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
