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
    console.log('🔍 Verificando admin:', { token: !!token, user })
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        console.log('👤 User data:', userData)
        setIsAdmin(userData.role === 'admin')
        console.log('✅ isAdmin:', userData.role === 'admin')
      } catch (error) {
        console.error('❌ Erro ao parsear user:', error)
        setIsAdmin(false)
      }
    }
  }, [])

  // Buscar notificações do backend
  const refreshNotifications = async () => {
    console.log('🔔 refreshNotifications chamado. isAdmin:', isAdmin)
    if (!isAdmin) {
      console.log('⚠️ Não é admin, retornando...')
      return
    }

    console.log('🚀 Buscando notificações...')
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }
      const allNotifications: Notification[] = []

      // 1. Buscar mensagens de contacto não lidas
      try {
        console.log('📧 Buscando mensagens de contato...', `${API_URL}/contact`)
        const contactRes = await fetch(`${API_URL}/contact`, { headers })
        console.log('📧 Status:', contactRes.status)
        if (contactRes.ok) {
          const contactData = await contactRes.json()
          console.log('📧 Dados recebidos:', contactData)
          const messages = contactData.messages || []
          const unreadMessages = messages.filter((msg: any) => msg.status === 'new')
          console.log('📧 Mensagens não lidas:', unreadMessages.length)

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
        } else {
          console.error('❌ Erro ao buscar contato:', await contactRes.text())
        }
      } catch (error) {
        console.error('❌ Exceção ao buscar contato:', error)
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
            return orderDate > yesterday && order.status === 'pending'
          })

          const orderNotifications: Notification[] = recentOrders.map((order: any) => ({
            id: `order-${order.id}`,
            type: 'order' as const,
            title: 'Nova Encomenda',
            message: `${order.customer_name} - ${order.total_amount} Kz`,
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
            link: '/admin/users'
          }))

          allNotifications.push(...userNotifications)
        }
      } catch (error) {
        console.error('❌ Exceção ao buscar usuários:', error)
      }

      // Ordenar por data (mais recente primeiro)
      allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      console.log('✅ Notificações coletadas:', allNotifications.length)
      console.log('📋 Notificações:', allNotifications)
      setNotifications(allNotifications)
    } catch (error) {
      console.error('❌ Erro ao buscar notificações:', error)
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
