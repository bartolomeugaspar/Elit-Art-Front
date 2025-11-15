'use client'

import { useState } from 'react'
import { X, Upload, Trash2, Loader, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_URL } from '@/lib/api'

interface EventGalleryModalProps {
  eventId: string
  eventTitle: string
  images: string[]
  onClose: () => void
  onImagesUpdated: (images: string[]) => void
}

export default function EventGalleryModal({
  eventId,
  eventTitle,
  images,
  onClose,
  onImagesUpdated,
}: EventGalleryModalProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [localImages, setLocalImages] = useState<string[]>(images || [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Validar limite de fotos (máximo 2)
    if (localImages.length >= 2) {
      toast.error('Máximo de 2 fotos permitidas na galeria')
      return
    }

    // Validar se adição de novas fotos excederia o limite
    const totalImages = localImages.length + files.length
    if (totalImages > 2) {
      toast.error(`Você pode adicionar apenas ${2 - localImages.length} foto(s) mais`)
      return
    }

    setIsUploading(true)
    const uploadToast = toast.loading('Enviando imagens...')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      for (const file of Array.from(files)) {
        // Validar tipo de arquivo
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
          toast.error(`${file.name}: Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas`)
          continue
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: Imagem não pode ser maior que 5MB`)
          continue
        }

        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (response.ok && data.imageUrl) {
          setLocalImages(prev => [...prev, data.imageUrl])
        } else {
          throw new Error(data.message || 'Erro ao enviar imagem')
        }
      }

      toast.success('Imagens enviadas com sucesso!', {
        icon: <CheckCircle className="text-green-500" />,
        style: {
          background: '#f0fdf4',
          color: '#15803d',
          border: '1px solid #bbf7d0',
        },
      })
    } catch (error) {
      console.error('Failed to upload images:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar imagens',
        {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = (index: number) => {
    setLocalImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          images: localImages,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar galeria')
      }

      toast.success('Galeria atualizada com sucesso!')
      onImagesUpdated(localImages)
      onClose()
    } catch (error) {
      console.error('Failed to save gallery:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar galeria'
      )
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-stArte mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Galeria de Fotos</h2>
              <p className="text-slate-600 mt-1">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Upload Area */}
          {localImages.length < 2 && (
            <div className="mb-6">
              <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition ${
                isUploading 
                  ? 'border-slate-300 bg-slate-50 cursor-not-allowed' 
                  : 'border-slate-300 cursor-pointer hover:border-purple-500 hover:bg-purple-50'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-slate-600">Enviando imagens...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Clique para enviar</span> ou arraste imagens
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, WebP ou GIF (máx. 5MB cada) - {localImages.length}/2 fotos
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={isUploading || localImages.length >= 2}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Gallery Grid */}
          {localImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Fotos ({localImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {localImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remover foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localImages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Nenhuma foto adicionada ainda</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isUploading ? (
                <>
                  <Loader size={16} className="inline mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Galeria'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
