'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, Plus, Edit2, Trash2, Calendar, Filter, 
  TrendingUp, Users, Search, X, Eye, CheckCircle
} from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  status?: string;
  image?: string;
}

interface PerformanceEvaluation {
  id: number;
  artist_id: string;
  year: number;
  quarter: number;
  presenca_reunioes_presenciais: number;
  presenca_reunioes_online: number;
  presenca_espetaculos: number;
  cumprimento_tarefas: number;
  producao_artistica: number;
  comportamento_disciplina: number;
  regularizacao_quota: number;
  media_final: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  artist?: Artist;
}

export default function PerformanceEvaluationsPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [showModal, setShowModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<PerformanceEvaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [artistSearch, setArtistSearch] = useState('');
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    artist_id: '',
    year: new Date().getFullYear(),
    quarter: getCurrentQuarter(),
    presenca_reunioes_presenciais: 0,
    presenca_reunioes_online: 0,
    presenca_espetaculos: 0,
    cumprimento_tarefas: 0,
    producao_artistica: 0,
    comportamento_disciplina: 0,
    regularizacao_quota: 0,
    observacoes: '',
  });

  function getCurrentQuarter(): number {
    const month = new Date().getMonth() + 1;
    if (month >= 1 && month <= 4) return 1;
    if (month >= 5 && month <= 8) return 2;
    return 3;
  }

  function getQuarterLabel(quarter: number): string {
    const labels = {
      1: 'I Trimestre (Jan-Abr)',
      2: 'II Trimestre (Mai-Ago)',
      3: 'III Trimestre (Set-Dez)',
    };
    return labels[quarter as keyof typeof labels] || '';
  }

  useEffect(() => {
    fetchArtists();
    fetchEvaluations();
  }, [selectedYear, selectedQuarter]);

  const fetchArtists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artists?showAll=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const artistList = data.artists || data;
        setArtists(Array.isArray(artistList) ? artistList : []);
      }
    } catch (err) {
    }
  };

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/performance-evaluations/quarter/${selectedYear}/${selectedQuarter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      } else if (response.status === 500) {
        const errorData = await response.json().catch(() => ({}));
        setError('Erro no servidor. A tabela de avaliações pode não estar criada no banco de dados. Execute a migration verify_performance_table.sql');
      } else {
        setError('Erro ao carregar avaliações');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingEvaluation
        ? `${process.env.NEXT_PUBLIC_API_URL}/performance-evaluations/${editingEvaluation.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/performance-evaluations`;

      const method = editingEvaluation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchEvaluations();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao salvar avaliação');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  const handleDelete = (id: number) => {
    setEvaluationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!evaluationToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/performance-evaluations/${evaluationToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess('Avaliação deletada com sucesso!');
        fetchEvaluations();
        setShowDeleteModal(false);
        setEvaluationToDelete(null);
      } else {
        setError('Erro ao deletar avaliação');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  const openEditModal = (evaluation: PerformanceEvaluation) => {
    setEditingEvaluation(evaluation);
    setArtistSearch(evaluation.artist?.name || '');
    setFormData({
      artist_id: evaluation.artist_id,
      year: evaluation.year,
      quarter: evaluation.quarter,
      presenca_reunioes_presenciais: evaluation.presenca_reunioes_presenciais,
      presenca_reunioes_online: evaluation.presenca_reunioes_online,
      presenca_espetaculos: evaluation.presenca_espetaculos,
      cumprimento_tarefas: evaluation.cumprimento_tarefas,
      producao_artistica: evaluation.producao_artistica,
      comportamento_disciplina: evaluation.comportamento_disciplina,
      regularizacao_quota: evaluation.regularizacao_quota,
      observacoes: evaluation.observacoes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingEvaluation(null);
    setArtistSearch('');
    setShowArtistDropdown(false);
    setFormData({
      artist_id: '',
      year: new Date().getFullYear(),
      quarter: getCurrentQuarter(),
      presenca_reunioes_presenciais: 0,
      presenca_reunioes_online: 0,
      presenca_espetaculos: 0,
      cumprimento_tarefas: 0,
      producao_artistica: 0,
      comportamento_disciplina: 0,
      regularizacao_quota: 0,
      observacoes: '',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'text-green-600';
    if (score >= 14) return 'text-green-500';
    if (score >= 12) return 'text-yellow-600';
    if (score >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 16) return 'bg-green-100 border-green-200';
    if (score >= 14) return 'bg-green-50 border-green-200';
    if (score >= 12) return 'bg-yellow-100 border-yellow-200';
    if (score >= 10) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 16) return 'Excelente';
    if (score >= 14) return 'Bom';
    if (score >= 12) return 'Satisfatório';
    if (score >= 10) return 'Regular';
    return 'Insuficiente';
  };

  const filteredEvaluations = evaluations.filter(evaluation =>
    evaluation.artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: evaluations.length,
    average: evaluations.length > 0 
      ? (evaluations.reduce((acc, ev) => acc + ev.media_final, 0) / evaluations.length).toFixed(2)
      : '0.00',
    excellent: evaluations.filter(ev => ev.media_final >= 16).length,
    needsImprovement: evaluations.filter(ev => ev.media_final < 12).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Avaliações</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Média Geral</p>
              <p className="text-2xl font-bold text-slate-900">{stats.average}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Excelentes</p>
              <p className="text-2xl font-bold text-green-600">{stats.excellent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <Award size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Precisam Melhorar</p>
              <p className="text-2xl font-bold text-red-600">{stats.needsImprovement}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="flex-1 sm:max-w-xs">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Search size={16} className="inline mr-2" />
                Buscar Artista
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome do artista..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Ano
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-2" />
                Trimestre
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={1}>I Trim (Jan-Abr)</option>
                <option value={2}>II Trim (Mai-Ago)</option>
                <option value={3}>III Trim (Set-Dez)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-semibold shadow-lg"
          >
            <Plus size={20} />
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <X size={20} className="text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erro</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Sucesso</p>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Lista de Avaliações em Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-900">
            {getQuarterLabel(selectedQuarter)} {selectedYear}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando avaliações...</p>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="p-12 text-center">
            <Award size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 mb-2 font-semibold">Nenhuma avaliação encontrada</p>
            <p className="text-slate-500 text-sm">
              {searchTerm ? 'Tente ajustar sua busca' : 'Clique em "Nova Avaliação" para começar'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {evaluation.artist?.image ? (
                        <img
                          src={evaluation.artist.image}
                          alt={evaluation.artist.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {evaluation.artist?.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900">{evaluation.artist?.name || 'N/A'}</h3>
                        <p className="text-sm text-slate-600">{evaluation.artist?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      <div className="bg-slate-50 rounded p-2">
                        <p className="text-slate-600 text-xs">Reuniões Pres.</p>
                        <p className="font-semibold text-slate-900">{evaluation.presenca_reunioes_presenciais}/20</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <p className="text-slate-600 text-xs">Reuniões Online</p>
                        <p className="font-semibold text-slate-900">{evaluation.presenca_reunioes_online}/20</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <p className="text-slate-600 text-xs">Espetáculos</p>
                        <p className="font-semibold text-slate-900">{evaluation.presenca_espetaculos}/20</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <p className="text-slate-600 text-xs">Tarefas</p>
                        <p className="font-semibold text-slate-900">{evaluation.cumprimento_tarefas}/20</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`${getScoreBgColor(evaluation.media_final)} border rounded-xl p-4 text-center min-w-[120px]`}>
                      <p className="text-xs font-medium text-slate-600 mb-1">Média Final</p>
                      <p className={`text-3xl font-bold ${getScoreColor(evaluation.media_final)}`}>
                        {evaluation.media_final.toFixed(2)}
                      </p>
                      <p className={`text-xs font-semibold ${getScoreColor(evaluation.media_final)}`}>
                        {getScoreLabel(evaluation.media_final)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openEditModal(evaluation)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {evaluation.observacoes && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Observações:</p>
                    <p className="text-sm text-slate-600 italic">{evaluation.observacoes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criação/Edição */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingEvaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artista *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={artistSearch}
                          onChange={(e) => {
                            setArtistSearch(e.target.value);
                            setShowArtistDropdown(true);
                            const artist = artists.find(a => 
                              a.name.toLowerCase() === e.target.value.toLowerCase()
                            );
                            if (artist) {
                              setFormData({ ...formData, artist_id: artist.id });
                            } else {
                              setFormData({ ...formData, artist_id: '' });
                            }
                          }}
                          onFocus={() => setShowArtistDropdown(true)}
                          onBlur={() => setTimeout(() => setShowArtistDropdown(false), 200)}
                          placeholder="Digite para pesquisar artista..."
                          className="w-full border rounded-lg px-4 py-2"
                          required
                          disabled={!!editingEvaluation}
                        />
                        {showArtistDropdown && artistSearch.length >= 2 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {artists
                              .filter(artist => 
                                artist.name.toLowerCase().includes(artistSearch.toLowerCase())
                              )
                              .slice(0, 10)
                              .map((artist) => (
                                <div
                                  key={artist.id}
                                  onClick={() => {
                                    setArtistSearch(artist.name);
                                    setFormData({ ...formData, artist_id: artist.id });
                                    setShowArtistDropdown(false);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <div className="font-medium">{artist.name}</div>
                                  <div className="text-sm text-gray-600">{artist.email}</div>
                                </div>
                              ))
                            }
                            {artists.filter(artist => 
                              artist.name.toLowerCase().includes(artistSearch.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 py-3 text-gray-500 text-sm">
                                Nenhum artista encontrado
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano *
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                        disabled={!!editingEvaluation}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trimestre *
                      </label>
                      <select
                        value={formData.quarter}
                        onChange={(e) => setFormData({ ...formData, quarter: parseInt(e.target.value) })}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                        disabled={!!editingEvaluation}
                      >
                        <option value={1}>I Trimestre (Jan-Abr)</option>
                        <option value={2}>II Trimestre (Mai-Ago)</option>
                        <option value={3}>III Trimestre (Set-Dez)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presença Reuniões Presenciais (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.presenca_reunioes_presenciais}
                        onChange={(e) =>
                          setFormData({ ...formData, presenca_reunioes_presenciais: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presença Reuniões Online (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.presenca_reunioes_online}
                        onChange={(e) =>
                          setFormData({ ...formData, presenca_reunioes_online: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presença Espetáculos (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.presenca_espetaculos}
                        onChange={(e) =>
                          setFormData({ ...formData, presenca_espetaculos: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cumprimento de Tarefas (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.cumprimento_tarefas}
                        onChange={(e) =>
                          setFormData({ ...formData, cumprimento_tarefas: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Produção Artística (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.producao_artistica}
                        onChange={(e) =>
                          setFormData({ ...formData, producao_artistica: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comportamento/Disciplina (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.comportamento_disciplina}
                        onChange={(e) =>
                          setFormData({ ...formData, comportamento_disciplina: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regularização de Quota (0-20)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.regularizacao_quota}
                        onChange={(e) =>
                          setFormData({ ...formData, regularizacao_quota: parseFloat(e.target.value) })
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2"
                      rows={3}
                      placeholder="Observações adicionais sobre o desempenho..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingEvaluation ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Confirmar Exclusão
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Tem certeza que deseja deletar esta avaliação? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEvaluationToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
