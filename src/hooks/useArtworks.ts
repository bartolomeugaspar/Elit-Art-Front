import { useState, useEffect } from 'react'

export interface Artwork {
  id: string
  title: string
  description: string
  artist_id: string
  artist_name: string
  type: 'painting' | 'sculpture' | 'photography' | 'digital' | 'mixed_media' | 'other'
  year: number
  dimensions?: string
  medium?: string
  image_url: string
  gallery_images?: string[]
  price?: number
  is_available: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchArtworks = async (type?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = type
        ? `${process.env.NEXT_PUBLIC_API_URL}/artworks?type=${type}`
        : `${process.env.NEXT_PUBLIC_API_URL}/artworks`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch artworks')

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedArtworks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artworks/featured`)
      if (!response.ok) throw new Error('Failed to fetch featured artworks')

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const searchArtworks = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artworks/search/${query}`)
      if (!response.ok) throw new Error('Failed to search artworks')

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtworks()
  }, [])

  return { artworks, loading, error, fetchArtworks, fetchFeaturedArtworks, searchArtworks }
}
