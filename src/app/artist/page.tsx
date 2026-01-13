'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, Star, Target, ArrowUp, Calendar, TrendingUp,
  Award, CheckCircle, Activity, BarChart3
} from 'lucide-react';

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

export default function ArtistDashboard() {
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError('Erro ao carregar avaliações');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'text-green-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 16) return 'bg-green-100 border-green-200';
    if (score >= 12) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 16) return 'bg-green-500';
    if (score >= 12) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 16) return 'Excelente';
    if (score >= 14) return 'Bom';
    if (score >= 12) return 'Satisfatório';
    if (score >= 10) return 'Regular';
    return 'Insuficiente';
  };

  const getQuarterLabel = (quarter: number) => {
    const labels = {
      1: 'I Trimestre',
      2: 'II Trimestre',
      3: 'III Trimestre',
    };
    return labels[quarter as keyof typeof labels] || '';
  };

  const getQuarterPeriod = (quarter: number) => {
    const periods = {
      1: 'Janeiro a Abril',
      2: 'Maio a Agosto',
      3: 'Setembro a Dezembro',
    };
    return periods[quarter as keyof typeof periods] || '';
  };

  const calculateAverage = () => {
    if (evaluations.length === 0) return 0;
    const sum = evaluations.reduce((acc, ev) => acc + ev.media_final, 0);
    return sum / evaluations.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const latestEvaluation = evaluations[0];
  const averageScore = calculateAverage();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-8 border border-emerald-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 text-slate-900">Dashboard de Desempenho</h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600">Acompanhe sua evolução no Elit'Arte</p>
          </div>
          <div className="bg-emerald-100 rounded-xl p-2.5 sm:p-3 lg:p-4">
            <Trophy size={32} className="text-emerald-600 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-blue-100 p-2 sm:p-2.5 lg:p-3 rounded-lg">
              <Activity size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Total de Avaliações</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{evaluations.length}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Avaliações trimestrais registradas</p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className={`${getScoreBgColor(averageScore)} p-2 sm:p-2.5 lg:p-3 rounded-lg border`}>
              <Star size={20} className={`${getScoreColor(averageScore)} sm:w-6 sm:h-6`} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Média Geral</p>
              <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(2)}
              </p>
            </div>
          </div>
          <p className={`text-xs font-semibold ${getScoreColor(averageScore)}`}>
            {getScoreLabel(averageScore)}
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-purple-100 p-2 sm:p-2.5 lg:p-3 rounded-lg">
              <Calendar size={20} className="text-purple-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Última Avaliação</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {latestEvaluation ? latestEvaluation.media_final.toFixed(2) : '--'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {latestEvaluation ? `${getQuarterLabel(latestEvaluation.quarter)} ${latestEvaluation.year}` : 'Nenhuma avaliação'}
          </p>
        </div>
      </div>

      {/* Última Avaliação Detalhada */}
      {latestEvaluation ? (
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1">
                {getQuarterLabel(latestEvaluation.quarter)} {latestEvaluation.year}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">{getQuarterPeriod(latestEvaluation.quarter)}</p>
            </div>
            <Link 
              href="/artist/performance"
              className="w-full sm:w-auto bg-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline">Ver Histórico Completo</span>
              <span className="sm:hidden">Histórico</span>
              <ArrowUp size={14} className="rotate-45" />
            </Link>
          </div>

          {/* Média Final Destaque */}
          <div className={`${getScoreBgColor(latestEvaluation.media_final)} border rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 text-center`}>
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className={`${getScoreBadgeColor(latestEvaluation.media_final)} p-2.5 sm:p-3 lg:p-4 rounded-full`}>
                <Award size={24} className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">Média Final</p>
            <p className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ${getScoreColor(latestEvaluation.media_final)} mb-1 sm:mb-2`}>
              {latestEvaluation.media_final.toFixed(2)}
            </p>
            <p className={`text-sm sm:text-base lg:text-lg font-semibold ${getScoreColor(latestEvaluation.media_final)}`}>
              {getScoreLabel(latestEvaluation.media_final)}
            </p>
          </div>

          {/* Critérios Detalhados */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600 sm:w-5 sm:h-5" />
              Critérios de Avaliação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'Reuniões Presenciais', value: latestEvaluation.presenca_reunioes_presenciais, icon: '👥' },
                { label: 'Reuniões Online', value: latestEvaluation.presenca_reunioes_online, icon: '💻' },
                { label: 'Espetáculos', value: latestEvaluation.presenca_espetaculos, icon: '🎭' },
                { label: 'Cumprimento de Tarefas', value: latestEvaluation.cumprimento_tarefas, icon: '✅' },
                { label: 'Produção Artística', value: latestEvaluation.producao_artistica, icon: '🎨' },
                { label: 'Comportamento/Disciplina', value: latestEvaluation.comportamento_disciplina, icon: '⭐' },
                { label: 'Regularização de Quota', value: latestEvaluation.regularizacao_quota, icon: '💰' },
              ].map((criterion, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-lg sm:text-xl">{criterion.icon}</span>
                      <span className="leading-tight">{criterion.label}</span>
                    </span>
                    <span className={`text-base sm:text-lg font-bold ${getScoreColor(criterion.value)}`}>
                      {criterion.value}/20
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        criterion.value >= 16 ? 'bg-green-500' :
                        criterion.value >= 12 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(criterion.value / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          {latestEvaluation.observacoes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
              <div className="flex items-start gap-2 sm:gap-3">
                <Target size={18} className="text-blue-600 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Observações da Avaliação</h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{latestEvaluation.observacoes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-12 border border-slate-200 shadow-sm text-center">
          <div className="bg-slate-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-slate-400 sm:w-12 sm:h-12" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Nenhuma Avaliação Registrada</h3>
          <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
            Você ainda não possui avaliações de desempenho.<br className="hidden sm:inline" />
            As avaliações são feitas trimestralmente pela administração.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-slate-700">
              <strong>Períodos de Avaliação:</strong><br />
              • I Trimestre: Janeiro a Abril<br />
              • II Trimestre: Maio a Agosto<br />
              • III Trimestre: Setembro a Dezembro
            </p>
          </div>
        </div>
      )}

      {/* Histórico Resumido */}
      {evaluations.length > 1 && (
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600 sm:w-5 sm:h-5" />
            Histórico de Avaliações
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {evaluations.slice(0, 6).map((evaluation) => (
              <div key={evaluation.id} className="bg-slate-50 rounded-lg p-3 sm:p-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    {getQuarterLabel(evaluation.quarter)} {evaluation.year}
                  </p>
                  <div className={`w-2 h-2 rounded-full ${getScoreBadgeColor(evaluation.media_final)}`}></div>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(evaluation.media_final)}`}> 
                  {evaluation.media_final.toFixed(2)}
                </p>
                <p className={`text-xs font-medium ${getScoreColor(evaluation.media_final)} mt-1`}>
                  {getScoreLabel(evaluation.media_final)}
                </p>
              </div>
            ))}
          </div>
          {evaluations.length > 6 && (
            <div className="mt-3 sm:mt-4 text-center">
              <Link 
                href="/artist/performance"
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs sm:text-sm"
              >
                Ver todas as {evaluations.length} avaliações →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Informações */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Sobre o Sistema de Avaliação</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 sm:gap-2">
              <CheckCircle size={14} className="text-green-600 sm:w-4 sm:h-4" />
              Critérios Avaliados
            </h4>
            <ul className="space-y-1">
              <li>• Presença em reuniões presenciais e online</li>
              <li>• Participação em espetáculos</li>
              <li>• Cumprimento de tarefas atribuídas</li>
              <li>• Produção artística e colaboração</li>
              <li>• Comportamento e disciplina</li>
              <li>• Regularização de quotas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 sm:gap-2">
              <Star size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
              Escala de Classificação
            </h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                <span><strong>16-20:</strong> Excelente</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 flex-shrink-0"></div>
                <span><strong>14-16:</strong> Bom</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <span><strong>12-14:</strong> Satisfatório</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 flex-shrink-0"></div>
                <span><strong>10-12:</strong> Regular</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                <span><strong>0-10:</strong> Insuficiente</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
