'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { API_URL } from '@/lib/api'

export interface Notification {
  id: string
  type: 'contact' | 'registration' | 'order' | 'comment' | 'general'
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
      
      // É admin se tiver token e user com role admin
      if (token && user) {
        try {
          const userData = JSON.parse(user)
          setIsAdmin(userData.role === 'admin')
        } catch {
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
      const allNotifications: Notification[] = []

      // 1. Buscar mensagens de contacto não lidas
      try {
        const contactRes = await fetch(`${API_URL}/contact`, { headers })
        if (contactRes.ok) {
          const contactData = await contactRes.json()
          const messages = contactData.messages || []
          const unreadMessages = messages.filter((msg: any) => msg.status === 'new')

          const contactNotifications: Notification[] = unreadMessages.map((msg: any) => ({
            id: `contact-${msg.id}`,
            type: 'contact' as const,
            title: 'Nova Mensagem de Contacto',
            message: `${msg.name}: ${msg.subject}`,
            read: false,
            createdAt: msg.created_at,
            link: '/admin/newsletter'
          }))

          allNotifications.push(...contactNotifications)
        }
      } catch (error) {
        // Continuar mesmo se falhar
      }

      // 2. Buscar novas inscrições (últimas 24h)
      try {
        const registrationsRes = await fetch(`${API_URL}/registrations`, { headers })
        if (registrationsRes.ok) {
          const regData = await registrationsRes.json()
          const registrations = regData.registrations || []
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const recentRegistrations = registrations.filter((reg: any) => {
            const regDate = new Date(reg.created_at)
            // Mostrar inscrições das últimas 24h que não foram canceladas
            return regDate > yesterday && reg.status !== 'cancelled'
          })

          const regNotifications: Notification[] = recentRegistrations.map((reg: any) => ({
            id: `registration-${reg.id}`,
            type: 'registration' as const,
            title: 'Nova Inscrição em Evento',
            message: `${reg.full_name || reg.name} inscreveu-se em um evento`,
            read: false,
            createdAt: reg.created_at,
            link: '/admin/events'
          }))

          allNotifications.push(...regNotifications)
        }
      } catch (error) {
        // Continuar mesmo se falhar
      }

      // 3. Buscar novos comentários na comunidade (últimas 24h)
      try {
        const forumRes = await fetch(`${API_URL}/forum/topics`, { headers })
        if (forumRes.ok) {
          const forumData = await forumRes.json()
          const topics = forumData.topics || []
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const recentTopics = topics.filter((topic: any) => {
            const topicDate = new Date(topic.created_at)
            return topicDate > yesterday
          })

          const topicNotifications: Notification[] = recentTopics.slice(0, 5).map((topic: any) => ({
            id: `topic-${topic.id}`,
            type: 'comment' as const,
            title: 'Novo Tópico na Comunidade',
            message: `${topic.author_name}: ${topic.title}`,
            read: false,
            createdAt: topic.created_at,
            link: '/admin/comunidade'
          }))

          allNotifications.push(...topicNotifications)
        }
      } catch (error) {
        // Continuar mesmo se falhar
      }

      // 4. Buscar novas encomendas (últimas 24h)
      try {
        const ordersRes = await fetch(`${API_URL}/orders`, { headers })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          const orders = ordersData.orders || []
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const recentOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            // Mostrar encomendas recentes que não foram canceladas
            return orderDate > yesterday && order.status !== 'cancelled'
          })

          const orderNotifications: Notification[] = recentOrders.map((order: any) => ({
            id: `order-${order.id}`,
            type: 'order' as const,
            title: 'Nova Encomenda',
            message: `${order.full_name} - ${order.final_amount} Kz`,
            read: false,
            createdAt: order.created_at,
            link: '/admin/loja'
          }))

          allNotifications.push(...orderNotifications)
        }
      } catch (error) {
        // Continuar mesmo se falhar
      }

      // 5. Buscar novos usuários (últimas 24h)
      try {
        const usersRes = await fetch(`${API_URL}/users`, { headers })
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          const users = usersData.users || []
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const recentUsers = users.filter((user: any) => {
            const userDate = new Date(user.created_at)
            return userDate > yesterday
          })

          const userNotifications: Notification[] = recentUsers.slice(0, 5).map((user: any) => ({
            id: `user-${user.id}`,
            type: 'general' as const,
            title: 'Novo Usuário Registrado',
            message: `${user.name} (${user.email})`,
            read: false,
            createdAt: user.created_at,
            link: '/admin/profile'
          }))

          allNotifications.push(...userNotifications)
        }
      } catch (error) {
        // Continuar mesmo se falhar
      }

      // Ordenar por data (mais recente primeiro)
      allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setNotifications(allNotifications)
    } catch (error) {
      // Erro ao buscar notificações
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

  // Escutar eventos de novas mensagens
  useEffect(() => {
    const handleNewContactMessage = () => {
      if (isAdmin) {
        refreshNotifications()
      }
    }
    
    const handleMessagesUpdated = () => {
      if (isAdmin) {
        refreshNotifications()
      }
    }

    window.addEventListener('newContactMessage', handleNewContactMessage)
    window.addEventListener('messagesUpdated', handleMessagesUpdated)
    
    return () => {
      window.removeEventListener('newContactMessage', handleNewContactMessage)
      window.removeEventListener('messagesUpdated', handleMessagesUpdated)
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

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
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
