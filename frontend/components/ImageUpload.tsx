'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void
  uploadedImage: string | null
}

export default function ImageUpload({ onImageUpload, uploadedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      onImageUpload(imageData)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleClear = () => {
    onImageUpload('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <ImageIcon className="w-6 h-6 text-primary-600" />
        Upload Clothing Image
      </h2>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          className="hidden"
        />

        {uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded clothing"
              className="max-h-96 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="py-12">
            <Upload className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              Drop your image here or click to browse
            </p>
            <p className="text-sm text-slate-500">
              PNG, JPG up to 10MB
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500 mt-4">
        Upload a clear photo of a clothing item you like. Our AI will analyze it and find similar items online.
      </p>
    </div>
  )
}
