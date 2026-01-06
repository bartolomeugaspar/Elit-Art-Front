'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Mail, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { API_URL } from '@/lib/api'
import toast from 'react-hot-toast'

interface NotificationSettings {
  emailEnabled: boolean
  pushEnabled: boolean
  weeklyReport: boolean
  monthlyReport: boolean
  newRegistrations: boolean
  newOrders: boolean
  newContacts: boolean
  newComments: boolean
  newUsers: boolean
  twoFactorEnabled: boolean
}

export default function NotificationSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadSettings()
  }, [router])

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/notification-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/notification-settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      })

      if (response.ok) {
        const updated = await response.json()
        setSettings(updated)
        toast.success('Configuração atualizada!')
      } else {
        toast.error('Erro ao atualizar configuração')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar configuração')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar configurações</p>
        </div>
      </div>
    )
  }

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    disabled 
  }: { 
    enabled: boolean
    onChange: (value: boolean) => void
    disabled?: boolean 
  }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
              <p className="text-sm text-gray-600">Configure como deseja receber notificações</p>
            </div>
          </div>
        </div>

        {/* Canais de Notificação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Canais de Notificação</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                <p className="text-sm text-gray-600">Receba atualizações importantes por email</p>
              </div>
              <ToggleSwitch
                enabled={settings.emailEnabled}
                onChange={(value) => updateSetting('emailEnabled', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Notificações Push</h3>
                <p className="text-sm text-gray-600">Receba notificações no navegador</p>
              </div>
              <ToggleSwitch
                enabled={settings.pushEnabled}
                onChange={(value) => updateSetting('pushEnabled', value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Relatórios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Relatórios</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Relatório Semanal</h3>
                <p className="text-sm text-gray-600">Receba resumo semanal das atividades</p>
              </div>
              <ToggleSwitch
                enabled={settings.weeklyReport}
                onChange={(value) => updateSetting('weeklyReport', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Relatório Mensal</h3>
                <p className="text-sm text-gray-600">Receba resumo mensal das atividades</p>
              </div>
              <ToggleSwitch
                enabled={settings.monthlyReport}
                onChange={(value) => updateSetting('monthlyReport', value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Alertas Específicos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas Específicos</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Alerta de Novas Inscrições</h3>
                <p className="text-sm text-gray-600">Notificar quando houver novas inscrições</p>
              </div>
              <ToggleSwitch
                enabled={settings.newRegistrations}
                onChange={(value) => updateSetting('newRegistrations', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Alerta de Novos Pedidos</h3>
                <p className="text-sm text-gray-600">Notificar quando houver novos pedidos na loja</p>
              </div>
              <ToggleSwitch
                enabled={settings.newOrders}
                onChange={(value) => updateSetting('newOrders', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Alerta de Novos Contatos</h3>
                <p className="text-sm text-gray-600">Notificar quando houver novos contatos</p>
              </div>
              <ToggleSwitch
                enabled={settings.newContacts}
                onChange={(value) => updateSetting('newContacts', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Alerta de Novos Comentários</h3>
                <p className="text-sm text-gray-600">Notificar quando houver novos comentários</p>
              </div>
              <ToggleSwitch
                enabled={settings.newComments}
                onChange={(value) => updateSetting('newComments', value)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Alerta de Novos Usuários</h3>
                <p className="text-sm text-gray-600">Notificar quando houver novos usuários</p>
              </div>
              <ToggleSwitch
                enabled={settings.newUsers}
                onChange={(value) => updateSetting('newUsers', value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Autenticação de Dois Fatores</h3>
                <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
              </div>
              <ToggleSwitch
                enabled={settings.twoFactorEnabled}
                onChange={(value) => updateSetting('twoFactorEnabled', value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
