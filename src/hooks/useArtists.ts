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
  createdAt?: string
  updatedAt?: string
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/artists`)
        
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
  }, [])

  return { artists, loading, error }
}
