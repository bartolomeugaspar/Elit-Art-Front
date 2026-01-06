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

  // Verificar se usuário é admin (se tem token)
  useEffect(() => {
    const checkIsAdmin = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      // Tentar obter dados do user do localStorage
      if (user) {
        try {
          const userData = JSON.parse(user)
          const isAdminUser = userData.role === 'admin'
          setIsAdmin(isAdminUser)
          return
        } catch {
          // Erro ao parsear, continuar para decodificar token
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
          
          // Verificar se tem role admin no token
          const isAdminUser = tokenData.role === 'admin' || tokenData.userRole === 'admin'
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
          }
        } catch (error) {
          setIsAdmin(false)
        }
      } else {
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
    
    if (!isAdmin) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const headers = { Authorization: `Bearer ${token}` }
      
      // Buscar notificações do novo endpoint
      const notificationsRes = await fetch(`${API_URL}/notifications`, { headers })
      
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        const dbNotifications = notificationsData.notifications || []
        
        
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
      } else {
      }
    } catch (error) {
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
    
    const handleNewContactMessage = (event?: CustomEvent) => {
      if (!isAdmin) return
      
      // Adicionar notificação instantânea se tiver detalhes
      const detail = (event as CustomEvent)?.detail
      if (detail?.name && detail?.subject) {
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
      if (isAdmin) {
        refreshNotifications()
      }
    }

    const handleNewRegistration = (event: CustomEvent) => {
      if (!isAdmin) {
        return
      }
      
      // Adicionar notificação instantânea
      const { name, eventTitle } = event.detail || {}
      
      if (name && eventTitle) {
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
          const newState = [newNotification, ...prev]
          return newState
        })
      }
      
      // Atualizar também do backend para manter sincronizado
      setTimeout(() => refreshNotifications(), 1000)
    }

    const handleNewOrder = (event: CustomEvent) => {
      if (!isAdmin) return
      
      const { customerName, amount } = event.detail || {}
      if (customerName && amount) {
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
