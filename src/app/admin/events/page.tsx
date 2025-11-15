'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  available_spots: number;
  created_at: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    capacity: '',
  });

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
        }),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          category: '',
          date: '',
          location: '',
          capacity: '',
        });
        setShowForm(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Eventos</h1>
          <p className="text-slate-600 mt-1">Total de {events.length} eventos cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Novo Evento
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Criar Novo Evento</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
              <input
                type="text"
                placeholder="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
              <input
                type="text"
                placeholder="Local"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
              <input
                type="number"
                placeholder="Capacidade"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                required
              />
            </div>
            <textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              rows={4}
              required
            />
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Criar Evento
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-lg transition duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Título</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Data</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Local</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Capacidade</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Vagas Livres</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Nenhum evento encontrado
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-slate-200 hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-4 text-slate-900 font-medium">{event.title}</td>
                    <td className="px-6 py-4 text-slate-600">{event.category}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{event.location}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{event.capacity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          event.available_spots > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {event.available_spots} vagas
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 font-medium">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
