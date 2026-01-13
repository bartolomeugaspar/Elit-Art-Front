'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
}

export default function ArtistPerformancePage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<PerformanceEvaluation | null>(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/performance-evaluations/my-evaluations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      } else if (response.status === 401) {
        router.push('/artist/login');
      } else {
        setError('Erro ao carregar avaliações');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  function getQuarterLabel(quarter: number): string {
    const labels = {
      1: 'I Trimestre (Jan-Abr)',
      2: 'II Trimestre (Mai-Ago)',
      3: 'III Trimestre (Set-Dez)',
    };
    return labels[quarter as keyof typeof labels] || '';
  }

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'text-green-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 16) return 'Excelente';
    if (score >= 14) return 'Bom';
    if (score >= 12) return 'Satisfatório';
    if (score >= 10) return 'Regular';
    return 'Insuficiente';
  };

  const calculateAverage = (evaluations: PerformanceEvaluation[]) => {
    if (evaluations.length === 0) return 0;
    const sum = evaluations.reduce((acc, ev) => acc + ev.media_final, 0);
    return sum / evaluations.length;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Minhas Avaliações de Desempenho</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Acompanhe seu desempenho artístico e comportamental ao longo dos trimestres
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Estatísticas Gerais */}
      {!loading && evaluations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Total de Avaliações</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{evaluations.length}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Média Geral</h3>
            <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(calculateAverage(evaluations))}`}>
              {calculateAverage(evaluations).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Última Avaliação</h3>
            <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(evaluations[0]?.media_final || 0)}`}>
              {evaluations[0]?.media_final.toFixed(2) || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {evaluations[0] ? getQuarterLabel(evaluations[0].quarter) + ' ' + evaluations[0].year : ''}
            </p>
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">Carregando avaliações...</p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-base sm:text-lg text-gray-600">
            Você ainda não possui avaliações registradas.
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            As avaliações são feitas trimestralmente pela administração.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEvaluation(evaluation)}
            >
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-3 sm:mb-4 gap-3">
                  <div className="w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                      {getQuarterLabel(evaluation.quarter)} {evaluation.year}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Avaliado em {new Date(evaluation.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(evaluation.media_final)}`}>
                      {evaluation.media_final.toFixed(2)}
                    </p>
                    <p className={`text-xs sm:text-sm ${getScoreColor(evaluation.media_final)}`}>
                      {getScoreLabel(evaluation.media_final)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Reuniões Presenciais</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.presenca_reunioes_presenciais}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Reuniões Online</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.presenca_reunioes_online}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Espetáculos</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.presenca_espetaculos}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Tarefas</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.cumprimento_tarefas}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Produção Artística</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.producao_artistica}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Comportamento</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.comportamento_disciplina}/20</p>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Regularização Quota</p>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">{evaluation.regularizacao_quota}/20</p>
                  </div>
                </div>

                {evaluation.observacoes && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Observações:</p>
                    <p className="text-xs sm:text-sm text-gray-600">{evaluation.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Modal de Detalhes */}
        {selectedEvaluation && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
            onClick={() => setSelectedEvaluation(null)}
          >
            <div
              className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex justify-between items-start mb-4 sm:mb-6 gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      Detalhes da Avaliação
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      {getQuarterLabel(selectedEvaluation.quarter)} {selectedEvaluation.year}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEvaluation(null)}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

              <div className="mb-4 sm:mb-6 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Média Final</p>
                <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${getScoreColor(selectedEvaluation.media_final)}`}>
                  {selectedEvaluation.media_final.toFixed(2)}
                </p>
                <p className={`text-base sm:text-lg mt-2 ${getScoreColor(selectedEvaluation.media_final)}`}>
                  {getScoreLabel(selectedEvaluation.media_final)}
                </p>
              </div>              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">Critérios de Avaliação</h3>                  {[
                    { label: 'Presença em Reuniões Presenciais', value: selectedEvaluation.presenca_reunioes_presenciais },
                    { label: 'Presença em Reuniões Online', value: selectedEvaluation.presenca_reunioes_online },
                    { label: 'Presença em Espetáculos', value: selectedEvaluation.presenca_espetaculos },
                    { label: 'Cumprimento de Tarefas', value: selectedEvaluation.cumprimento_tarefas },
                    { label: 'Produção Artística ou Colaboração', value: selectedEvaluation.producao_artistica },
                    { label: 'Comportamento e Disciplina', value: selectedEvaluation.comportamento_disciplina },
                    { label: 'Regularização de Quota', value: selectedEvaluation.regularizacao_quota },
                  ].map((criterion, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium leading-tight">{criterion.label}</span>
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none w-full sm:w-32 lg:w-48 bg-gray-200 rounded-full h-2 sm:h-2.5 lg:h-3">
                          <div
                            className={`h-2 sm:h-2.5 lg:h-3 rounded-full ${
                              criterion.value >= 16 ? 'bg-green-500' :
                              criterion.value >= 12 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(criterion.value / 20) * 100}%` }}
                          />
                        </div>
                        <span className={`font-bold text-base sm:text-lg whitespace-nowrap ${getScoreColor(criterion.value)}`}>
                          {criterion.value}/20
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              {selectedEvaluation.observacoes && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Observações da Avaliação</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">{selectedEvaluation.observacoes}</p>
                </div>
              )}                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Avaliação criada em {new Date(selectedEvaluation.created_at).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações sobre o Sistema de Avaliação */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Sobre o Sistema de Avaliação</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Períodos de Avaliação</h4>
              <ul className="space-y-1">
                <li>• <strong>I Trimestre:</strong> Janeiro a Abril</li>
                <li>• <strong>II Trimestre:</strong> Maio a Agosto</li>
                <li>• <strong>III Trimestre:</strong> Setembro a Dezembro</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Escala de Classificação</h4>
              <ul className="space-y-1">
                <li>• <strong className="text-green-600">16-20:</strong> Excelente</li>
                <li>• <strong className="text-green-600">14-16:</strong> Bom</li>
                <li>• <strong className="text-yellow-600">12-14:</strong> Satisfatório</li>
                <li>• <strong className="text-yellow-600">10-12:</strong> Regular</li>
                <li>• <strong className="text-red-600">0-10:</strong> Insuficiente</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            A média final é calculada automaticamente pela soma de todas as notas dividida por 7.
          </p>
        </div>
      </div>
  );
}
