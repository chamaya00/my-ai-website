'use client'

import { SearchResult } from '@/app/page'
import { ExternalLink, ShoppingBag } from 'lucide-react'

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-primary-600" />
        Similar Items Found ({results.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((result, idx) => (
          <a
            key={idx}
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              {result.image ? (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-slate-300" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm">
                {result.source}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {result.title}
              </h3>

              {result.snippet && (
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                  {result.snippet}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  {result.price}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No results found. Try analyzing another image.</p>
        </div>
      )}
    </div>
  )
}
