'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { API_URL } from '@/lib/api'

export interface Notification {
  id: string
  type: 'contact' | 'registration' | 'order' | 'comment' | 'general' | 'user' | 'blog' | 'artwork' | 'artist' | 'event' | 'press'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  deleteAllNotifications: () => void
  refreshNotifications: () => Promise<void>
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  console.log('[NotificationProvider] Renderizando, notificações:', notifications.length, 'isAdmin:', isAdmin)

  // Verificar se usuário é admin (se tem token)
  useEffect(() => {
    const checkIsAdmin = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      console.log('[NotificationContext] Verificando se é admin, token:', !!token, 'user:', !!user)
      
      // Tentar obter dados do user do localStorage
      if (user) {
        try {
          const userData = JSON.parse(user)
          console.log('[NotificationContext] User data:', userData)
          const isAdminUser = userData.role === 'admin'
          console.log('[NotificationContext] É admin?', isAdminUser)
          setIsAdmin(isAdminUser)
          return
        } catch {
          console.log('[NotificationContext] Erro ao parsear user data')
        }
      }
      
      // Se não tiver user no localStorage mas tiver token, decodificar o token
      if (token) {
        try {
          // Decodificar JWT (apenas a parte do payload)
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          const tokenData = JSON.parse(jsonPayload)
          console.log('[NotificationContext] Token data:', tokenData)
          
          // Verificar se tem role admin no token
          const isAdminUser = tokenData.role === 'admin' || tokenData.userRole === 'admin'
          console.log('[NotificationContext] É admin (do token)?', isAdminUser)
          setIsAdmin(isAdminUser)
          
          // Salvar dados do usuário no localStorage para próximas vezes
          if (tokenData.userId || tokenData.id) {
            const userData = {
              id: tokenData.userId || tokenData.id,
              email: tokenData.email,
              name: tokenData.name,
              role: tokenData.role || tokenData.userRole
            }
            localStorage.setItem('user', JSON.stringify(userData))
            console.log('[NotificationContext] Salvando user data no localStorage:', userData)
          }
        } catch (error) {
          console.error('[NotificationContext] Erro ao decodificar token:', error)
          setIsAdmin(false)
        }
      } else {
        console.log('[NotificationContext] Nenhum token encontrado')
        setIsAdmin(false)
      }
    }
    
    checkIsAdmin()
    
    // Verificar novamente quando houver mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkIsAdmin()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Buscar notificações do backend
  const refreshNotifications = useCallback(async () => {
    console.log('[NotificationContext] refreshNotifications chamado, isAdmin:', isAdmin)
    
    if (!isAdmin) {
      console.log('[NotificationContext] Usuário não é admin, ignorando')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('[NotificationContext] Token não encontrado')
        return
      }

      const headers = { Authorization: `Bearer ${token}` }
      
      // Buscar notificações do novo endpoint
      console.log('[NotificationContext] Buscando notificações do banco de dados...')
      const notificationsRes = await fetch(`${API_URL}/notifications`, { headers })
      
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        const dbNotifications = notificationsData.notifications || []
        
        console.log('[NotificationContext] Notificações do BD:', dbNotifications.length)
        
        // Converter formato do BD para o formato do frontend
        const formattedNotifications: Notification[] = dbNotifications.map((notif: any) => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          read: notif.read,
          createdAt: notif.created_at,
          link: notif.link
        }))
        
        setNotifications(formattedNotifications)
        console.log('[NotificationContext] Total de notificações:', formattedNotifications.length)
      } else {
        console.error('[NotificationContext] Erro ao buscar notificações:', notificationsRes.status)
      }
    } catch (error) {
      console.error('[NotificationContext] Erro geral ao buscar notificações:', error)
    }
  }, [isAdmin])

  // Atualizar notificações a cada 30 segundos quando admin
  useEffect(() => {
    if (isAdmin) {
      refreshNotifications()
      const interval = setInterval(refreshNotifications, 30000) // 30 segundos
      return () => clearInterval(interval)
    }
  }, [isAdmin, refreshNotifications])

  // Escutar eventos de novas mensagens e inscrições
  useEffect(() => {
    console.log('[NotificationContext] Configurando listeners de eventos, isAdmin:', isAdmin)
    
    const handleNewContactMessage = (event?: CustomEvent) => {
      console.log('[NotificationContext] Evento newContactMessage recebido', event)
      if (!isAdmin) return
      
      // Adicionar notificação instantânea se tiver detalhes
      const detail = (event as CustomEvent)?.detail
      if (detail?.name && detail?.subject) {
        console.log('[NotificationContext] Adicionando notificação de contato instantânea')
        const newNotification: Notification = {
          id: `contact-instant-${Date.now()}`,
          type: 'contact',
          title: 'Nova Mensagem de Contacto',
          message: `${detail.name}: ${detail.subject}`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/newsletter'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      // Atualizar do backend
      setTimeout(() => refreshNotifications(), 1000)
    }
    
    const handleMessagesUpdated = () => {
      console.log('[NotificationContext] Evento messagesUpdated recebido')
      if (isAdmin) {
        refreshNotifications()
      }
    }

    const handleNewRegistration = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newRegistration recebido', event)
      if (!isAdmin) {
        console.log('[NotificationContext] Usuário não é admin, ignorando evento')
        return
      }
      
      // Adicionar notificação instantânea
      const { name, eventTitle } = event.detail || {}
      console.log('[NotificationContext] Detalhes da inscrição:', { name, eventTitle })
      
      if (name && eventTitle) {
        console.log('[NotificationContext] Adicionando notificação de inscrição instantânea')
        const newNotification: Notification = {
          id: `registration-instant-${Date.now()}`,
          type: 'registration',
          title: 'Nova Inscrição em Evento',
          message: `${name} inscreveu-se em ${eventTitle}`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/events'
        }
        
        setNotifications(prev => {
          console.log('[NotificationContext] Estado anterior de notificações:', prev.length)
          const newState = [newNotification, ...prev]
          console.log('[NotificationContext] Novo estado de notificações:', newState.length)
          return newState
        })
      }
      
      // Atualizar também do backend para manter sincronizado
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewOrder = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newOrder recebido', event)
      if (!isAdmin) return
      
      const { customerName, amount } = event.detail || {}
      if (customerName && amount) {
        console.log('[NotificationContext] Adicionando notificação de pedido instantânea')
        const newNotification: Notification = {
          id: `order-instant-${Date.now()}`,
          type: 'order',
          title: 'Nova Encomenda',
          message: `${customerName} - ${amount} Kz`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/loja'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewUser = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newUser recebido', event)
      if (!isAdmin) return
      
      const { name, email } = event.detail || {}
      if (name && email) {
        const newNotification: Notification = {
          id: `user-instant-${Date.now()}`,
          type: 'user',
          title: 'Novo Usuário Registrado',
          message: `${name} (${email})`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/profile'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewBlogPost = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newBlogPost recebido', event)
      if (!isAdmin) return
      
      const { title } = event.detail || {}
      if (title) {
        const newNotification: Notification = {
          id: `blog-instant-${Date.now()}`,
          type: 'blog',
          title: 'Novo Post Publicado',
          message: title,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/blog'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewArtwork = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newArtwork recebido', event)
      if (!isAdmin) return
      
      const { title, artist } = event.detail || {}
      if (title) {
        const newNotification: Notification = {
          id: `artwork-instant-${Date.now()}`,
          type: 'artwork',
          title: 'Nova Obra de Arte Adicionada',
          message: `${title}${artist ? ` - ${artist}` : ''}`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/galeria'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewArtist = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newArtist recebido', event)
      if (!isAdmin) return
      
      const { name, specialty } = event.detail || {}
      if (name) {
        const newNotification: Notification = {
          id: `artist-instant-${Date.now()}`,
          type: 'artist',
          title: 'Novo Artista Cadastrado',
          message: `${name}${specialty ? ` - ${specialty}` : ''}`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/artists'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewEvent = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newEvent recebido', event)
      if (!isAdmin) return
      
      const { title, date } = event.detail || {}
      if (title) {
        const newNotification: Notification = {
          id: `event-instant-${Date.now()}`,
          type: 'event',
          title: 'Novo Evento Criado',
          message: `${title}${date ? ` - ${new Date(date).toLocaleDateString('pt-BR')}` : ''}`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/events'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewComment = (event: CustomEvent) => {
      console.log('[NotificationContext] Evento newComment recebido', event)
      if (!isAdmin) return
      
      const { author, content, type } = event.detail || {}
      if (author && content) {
        const newNotification: Notification = {
          id: `comment-instant-${Date.now()}`,
          type: 'comment',
          title: type === 'forum' ? 'Novo Tópico na Comunidade' : 'Novo Comentário no Blog',
          message: `${author}: ${content.substring(0, 50)}...`,
          read: false,
          createdAt: new Date().toISOString(),
          link: type === 'forum' ? '/admin/comunidade' : '/admin/blog'
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
      
      setTimeout(() => refreshNotifications(), 1000)
    }

    // Registrar todos os listeners
    window.addEventListener('newContactMessage', handleNewContactMessage as EventListener)
    window.addEventListener('messagesUpdated', handleMessagesUpdated)
    window.addEventListener('newRegistration', handleNewRegistration as EventListener)
    window.addEventListener('newOrder', handleNewOrder as EventListener)
    window.addEventListener('newUser', handleNewUser as EventListener)
    window.addEventListener('newBlogPost', handleNewBlogPost as EventListener)
    window.addEventListener('newArtwork', handleNewArtwork as EventListener)
    window.addEventListener('newArtist', handleNewArtist as EventListener)
    window.addEventListener('newEvent', handleNewEvent as EventListener)
    window.addEventListener('newComment', handleNewComment as EventListener)
    
    return () => {
      window.removeEventListener('newContactMessage', handleNewContactMessage as EventListener)
      window.removeEventListener('messagesUpdated', handleMessagesUpdated)
      window.removeEventListener('newRegistration', handleNewRegistration as EventListener)
      window.removeEventListener('newOrder', handleNewOrder as EventListener)
      window.removeEventListener('newUser', handleNewUser as EventListener)
      window.removeEventListener('newBlogPost', handleNewBlogPost as EventListener)
      window.removeEventListener('newArtwork', handleNewArtwork as EventListener)
      window.removeEventListener('newArtist', handleNewArtist as EventListener)
      window.removeEventListener('newEvent', handleNewEvent as EventListener)
      window.removeEventListener('newComment', handleNewComment as EventListener)
    }
  }, [isAdmin, refreshNotifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!isAdmin) return // Só adicionar se for admin
    
    const newNotification: Notification = {
      ...notification,
      id: `manual-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    }
    
    // Adicionar imediatamente à lista
    setNotifications(prev => {
      // Evitar duplicatas
      const exists = prev.some(n => 
        n.type === newNotification.type && 
        n.message === newNotification.message
      )
      if (exists) return prev
      
      return [newNotification, ...prev]
    })
    
    // Disparar evento global para atualizar também do backend
    window.dispatchEvent(new CustomEvent('newContactMessage'))
  }

  const markAsRead = async (id: string) => {
    // Atualizar localmente primeiro para feedback imediato
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    
    // Atualizar no backend
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${API_URL}/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('[NotificationContext] Erro ao marcar como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    // Atualizar localmente primeiro
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    
    // Atualizar no backend
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${API_URL}/notifications/mark-all-read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('[NotificationContext] Erro ao marcar todas como lidas:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${API_URL}/notifications/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Atualizar estado local
        setNotifications(prev => prev.filter(n => n.id !== id))
      }
    } catch (error) {
      console.error('[NotificationContext] Erro ao deletar notificação:', error)
      throw error
    }
  }

  const deleteAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        // Deletar todas as notificações uma por uma
        const deletePromises = notifications.map(notification =>
          fetch(`${API_URL}/notifications/${notification.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          })
        )
        
        await Promise.all(deletePromises)
        
        // Limpar estado local
        setNotifications([])
      }
    } catch (error) {
      console.error('[NotificationContext] Erro ao deletar todas as notificações:', error)
      throw error
    }
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        refreshNotifications,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
