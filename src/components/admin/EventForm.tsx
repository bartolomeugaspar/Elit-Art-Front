'use client';

import { useState } from 'react';
import { CheckCircle, X, Upload, Image as ImageIcon, Link as LinkIcon, Settings } from 'lucide-react';
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
    image?: string;
    price?: number;
    isFree?: boolean;
    bankDetails?: {
      accountHolder?: string;
      accountNumber?: string;
      bankName?: string;
      iban?: string;
      swift?: string;
      mpesaNumber?: string;
    };
  };
  isEditing?: boolean;
}

const CATEGORIES = [
  { label: 'Música', value: 'musica' },
  { label: 'Literatura', value: 'literatura' },
  { label: 'Teatro', value: 'teatro' },
  { label: 'Dança', value: 'danca' },
  { label: 'Cinema', value: 'cinema' },
  { label: 'Desenho', value: 'desenho' }
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
    time: initialData?.date ? new Date(initialData.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', '') : '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || '',
    image: initialData?.image || '',
    price: initialData?.price || 0,
    isFree: initialData?.isFree || false,
    bankDetails: initialData?.bankDetails || {
      accountHolder: '',
      accountNumber: '',
      bankName: '',
      iban: '',
    },
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  const handleToggleFree = () => {
    setFormData(prev => ({
      ...prev,
      isFree: !prev.isFree,
      price: !prev.isFree ? 0 : prev.price
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem não pode ser maior que 5MB');
      return;
    }

    setIsUploadingImage(true);
    const uploadToast = toast.loading('Enviando imagem...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: data.imageUrl,
        }));
        setImagePreview(data.imageUrl);
        toast.success('Imagem enviada com sucesso!', {
          id: uploadToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 2000,
        });
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar imagem',
        {
          id: uploadToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageUrlUpload = async () => {
    if (!imageUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    setIsUploadingImage(true);
    const uploadToast = toast.loading('Enviando imagem da URL...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const formDataUpload = new FormData();
      formDataUpload.append('imageUrl', imageUrl.trim());

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: data.imageUrl,
        }));
        setImagePreview(data.imageUrl);
        setImageUrl('');
        toast.success('Imagem enviada com sucesso!', {
          id: uploadToast,
          icon: <CheckCircle className="text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          },
          duration: 2000,
        });
      } else {
        throw new Error(data.message || 'Erro ao enviar imagem');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar imagem',
        {
          id: uploadToast,
          icon: <X className="text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    } finally {
      setIsUploadingImage(false);
    }
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
      if (!formData.time) {
        throw new Error('Hora é obrigatória');
      }
      if (!formData.location.trim()) {
        throw new Error('Local é obrigatório');
      }
      if (!formData.capacity || parseInt(formData.capacity) <= 0) {
        throw new Error('Capacidade deve ser maior que 0');
      }
      if (!formData.image) {
        throw new Error('Imagem é obrigatória');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const url = isEditing ? `${API_URL}/events/${formData.id}` : `${API_URL}/events`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        image: formData.image,
        capacity: parseInt(formData.capacity),
        price: formData.isFree ? 0 : parseFloat(String(formData.price)) || 0,
        is_free: formData.isFree,
        bank_details: !formData.isFree ? {
          account_holder: formData.bankDetails.accountHolder || undefined,
          account_number: formData.bankDetails.accountNumber || undefined,
          bank_name: formData.bankDetails.bankName || undefined,
          iban: formData.bankDetails.iban || undefined,
        } : undefined,
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
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
      } else {
        // Se houver erros de validação, mostrar detalhes
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Erro ao salvar evento');
      }
    } catch (error) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Abas */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                activeTab === 'basic'
                  ? 'text-purple-600 border-b-2 border-purple-600 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Informações Básicas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                activeTab === 'settings'
                  ? 'text-purple-600 border-b-2 border-purple-600 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings size={18} />
              Definições
            </button>
          </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TAB: BASIC */}
        {activeTab === 'basic' && (
          <>
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
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Data, Hora e Local */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">
              Hora *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
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

        {/* Imagem */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Imagem do Evento *
          </label>
          
          {/* Preview da imagem */}
          {imagePreview && (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-slate-300"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: '' }));
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                title="Remover imagem"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Abas de upload */}
          <div className="flex gap-2 mb-4 border-b border-slate-300">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                uploadMode === 'file'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload size={18} />
              Arquivo
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                uploadMode === 'url'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon size={18} />
              URL
            </button>
          </div>

          {/* Upload por Arquivo */}
          {uploadMode === 'file' && (
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploadingImage ? (
                  <>
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-slate-600">Enviando imagem...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Clique para enviar</span> ou arraste uma imagem
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, WebP ou GIF (máx. 5MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
            </label>
          )}

          {/* Upload por URL */}
          {uploadMode === 'url' && (
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isUploadingImage}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              <button
                type="button"
                onClick={handleImageUrlUpload}
                disabled={isUploadingImage || !imageUrl.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2"
              >
                {isUploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <LinkIcon size={18} />
                    Enviar da URL
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">
                Insira a URL completa da imagem (JPEG, PNG, WebP ou GIF)
              </p>
            </div>
          )}
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
          </>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <>
        {/* Tipo de Evento */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFree}
              onChange={handleToggleFree}
              className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
            />
            <span className="font-medium text-slate-900">Evento Gratuito</span>
          </label>
        </div>

        {/* Preço */}
        {!formData.isFree && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
              Preço (AOA) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Ex: 5000"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        )}

        {/* Coordenadas Bancárias */}
        {!formData.isFree && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-slate-900 mb-4">Coordenadas Bancárias</h3>
            
            <div>
              <label htmlFor="accountHolder" className="block text-sm font-medium text-slate-700 mb-1">
                Titular da Conta
              </label>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                placeholder="Nome do titular"
                value={formData.bankDetails.accountHolder}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 mb-1">
                Nome do Banco
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                placeholder="Ex: BAI, BPC, etc"
                value={formData.bankDetails.bankName}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Número da Conta
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                placeholder="Ex: 1234567890"
                value={formData.bankDetails.accountNumber}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-slate-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                id="iban"
                name="iban"
                placeholder="Ex: AO06000100037131174310147"
                value={formData.bankDetails.iban}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

          </div>
        )}
          </>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg"
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
      </div>
    </div>
  );
}
