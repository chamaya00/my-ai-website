'use client'

import { ClothingFeatures } from '@/app/page'
import { Loader2, Search, Sparkles } from 'lucide-react'

interface ClothingAnalysisProps {
  analysis: ClothingFeatures | null
  isAnalyzing: boolean
  onSearch: () => void
  isSearching: boolean
}

export default function ClothingAnalysis({
  analysis,
  isAnalyzing,
  onSearch,
  isSearching
}: ClothingAnalysisProps) {
  return (
    <div className="card h-full">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary-600" />
        AI Analysis
      </h2>

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-slate-600">Analyzing your clothing item...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Description</p>
            <p className="text-slate-900">{analysis.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Type</p>
              <p className="font-medium text-slate-900">{analysis.type}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Pattern</p>
              <p className="font-medium text-slate-900">{analysis.pattern}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Colors</p>
              <div className="flex flex-wrap gap-1">
                {analysis.color.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white rounded text-sm font-medium text-slate-900 border border-slate-200"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Material</p>
              <p className="font-medium text-slate-900">{analysis.material}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Style Keywords</p>
            <div className="flex flex-wrap gap-2">
              {analysis.style.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {analysis.brand && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Detected Brand</p>
              <p className="font-medium text-slate-900">{analysis.brand}</p>
            </div>
          )}

          <button
            onClick={onSearch}
            disabled={isSearching}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Similar Items
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500">
            Upload an image to see AI analysis
          </p>
        </div>
      )}
    </div>
  )
}
