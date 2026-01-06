'use client'

import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationBell from '../NotificationBell'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // Verificar se usuário é admin
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    // Tentar obter do localStorage primeiro
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsAdmin(userData.role === 'admin')
        return
      } catch (error) {
        // Continuar para decodificar o token
      }
    }
    
    // Se não tiver user mas tiver token, decodificar
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const tokenData = JSON.parse(jsonPayload)
        setIsAdmin(tokenData.role === 'admin' || tokenData.userRole === 'admin')
      } catch (error) {
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }, [])

  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Áreas de actuação', href: '#areas' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Artistas', href: '#equipa' },
    { label: 'Eventos', href: '/eventos' }
  ]

  const moreItems = [
    { label: 'Loja', href: '/loja' },
    { label: 'Revista Elit', href: '/blog' },
    { label: 'Comunidade', href: '/comunidade' }
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
    
    // Check if it's an anchor link
    if (href.startsWith('#')) {
      // Only scroll if we're on the home page
      if (pathname === '/') {
        const elementId = href.replace('#', '')
        const element = document.getElementById(elementId)
        
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      } else {
        // If not on home page, navigate to home with anchor
        window.location.href = `/${href}`
      }
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
          <nav className="hidden md:flex items-center space-x-8 relative">
            {navigationItems.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-elit-red transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm font-medium text-gray-700 hover:text-elit-red transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="relative inline-block">
              <button
                className="text-sm font-medium text-gray-700 hover:text-elit-red transition-all duration-300 hover:scale-105 flex items-center gap-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Mais
                <ChevronDown size={16} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-(-1) bg-white shadow-lg p-4 w-42 rounded-lg z-10 mt-4">
                  {moreItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && isAdminRoute && <NotificationBell />}
            <button
              onClick={() => window.location.href = isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              {isAdmin ? 'Admin' : 'Login'}
            </button>
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
                item.href.startsWith('/') ? (
                  <Link
                    key={index}
                    href={item.href}
                    className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                  >
                    {item.label}
                  </button>
                )
              ))}
              <button
                className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Mais
                <ChevronDown size={16} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="pt-4 space-y-3">
                  {moreItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block w-full text-left text-gray-700 hover:text-elit-red font-medium py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => window.location.href = '/admin/login'}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
                >
                  Login
                </button>
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
