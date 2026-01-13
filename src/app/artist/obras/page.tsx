'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Palette, Calendar, ExternalLink } from 'lucide-react';

interface Artwork {
  id: string;
  title: string;
  description: string;
  artist_id: string;
  artist_name: string;
  type: string;
  year: number;
  image_url: string;
  is_available: boolean;
  likes: number;
  created_at: string;
}

export default function ArtistObrasPage() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/artworks/artist/${user.id}`
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar obras');
        }

        const data = await response.json();
        setArtworks(data.artworks || []);
      } catch (err) {
        setError('Não foi possível carregar as obras');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [user?.id]);

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      musica: 'Música',
      literatura: 'Literatura',
      teatro: 'Teatro',
      danca: 'Dança',
      cinema: 'Cinema',
      desenho: 'Desenho',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando obras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Artworks Grid */}
      {artworks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <Palette className="mx-auto text-gray-400 mb-4" size={40} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Sem obras
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Ainda não existem obras registradas relacionadas ao seu perfil.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 bg-gray-100">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-artwork.jpg';
                  }}
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                    {getTypeLabel(artwork.type)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {artwork.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{artwork.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>❤️ {artwork.likes || 0}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <a
                  href={`/galeria`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                >
                  <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                  Ver na Galeria
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {artworks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center py-3 sm:py-0">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {artworks.length}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {artworks.length === 1 ? 'Obra Registrada' : 'Obras Registradas'}
              </p>
            </div>
            <div className="text-center py-3 sm:py-0 border-t sm:border-t-0 sm:border-l sm:border-r border-gray-200">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {artworks.reduce((acc, art) => acc + (art.likes || 0), 0)}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Total de Likes</p>
            </div>
            <div className="text-center py-3 sm:py-0 border-t sm:border-t-0 border-gray-200">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {new Set(artworks.map((art) => art.type)).size}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {new Set(artworks.map((art) => art.type)).size === 1
                  ? 'Tipo de Arte'
                  : 'Tipos de Arte'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
