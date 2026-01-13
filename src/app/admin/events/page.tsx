'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Trash2, Edit2, Plus, CheckCircle, X, Calendar, MapPin, Users, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';
import EventForm from '@/components/admin/EventForm';
import EventGalleryModal from '@/components/admin/EventGalleryModal';

interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  capacity: number;
  available_spots: number;
  created_at: string;
  image: string;
  images?: string[];
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price?: number;
  is_free?: boolean;
  bank_details?: {
    account_holder?: string;
    account_number?: string;
    bank_name?: string;
    iban?: string;
  };
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'Data não informada';
  }

  try {
    
    // Tenta múltiplos formatos
    let date: Date | null = null;

    // Formato português: "10 de Janeiro, 2025"
    if (dateString.includes(' de ')) {
      const meses: { [key: string]: number } = {
        'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
        'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
        'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
      };
      
      // Regex para capturar: "10 de Janeiro, 2025"
      const match = dateString.match(/(\d+)\s+de\s+([a-záéíóúãõç]+),?\s+(\d{4})/i);
      
      if (match) {
        const day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        const year = parseInt(match[3]);
        const month = meses[monthName];
        
        
        if (month !== undefined && !isNaN(day) && !isNaN(year) && year > 0) {
          date = new Date(year, month, day);
        } else {
        }
      } else {
      }
    }
    // Tenta formato ISO (2024-01-15T10:30:00)
    else if (dateString.includes('T') || dateString.includes('-')) {
      date = new Date(dateString);
    }
    // Tenta formato DD/MM/YYYY
    else if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      date = new Date(`${year}-${month}-${day}`);
    }
    // Tenta formato YYYY-MM-DD
    else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateString);
    }

    if (!date || isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const formatted = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    return formatted;
  } catch (error) {
    return 'Data inválida';
  }
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDate(event.date).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    setIsEditing(false);
    fetchEvents();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setIsEditing(false);
  };
  
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNewEventClick = () => {
    setEditingEvent(null);
    setIsEditing(false);
    setShowForm(!showForm);
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleDownloadPDF = async (eventId: string, eventTitle: string, detailed: boolean = false) => {
    const loadingToast = toast.loading('Gerando PDF...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }
      
      const url = `${API_URL}/events/${eventId}/registrations/pdf${detailed ? '?detailed=true' : ''}`;
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `inscritos-${eventTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        toast.success('PDF baixado com sucesso!', {
          id: loadingToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
        });
      } else {
        const data = await response.json().catch(() => ({}));
        
        // Mensagem específica para evento sem inscrições
        const errorMessage = data.message || 'Erro ao gerar PDF';
        const detailsMessage = data.details || '';
        
        toast.error(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{errorMessage}</span>
            {detailsMessage && <span className="text-sm opacity-90">{detailsMessage}</span>}
          </div>,
          {
            id: loadingToast,
            icon: <AlertCircle className="text-amber-500" />,
            duration: 5000,
            style: {
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
            },
          }
        );
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor', {
        id: loadingToast,
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    const loadingToast = toast.loading('Excluindo evento...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events/${eventToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Evento excluído com sucesso!', {
          id: loadingToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 3000,
        });
        fetchEvents();
      } else {
        throw new Error('Falha ao excluir evento');
      }
    } catch (error) {
      toast.error('Erro ao excluir evento', {
        id: loadingToast,
        icon: <X className="text-red-500" />,
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewEventClick}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          {isEditing ? 'Editar Evento' : 'Novo Evento'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <EventForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialData={editingEvent ? {
            id: editingEvent.id,
            title: editingEvent.title,
            description: editingEvent.description,
            category: editingEvent.category,
            date: editingEvent.date,
            location: editingEvent.location,
            capacity: editingEvent.capacity.toString(),
            image: editingEvent.image,
            price: editingEvent.price,
            isFree: editingEvent.is_free,
            bankDetails: editingEvent.bank_details ? {
              accountHolder: editingEvent.bank_details.account_holder,
              accountNumber: editingEvent.bank_details.account_number,
              bankName: editingEvent.bank_details.bank_name,
              iban: editingEvent.bank_details.iban,
            } : undefined,
          } : undefined}
          isEditing={isEditing}
        />
      )}

      {/* Events Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Local
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vagas
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando eventos...
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 lg:px-6 py-8 text-center text-slate-500">
                    {searchTerm ? 'Nenhum evento encontrado para a busca' : 'Nenhum evento cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs lg:text-sm font-medium text-slate-900">{event.title}</div>
                            {event.status === 'completed' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                                Passado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{event.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-900">{formatDate(event.date)}</div></td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-slate-900">{event.location}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-16 bg-slate-200 rounded-full h-2.5 flex-shrink-0">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (event.available_spots / event.capacity) > 0.5 
                                ? 'bg-green-500' 
                                : (event.available_spots / event.capacity) > 0.2 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${(event.available_spots / event.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap flex-shrink-0">
                          {event.available_spots}/{event.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        <button
                          onClick={() => handleDownloadPDF(event.id, event.title, false)}
                          className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                          title="Baixar PDF de Inscritos"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="text-slate-600 hover:text-purple-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                          title="Ver detalhes"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir"
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

      {/* Events Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando eventos...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? 'Nenhum evento encontrado para a busca' : 'Nenhum evento cadastrado'}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{event.title}</h3>
                    {event.status === 'completed' && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                        Passado
                      </span>
                    )}
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400 flex-shrink-0" />
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (event.available_spots / event.capacity) > 0.5 
                          ? 'bg-green-500' 
                          : (event.available_spots / event.capacity) > 0.2 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${(event.available_spots / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-slate-700 whitespace-nowrap flex-shrink-0">
                    {event.available_spots}/{event.capacity}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleDownloadPDF(event.id, event.title, false)}
                  className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                  title="Baixar PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleViewDetails(event)}
                  className="text-slate-600 hover:text-purple-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Ver detalhes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEditEvent(event)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(event.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagem do evento */}
            {selectedEvent.image && (
              <div className="relative w-full h-48 sm:h-64 bg-slate-200">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                  title="Fechar"
                >
                  <X size={24} />
                </button>
              </div>
            )}
            
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{selectedEvent.title}</h3>
                    {selectedEvent.status === 'completed' && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-700">
                        Evento Terminado
                      </span>
                    )}
                  </div>
                  <p className="text-purple-600 font-medium mt-1">{selectedEvent.category}</p>
                </div>
                {!selectedEvent.image && (
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-400 hover:text-slate-500 transition-colors"
                    title="Fechar"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Data e Hora</p>
                    <p className="text-slate-900 font-medium">
                      {formatDate(selectedEvent.date)} • {new Date(selectedEvent.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Local</p>
                    <p className="text-slate-900 font-medium">{selectedEvent.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-slate-500">Vagas disponíveis</p>
                      <p className="text-sm font-medium">
                        {selectedEvent.available_spots} de {selectedEvent.capacity} vagas
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (selectedEvent.available_spots / selectedEvent.capacity) > 0.5 
                            ? 'bg-green-500' 
                            : (selectedEvent.available_spots / selectedEvent.capacity) > 0.2 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${(selectedEvent.available_spots / selectedEvent.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-slate-500 mb-2">Descrição</p>
                  <p className="text-slate-700 whitespace-pre-line">
                    {selectedEvent.description || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(true)}
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center gap-2"
                >
                  <ImageIcon size={18} />
                  Galeria de Fotos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEvent(null);
                    handleEditEvent(selectedEvent);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Editar Evento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEvent(null);
                    handleDeleteClick(selectedEvent.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-slate-900">Excluir Evento</h3>
              <div className="mt-2">
                <p className="text-sm text-slate-500">
                  Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-stArte-2 sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEventToDelete(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-stArte-1 sm:text-sm"
                  onClick={handleDeleteEvent}
                  ref={deleteButtonRef}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Gallery Modal */}
      {showGalleryModal && selectedEvent && (
        <EventGalleryModal
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          images={selectedEvent.images || []}
          onClose={() => setShowGalleryModal(false)}
          onImagesUpdated={(images) => {
            setSelectedEvent(prev => prev ? { ...prev, images } : null);
            setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, images } : e));
          }}
        />
      )}
    </div>
  );
}
