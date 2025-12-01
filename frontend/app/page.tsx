'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ClothingAnalysis from '@/components/ClothingAnalysis'
import SearchResults from '@/components/SearchResults'
import { Sparkles } from 'lucide-react'

export interface ClothingFeatures {
  type: string
  color: string[]
  style: string[]
  pattern: string
  material: string
  brand?: string
  description: string
}

export interface SearchResult {
  title: string
  price: string
  link: string
  image: string
  source: string
  snippet?: string
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ClothingFeatures | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData)
    setAnalysis(null)
    setSearchResults([])
    setIsAnalyzing(true)

    try {
      // Send image to backend for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }))
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data.features)
    } catch (error) {
      console.error('Error analyzing image:', error)
      alert(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSearch = async () => {
    if (!analysis) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: analysis }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Search failed' }))
        throw new Error(errorData.error || 'Search failed')
      }

      const data = await response.json()
      setSearchResults(data.results)
    } catch (error) {
      console.error('Error searching:', error)
      alert(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-primary-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            AI Clothing Finder
          </h1>
        </div>
        <p className="text-xl text-slate-600">
          Upload a photo of clothing you love, and we'll find similar items online
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <ImageUpload
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
          />
        </div>

        <div>
          <ClothingAnalysis
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <SearchResults results={searchResults} />
      )}
    </main>
  )
}
