'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, CheckCheck, Trash2, RefreshCw, Filter, AlertTriangle, X } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const router = useRouter()
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications, 
    refreshNotifications 
  } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'all' | 'single', id?: string } | null>(null)

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.role !== 'admin') {
          router.push('/')
        }
      } catch {
        router.push('/admin/login')
      }
    }
  }, [router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshNotifications()
    setTimeout(() => setIsRefreshing(false), 500)
    toast.success('Notificações atualizadas!')
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    toast.success('Todas as notificações marcadas como lidas')
  }

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteTarget({ type: 'single', id })
    setShowDeleteModal(true)
  }

  const handleDeleteAll = async () => {
    setDeleteTarget({ type: 'all' })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      if (deleteTarget.type === 'all') {
        await deleteAllNotifications()
        toast.success('Todas as notificações foram eliminadas')
      } else if (deleteTarget.id) {
        await deleteNotification(deleteTarget.id)
        toast.success('Notificação eliminada')
      }
    } catch (error) {
      toast.error('Erro ao eliminar notificação')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeleteTarget(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return '📧'
      case 'registration':
        return '🎟️'
      case 'order':
        return '🛒'
      case 'comment':
        return '💬'
      case 'user':
        return '👤'
      case 'blog':
        return '📝'
      case 'artwork':
        return '🎨'
      case 'artist':
        return '👨‍🎨'
      case 'event':
        return '📅'
      case 'press':
        return '📰'
      default:
        return '🔔'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora mesmo'
    if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`
    if (days < 7) return `Há ${days} dia${days > 1 ? 's' : ''}`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header do Modal */}
            <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900">
                  Confirmar Eliminação
                </h3>
              </div>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 py-6">
              <p className="text-gray-700 leading-relaxed">
                {deleteTarget?.type === 'all' ? (
                  <>
                    Tem certeza que deseja eliminar <span className="font-bold text-red-600">TODAS as {notifications.length} notificações</span>?
                    <br /><br />
                    <span className="text-red-600 font-semibold">Esta ação não pode ser desfeita.</span>
                  </>
                ) : (
                  'Tem certeza que deseja eliminar esta notificação?'
                )}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar {deleteTarget?.type === 'all' ? 'Todas' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 
                    ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
                    : 'Tudo em dia!'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar todas
                </button>
              )}
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
          </div>
        </div>

        {/* Lista de Notificações */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'Todas as suas notificações foram lidas'
                : 'Você receberá notificações aqui quando houver novas atividades'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                  notification.read 
                    ? 'border-gray-200 hover:border-gray-300' 
                    : 'border-blue-200 bg-blue-50/30 hover:border-blue-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Ícone */}
                    <div className="flex-shrink-0">
                      <span className="text-4xl">{getNotificationIcon(notification.type)}</span>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className={`font-semibold ${
                          notification.read ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className={`text-sm mb-2 ${
                        notification.read ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatFullDate(notification.createdAt)}
                        </span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                                toast.success('Marcada como lida')
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Marcar como lida
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                            title="Eliminar notificação"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
