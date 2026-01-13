'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Palette,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout: logoutFromAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logoutFromAuth();
    }, 1000);
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'artista') && !isLoggingOut) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoggingOut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'artista') {
    return null;
  }

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/artist',
      icon: LayoutDashboard,
    },
    {
      label: 'Meu Perfil',
      href: '/artist/profile',
      icon: User,
    },
    {
      label: 'Minhas Quotas',
      href: '/artist/quotas',
      icon: CreditCard,
    },
    {
      label: 'Minhas Obras',
      href: '/artist/obras',
      icon: Palette,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 text-slate-900 transition-all duration-300 flex flex-col shadow-sm fixed lg:relative left-0 top-0 h-screen z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2 lg:gap-3">
              <img 
                src="/icon.jpeg" 
                alt="Elit'Arte" 
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg object-cover"
              />
              <h1 className="text-base lg:text-lg font-bold text-slate-900">
                Elit'Arte
              </h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition duration-200 text-slate-600 lg:block hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 lg:py-4 px-2 lg:px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'} />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-sm lg:text-base">{item.label}</span>
                        {isActive && <ChevronRight size={16} className="text-blue-600" />}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        {sidebarOpen && (
          <div className="p-3 lg:p-4 border-t border-slate-200">
            <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-slate-50">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-blue-200 shadow-md"
                />
              ) : (
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs lg:text-sm shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">Artista</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile/tablet */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 sm:p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:hidden"
              >
                <Menu size={20} />
              </button>
              
              {/* Título visível em mobile */}
              <h1 className="text-sm sm:text-base font-bold text-gray-900 lg:hidden truncate">
                {menuItems.find((item) => item.href === pathname)?.label}
              </h1>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                    {menuItems.find((item) => item.href === pathname)?.label}
                  </h1>
                  <div className="h-5 w-px bg-gray-200 hidden xl:block"></div>
                  <div className="hidden xl:flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">
                      {new Date().toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      }).replace(' de ', ' ')}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">
                      {new Date().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-blue-200 shadow-md"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs lg:text-sm shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">Artista</p>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      href="/artist/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User size={16} />
                      Meu Perfil
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
