import { useNotifications } from '@/contexts/NotificationContext'

/**
 * Hook para adicionar notificações facilmente em qualquer parte do sistema
 */
export function useNotify() {
  const { addNotification, refreshNotifications } = useNotifications()

  const notifyContactMessage = (name: string, subject: string) => {
    addNotification({
      type: 'contact',
      title: 'Nova Mensagem de Contacto',
      message: `${name}: ${subject}`,
      link: '/admin/newsletter'
    })
  }

  const notifyRegistration = (name: string, eventTitle: string) => {
    addNotification({
      type: 'registration',
      title: 'Nova Inscrição em Evento',
      message: `${name} inscreveu-se em "${eventTitle}"`,
      link: '/admin/registrations'
    })
  }

  const notifyOrder = (customerName: string, totalAmount: string) => {
    addNotification({
      type: 'order',
      title: 'Nova Encomenda',
      message: `${customerName} - ${totalAmount}`,
      link: '/admin/loja'
    })
  }

  const notifyComment = (userName: string, topicTitle: string) => {
    addNotification({
      type: 'comment',
      title: 'Novo Comentário na Comunidade',
      message: `${userName} comentou em "${topicTitle}"`,
      link: '/admin/comunidade'
    })
  }

  const notifyNewUser = (userName: string, userEmail: string) => {
    addNotification({
      type: 'general',
      title: 'Novo Usuário Registrado',
      message: `${userName} (${userEmail})`,
      link: '/admin/users'
    })
  }

  const notifyGeneral = (title: string, message: string, link?: string) => {
    addNotification({
      type: 'general',
      title,
      message,
      link
    })
  }

  return {
    notifyContactMessage,
    notifyRegistration,
    notifyOrder,
    notifyComment,
    notifyNewUser,
    notifyGeneral,
    refreshNotifications
  }
}
