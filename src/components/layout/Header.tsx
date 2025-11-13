'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Áreas de Atuação', href: '#areas' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Equipa', href: '#equipa' }
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    
    // Remove # from href to get the element ID
    const elementId = href.replace('#', '')
    const element = document.getElementById(elementId)
    
    console.log('Navigating to:', elementId, 'Element found:', !!element)
    
    if (element) {
      // Calculate offset for fixed header (approximately 80px)
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      console.error('Element not found:', elementId)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg py-3">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('#home')}
          >
            <img 
              src="/icon.jpeg" 
              alt="Elit'Arte" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Elit'Arte
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-gray-700 hover:text-elit-red transition-all duration-300 hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick('#contacto')}
              className="bg-elit-red hover:bg-elit-red/90 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Contactar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-900 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNavClick('#contacto')}
                  className="w-full bg-elit-red hover:bg-elit-red/90 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
