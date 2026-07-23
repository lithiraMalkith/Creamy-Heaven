'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'

export function ImageUploadPreview({ name = 'image', defaultPreviewUrl = null }: { name?: string, defaultPreviewUrl?: string | null }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultPreviewUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleClear = () => {
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="mt-1">
      <input
        type="file"
        name={name}
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative inline-block border border-brand-border rounded-lg overflow-hidden group">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full max-w-sm h-auto object-cover max-h-64" 
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-sm h-48 border-2 border-dashed border-brand-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ImagePlus className="w-8 h-8 text-brand-muted mb-2" />
          <span className="text-sm font-medium text-brand-black">Click to upload image</span>
          <span className="text-xs text-brand-muted mt-1">PNG, JPG, WEBP up to 5MB</span>
        </button>
      )}
    </div>
  )
}
