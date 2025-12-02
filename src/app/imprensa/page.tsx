'use client'

import { useState, useEffect } from 'react'
import { Download, Newspaper, FileText, Mail } from 'lucide-react'
import Image from 'next/image'
import { Header, Footer } from '@/components'

interface PressRelease {
  id: string
  title: string
  summary: string
  content: string
  image_url?: string
  publication_date: string
  author: string
}

interface MediaKit {
  id: string
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  downloads: number
}

export default function ImprensaPage() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
        apiUrl = apiUrl.replace(/\/$/, '')
        
        const [releasesRes, kitsRes] = await Promise.all([
          fetch(`${apiUrl}/press/releases`),
          fetch(`${apiUrl}/press/media-kit`),
        ])

        if (releasesRes.ok) {
          const data = await releasesRes.json()
          setReleases(data.releases || [])
        }

        if (kitsRes.ok) {
          const data = await kitsRes.json()
          setMediaKits(data.kits || [])
        }
      } catch (err) {
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownload = async (kitId: string) => {
    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api'
      apiUrl = apiUrl.replace(/\/$/, '')
      
      await fetch(`${apiUrl}/press/media-kit/${kitId}/download`, {
        method: 'POST',
      })
    } catch (err) {
    }
  }

  return (
    <div className="min-h-screen bg-elit-light">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-r from-elit-dark via-elit-red to-elit-orange">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-elit-light mb-3 md:mb-4 flex items-center gap-3">
              <Newspaper size={40} />
              Área de Imprensa
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-elit-light/90">Press Releases, Kit de Imprensa e Informações para Jornalistas</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
            {/* Media Kit Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Download size={30} className="text-elit-red" />
                Kit de Imprensa
              </h2>

              {mediaKits.length === 0 ? (
                <p className="text-gray-600">Nenhum kit de imprensa disponível</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaKits.map((kit) => (
                    <div key={kit.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText size={32} className="text-elit-red" />
                          <div>
                            <h3 className="font-bold text-lg text-elit-dark">{kit.title}</h3>
                            <p className="text-sm text-elit-dark/60">{kit.file_type.toUpperCase()}</p>
                          </div>
                        </div>
                        <span className="text-sm text-elit-dark/60">
                          {(kit.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>

                      <p className="text-elit-dark/70 mb-4">{kit.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-elit-dark/60">
                          {kit.downloads} downloads
                        </span>
                        <a
                          href={kit.file_url}
                          onClick={() => handleDownload(kit.id)}
                          download
                          className="px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition flex items-center gap-2"
                        >
                          <Download size={18} />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Press Releases Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Newspaper size={30} className="text-elit-red" />
                Press Releases
              </h2>

              {releases.length === 0 ? (
                <p className="text-gray-600">Nenhum press release disponível</p>
              ) : (
                <div className="space-y-6">
                  {releases.map((release) => (
                    <div key={release.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {release.image_url && (
                          <div className="relative h-48 md:h-full bg-gray-200">
                            <Image
                              src={release.image_url}
                              alt={release.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className={`p-6 flex flex-col justify-between ${release.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                          <div>
                            <p className="text-sm text-elit-dark/60 mb-2">
                              {new Date(release.publication_date).toLocaleDateString('pt-BR')}
                            </p>
                            <h3 className="text-2xl font-bold mb-3 text-elit-dark">{release.title}</h3>
                            <p className="text-elit-dark/70 mb-4">{release.summary}</p>
                            <p className="text-elit-dark/60 text-sm">Por {release.author}</p>
                          </div>

                          <button className="mt-4 px-4 py-2 bg-elit-red text-white rounded-lg hover:bg-elit-brown transition w-fit">
                            Ler Completo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Contact Section */}
            <section className="mt-12 bg-elit-light rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Contato para Imprensa</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas, entrevistas ou informações adicionais, entre em contato conosco:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:imprensa@elit-arte.com" className="text-elit-red hover:underline">
                    imprensa@elit-arte.com
                  </a>
                </p>
                <p>
                  <strong>Telefone:</strong> +244 (0) 912 345 678
                </p>
              </div>
            </section>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
