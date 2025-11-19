'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Newspaper,
} from 'lucide-react';
import { useToast, ToastContainer } from './Toast';

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

  console.log('[AdminLayout] Renderizado com notificationCount:', notificationCount);

  // Buscar inscrições com status "registered" ao montar o componente
  useEffect(() => {
    const fetchRegisteredCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const registrations = data.registrations || [];
          const registeredCount = registrations.filter((reg: any) => reg.status === 'registered').length;
          console.log('[AdminLayout] Inscrições com status "registered":', registeredCount);
          setNotificationCount(registeredCount);
        }
      } catch (error) {
        console.error('[AdminLayout] Erro ao buscar inscrições:', error);
      }
    };

    fetchRegisteredCount();
  }, []);

  // Escutar notificações de inscrições
  useEffect(() => {
    const handleNewRegistration = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { name, email, eventTitle } = customEvent.detail;
      console.log('[AdminLayout] Nova inscrição recebida:', customEvent.detail);
      
      setHasNewRegistration(true);
      setNotificationCount(prev => {
        const newCount = prev + 1;
        console.log('[AdminLayout] Contagem atualizada:', newCount);
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
    console.log('[AdminLayout] Listener de notificações adicionado');
    return () => {
      window.removeEventListener('newRegistration', handleNewRegistration);
      console.log('[AdminLayout] Listener de notificações removido');
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
    console.log('[AdminLayout] Estado:', { loading, user: user?.email, role: user?.role, isLoggingOut });
    if (!loading && (!user || user.role !== 'admin') && !isLoggingOut) {
      console.log('[AdminLayout] Redirecionando para login');
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
      label: 'Newsletter',
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
      label: 'Blog',
      href: '/admin/blog',
      icon: BookOpen,
    },
    {
      label: 'Comunidade',
      href: '/admin/comunidade',
      icon: MessageCircle,
    },
    {
      label: 'Imprensa',
      href: '/admin/imprensa',
      icon: Newspaper,
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
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold border-l-4 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {sidebarOpen && <span>{item.label}</span>}
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
              <div className="flex items-center space-x-4 sm:space-x-8">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden"
                >
                  <Menu size={20} />
                </button>
                
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
                <button 
                  onClick={async () => {
                    router.push('/admin/registrations');
                    // Resetar contador após navegar
                    setTimeout(() => {
                      setNotificationCount(0);
                    }, 500);
                  }}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    hasNewRegistration 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : notificationCount > 0
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  title={`${notificationCount} nova(s) inscrição(ões)`}
                >
                  <div className="relative">
                    <Bell size={24} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* User Profile */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 focus:outline-none">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
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
