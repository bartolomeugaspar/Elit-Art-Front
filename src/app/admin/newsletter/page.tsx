'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Mail, Eye, X, CheckCircle, Clock, Search } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        
        // Disparar evento para atualizar notificações no header
        window.dispatchEvent(new CustomEvent('messagesUpdated'));
      }
    } catch (error) {
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Marcar como lida
    if (message.status === 'new') {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/contact/${message.id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Atualizar status localmente
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'read' as const } : m
        ));
      } catch (error) {
        // Silently fail
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/contact/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Mensagem excluída com sucesso!');
        fetchMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      toast.error('Erro ao excluir mensagem');
    }
  };

  const handleReplyMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error('Por favor, escreva uma resposta');
      return;
    }

    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/contact/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.ok) {
        toast.success('Resposta enviada com sucesso!');
        setShowReplyModal(false);
        setReplyText('');
        fetchMessages();
        setSelectedMessage(null);
      } else {
        toast.error('Erro ao enviar resposta');
      }
    } catch (error) {
      toast.error('Erro ao enviar resposta');
    } finally {
      setSendingReply(false);
    }
  };

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nova';
      case 'read':
        return 'Lida';
      case 'replied':
        return 'Respondida';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-600 mt-1">
          {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'} total
          {newMessagesCount > 0 && ` • ${newMessagesCount} ${newMessagesCount === 1 ? 'nova' : 'novas'}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Novas Mensagens</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{newMessagesCount}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg">
              <Mail size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Lidas</p>
              <p className="text-4xl font-bold text-gray-600 mt-2">
                {messages.filter(m => m.status === 'read').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-4 rounded-lg">
              <Eye size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Respondidas</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {messages.filter(m => m.status === 'replied').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou assunto..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="new">Novas</option>
          <option value="read">Lidas</option>
          <option value="replied">Respondidas</option>
        </select>
      </div>

      {/* Messages Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assunto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Carregando mensagens...
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    {searchTerm || statusFilter !== 'all' ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem recebida'}
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-slate-900">{message.name}</div>
                        {message.status === 'new' && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{message.email}</div>
                      {message.phone && (
                        <div className="text-xs text-slate-400">{message.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                        {getStatusLabel(message.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(message.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
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

      {/* Messages Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Carregando mensagens...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm || statusFilter !== 'all' ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem recebida'}
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{message.name}</h3>
                    {message.status === 'new' && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{message.email}</p>
                  {message.phone && <p className="text-xs text-slate-400">{message.phone}</p>}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                  {getStatusLabel(message.status)}
                </span>
              </div>

              <p className="text-sm text-slate-900 font-medium mb-2">{message.subject}</p>
              <p className="text-xs text-slate-500 mb-3">
                {new Date(message.created_at).toLocaleDateString('pt-BR')}
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleViewMessage(message)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Ver detalhes"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleDeleteMessage(message.id)}
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedMessage.subject}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusLabel(selectedMessage.status)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-slate-500 transition-colors"
                  title="Fechar"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">De</p>
                    <p className="text-slate-900 font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-slate-600">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-sm text-slate-600">{selectedMessage.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Data</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(selectedMessage.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-2">Mensagem</p>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleReplyMessage(selectedMessage)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Mail size={18} />
                  Responder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMessage(null);
                    handleDeleteMessage(selectedMessage.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowReplyModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Responder Mensagem</h3>
                  <p className="text-slate-600 mt-1">Para: {selectedMessage.name} ({selectedMessage.email})</p>
                  <p className="text-sm text-slate-500 mt-1">Assunto: Re: {selectedMessage.subject}</p>
                </div>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-slate-400 hover:text-slate-500 transition-colors"
                  title="Fechar"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Original Message */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 mb-2">Mensagem original:</p>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Reply Textarea */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sua Resposta *
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva sua resposta aqui..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900"
                  rows={8}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  disabled={sendingReply}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingReply ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      Enviar Resposta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
