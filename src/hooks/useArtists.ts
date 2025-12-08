import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'

export interface Artist {
  id: string
  name: string
  artisticName?: string
  area: string
  description: string
  email: string
  phone: string
  image?: string
  role?: string
  showInPublic?: boolean
  createdAt?: string
  updatedAt?: string
}

export function useArtists(showAll: boolean = false) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const url = showAll ? `${API_URL}/artists?showAll=true` : `${API_URL}/artists`
        const headers = showAll && token ? { Authorization: `Bearer ${token}` } : {}
        
        const response = await fetch(url, { headers })
        
        if (!response.ok) {
          throw new Error('Erro ao buscar artistas')
        }

        const data = await response.json()
        setArtists(data.artists || data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setArtists([])
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [showAll])

  return { artists, loading, error }
}
