'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  FileText,
  Palette,
  ShoppingCart,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { useToast, ToastContainer } from './Toast';
import NotificationBell from './NotificationBell';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toasts, showToast, removeToast } = useToast();
  const { user, loading, logout: logoutFromAuth } = useAuth((message) => {
    showToast(message, 'success');
  });
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasNewRegistration, setHasNewRegistration] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
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

  // Buscar inscrições com status "registered" ao montar o componente
  useEffect(() => {
    const fetchRegisteredCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')}/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const registrations = data.registrations || [];
          const registeredCount = registrations.filter((reg: any) => reg.status === 'registered').length;
          setNotificationCount(registeredCount);
        }
      } catch (error) {
      }
    };

    fetchRegisteredCount();
  }, []);

  // Escutar notificações de inscrições
  useEffect(() => {
    const handleNewRegistration = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { name, email, eventTitle } = customEvent.detail;
      
      setHasNewRegistration(true);
      setNotificationCount(prev => {
        const newCount = prev + 1;
        return newCount;
      });
      
      // Mostrar toast de notificação
      showToast(`Nova inscrição: ${name} em ${eventTitle}`, 'success');
      
      // Auto-remover notificação após 5 segundos
      setTimeout(() => {
        setHasNewRegistration(false);
      }, 5000);
    }

    window.addEventListener('newRegistration', handleNewRegistration);
    return () => {
      window.removeEventListener('newRegistration', handleNewRegistration);
    };
  }, []);

  const logout = () => {
    setIsLoggingOut(true);
    showToast('Saindo do sistema...', 'info');
    setTimeout(() => {
      logoutFromAuth();
    }, 1000);
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin') && !isLoggingOut) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoggingOut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Artistas',
      href: '/admin/artists',
      icon: Palette,
    },
    {
      label: 'Eventos',
      href: '/admin/events',
      icon: Calendar,
    },
    {
      label: 'Inscrições',
      href: '/admin/registrations',
      icon: UserCheck,
    },
    {
      label: 'Mensagens',
      href: '/admin/newsletter',
      icon: Mail,
    },
    {
      label: 'Galeria',
      href: '/admin/galeria',
      icon: Palette,
    },
    {
      label: 'Loja Digital',
      href: '/admin/loja',
      icon: ShoppingCart,
    },
    {
      label: 'Revista',
      href: '/admin/blog',
      icon: BookOpen,
    },
    {
      label: 'Comunidade',
      href: '/admin/comunidade',
      icon: MessageCircle,
    },
    {
      label: 'Logs do Sistema',
      href: '/admin/audit-logs',
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 text-slate-900 transition-all duration-300 flex flex-col shadow-sm fixed md:relative left-0 top-0 h-screen z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img 
                src="/icon.jpeg" 
                alt="Elit'Arte" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h1 className="text-lg font-bold text-slate-900">
                Elit'Arte
              </h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition duration-200 text-slate-600"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Fechar sidebar no mobile após clicar
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold border-l-4 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {sidebarOpen && <span className="text-sm md:text-base">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition duration-200 border border-red-200"
            title="Sair do sistema"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left Section */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden"
                >
                  <Menu size={20} />
                </button>
                
                {/* Título visível em mobile */}
                <h1 className="text-base font-bold text-gray-900 md:hidden truncate">
                  {menuItems.find((item) => item.href === pathname)?.label}
                </h1>
                
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {menuItems.find((item) => item.href === pathname)?.label}
                    </h1>
                    <div className="h-5 w-px bg-gray-200"></div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
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
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <NotificationBell />

                {/* User Profile */}
                <div 
                  className="relative" 
                  ref={profileDropdownRef}
                >
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 sm:space-x-3 focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                      <Link 
                        href="/admin/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                      <Link 
                        href="/admin/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Configurações
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
