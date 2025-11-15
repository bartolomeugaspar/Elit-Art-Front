'use client';

import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    capacity: string;
  };
  isEditing?: boolean;
}

const CATEGORIES = [
  'Exposição',
  'Workshop',
  'Palestra',
  'Performance',
  'Lançamento',
  'Encontro',
  'Outro'
];

export default function EventForm({ 
  onSuccess, 
  onCancel, 
  initialData,
  isEditing = false 
}: EventFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date || '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? 'Atualizando evento...' : 'Criando evento...');
    
    try {
      // Validação básica
      if (!formData.title.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!formData.description.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!formData.category) {
        throw new Error('Categoria é obrigatória');
      }
      if (!formData.date) {
        throw new Error('Data é obrigatória');
      }
      if (!formData.location.trim()) {
        throw new Error('Local é obrigatório');
      }
      if (!formData.capacity || parseInt(formData.capacity) <= 0) {
        throw new Error('Capacidade deve ser maior que 0');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const url = isEditing ? `${API_URL}/events/${formData.id}` : `${API_URL}/events`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          date: formData.date,
          location: formData.location.trim(),
          capacity: parseInt(formData.capacity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditing ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!', 
          {
            id: loadingToast,
            icon: <CheckCircle className="text-green-500" />,
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
            duration: 3000,
          }
        );
        onSuccess();
      } else {
        throw new Error(data.message || 'Erro ao salvar evento');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar evento',
        {
          id: loadingToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Ex: Exposição de Arte Contemporânea"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            required
          />
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            required
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Data e Local */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
              Data e Hora *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Local *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Ex: Galeria Central, São Paulo"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              required
            />
          </div>
        </div>

        {/* Capacidade */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-1">
            Capacidade (número de vagas) *
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="Ex: 50"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Descreva os detalhes do evento..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            rows={5}
            required
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-green-400 disabled:to-green-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Evento' : 'Criar Evento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-900 px-6 py-3 rounded-lg transition duration-200 font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
