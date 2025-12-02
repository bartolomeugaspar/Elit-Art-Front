'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

  // Verificar se usuário é admin
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        setIsAdmin(userData.role === 'admin')
      } catch (error) {
        setIsAdmin(false)
      }
    }
  }, [])

  // Buscar notificações do backend
  const refreshNotifications = async () => {
    if (!isAdmin) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }

      // Buscar mensagens não lidas
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

        // Buscar novas inscrições (últimas 24h)
        const registrationsRes = await fetch(`${API_URL}/registrations`, { headers })
        if (registrationsRes.ok) {
          const regData = await registrationsRes.json()
          const registrations = regData.registrations || []
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          const recentRegistrations = registrations.filter((reg: any) => {
            const regDate = new Date(reg.created_at)
            return regDate > yesterday && reg.status === 'pending'
          })

          const regNotifications: Notification[] = recentRegistrations.map((reg: any) => ({
            id: `registration-${reg.id}`,
            type: 'registration' as const,
            title: 'Nova Inscrição em Evento',
            message: `${reg.name} inscreveu-se em um evento`,
            read: false,
            createdAt: reg.created_at,
            link: '/admin/registrations'
          }))

          setNotifications([...contactNotifications, ...regNotifications])
        } else {
          setNotifications(contactNotifications)
        }
      }
    } catch (error) {
      // Silenciar erros de notificação
    }
  }

  // Atualizar notificações a cada 10 segundos
  useEffect(() => {
    if (isAdmin) {
      refreshNotifications()
      const interval = setInterval(refreshNotifications, 10000) // 10 segundos
      return () => clearInterval(interval)
    }
  }, [isAdmin])

  // Escutar eventos de novas mensagens
  useEffect(() => {
    const handleNewContactMessage = () => {
      if (isAdmin) {
        refreshNotifications()
      }
    }

    window.addEventListener('newContactMessage', handleNewContactMessage)
    return () => window.removeEventListener('newContactMessage', handleNewContactMessage)
  }, [isAdmin])

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `manual-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
    
    // Disparar evento global
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
