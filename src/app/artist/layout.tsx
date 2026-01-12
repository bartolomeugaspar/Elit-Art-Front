'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'artista')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'artista') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-amber-600">
                Elit Arte
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700 font-medium">Painel do Artista</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, <span className="font-semibold">{user.name}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/artist"
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/artist/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                  >
                    👤 Meu Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/artist/quotas"
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                  >
                    💳 Minhas Quotas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/galeria"
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                  >
                    🎨 Ver Galeria
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
