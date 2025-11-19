import { useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  description: string
  category: 'book' | 'magazine' | 'ticket' | 'merchandise'
  price: number
  discount_price?: number
  image_url: string
  stock: number
  sku: string
  author?: string
  isbn?: string
  pages?: number
  publication_date?: string
  digital_url?: string
  is_digital: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (category?: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')
      const url = category
        ? `${apiUrl}/products?category=${category}`
        : `${apiUrl}/products`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/products/search/${query}`)
      if (!response.ok) throw new Error('Failed to search products')

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, error, fetchProducts, searchProducts }
}
