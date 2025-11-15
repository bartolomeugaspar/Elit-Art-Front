'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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
} from 'lucide-react';
import { useState } from 'react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

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
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 text-slate-900 transition-all duration-300 flex flex-col shadow-sm fixed left-0 top-0 h-screen z-40`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img 
                src="/icon.jpeg" 
                alt="Elit'Art" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h1 className="text-lg font-bold text-slate-900">
                Elit'Art
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
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between h-16">
              {/* Left Section */}
              <div className="flex items-center space-x-8">
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
                <button className="p-2.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <div className="relative">
                    <Bell size={24} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">3</span>
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
        <div className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
