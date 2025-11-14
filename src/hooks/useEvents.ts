'use client'

import { useState, useEffect } from 'react'

export interface Event {
  id: number | string
  title: string
  date: string
  time: string
  location: string
  description: string
  category: string
  image: string
  attendees?: number
  availableSpots?: number
  fullDescription?: string
  images?: string[]
  isPast?: boolean
}

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar: string
  eventId: number
  rating: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const eventsRes = await fetch(`${API_BASE_URL}/events`)

        if (!eventsRes.ok) {
          throw new Error('Falha ao buscar eventos')
        }

        const eventsData = await eventsRes.json()

        // Extract events array from API response
        const events = eventsData.events || eventsData || []

        // Map API fields to Event interface
        const mappedEvents: Event[] = events.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
          category: event.category,
          image: event.image,
          attendees: event.attendees,
          availableSpots: event.available_spots,
          fullDescription: event.full_description,
          images: event.images,
          isPast: event.status === 'completed'
        }))

        setEvents(mappedEvents)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getEvents = (): Event[] => {
    return events
  }

  const getEventById = (id: number | string): Event | undefined => {
    return events.find(event => event.id === id || event.id === parseInt(String(id)))
  }

  const getEventsByCategory = (category: string): Event[] => {
    return events.filter(event => event.category === category)
  }

  const getUpcomingEvents = (): Event[] => {
    return events.filter(event => !event.isPast)
  }

  const getPastEvents = (): Event[] => {
    return events.filter(event => event.isPast)
  }

  const getTestimonials = (): Testimonial[] => {
    return testimonials
  }

  const getTestimonialsByEventId = (eventId: number): Testimonial[] => {
    return testimonials.filter(t => t.eventId === eventId)
  }

  const searchEvents = (query: string): Event[] => {
    const lowerQuery = query.toLowerCase()
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.category.toLowerCase().includes(lowerQuery)
    )
  }

  const getEventsByMonth = (month: number, year: number): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
  }

  return {
    getEvents,
    getEventById,
    getEventsByCategory,
    getUpcomingEvents,
    getPastEvents,
    getTestimonials,
    getTestimonialsByEventId,
    searchEvents,
    getEventsByMonth,
    loading,
    error
  }
}
