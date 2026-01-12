'use client';

import { useArtistPerformance } from '@/hooks/useArtistDashboard';

export default function ArtistDashboard() {
  const { performance, loading, error } = useArtistPerformance();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!performance) {
    return null;
  }

  const { artwork_stats, sales_stats, recent_performance, monthly_trend, top_artworks } = performance;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu desempenho</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Artworks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Obras</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {artwork_stats.total_artworks}
              </p>
            </div>
            <div className="text-4xl">🎨</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {artwork_stats.available_artworks} disponíveis • {artwork_stats.sold_artworks} vendidas
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {sales_stats.total_sales}
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {sales_stats.unique_customers} clientes únicos
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                €{sales_stats.total_revenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Média: €{sales_stats.avg_sale_value?.toFixed(2) || '0.00'}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Últimos 30 Dias</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {recent_performance.recent_sales}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            €{recent_performance.recent_revenue?.toFixed(2) || '0.00'} em vendas
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tendência Mensal (Últimos 6 Meses)
          </h2>
          {monthly_trend.length > 0 ? (
            <div className="space-y-3">
              {monthly_trend.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(month.month + '-01').toLocaleDateString('pt-PT', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-gray-600">
                        {month.sales_count} vendas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((month.revenue / Math.max(...monthly_trend.map(m => m.revenue))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      €{month.revenue?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhuma venda registrada ainda
            </p>
          )}
        </div>

        {/* Top Artworks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Obras Mais Vendidas
          </h2>
          {top_artworks.length > 0 ? (
            <div className="space-y-4">
              {top_artworks.map((artwork, index) => (
                <div key={artwork.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 font-bold">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Vendida {artwork.times_sold}x • {artwork.total_quantity_sold} unidades
                    </p>
                    <p className="text-sm font-semibold text-amber-600 mt-1">
                      €{artwork.total_revenue?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhuma venda registrada ainda
            </p>
          )}
        </div>
      </div>

      {/* Price Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Estatísticas de Preços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Preço Médio</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              €{artwork_stats.avg_price?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preço Mínimo</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              €{artwork_stats.min_price?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preço Máximo</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              €{artwork_stats.max_price?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
