import { useState, useEffect } from 'react'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  category: 'magazine' | 'story' | 'article' | 'poetry' | 'drama' | 'other'
  author_id: string
  author_name: string
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  published_at?: string
  created_at: string
  updated_at: string
}

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (category?: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')
      const url = category
        ? `${apiUrl}/blog?category=${category}`
        : `${apiUrl}/blog`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch posts')

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchPostBySlug = async (slug: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/blog/slug/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch post')

      const data = await response.json()
      return data.post
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/blog/search/${query}`)
      if (!response.ok) throw new Error('Failed to search posts')

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, loading, error, fetchPosts, fetchPostBySlug, searchPosts }
}
