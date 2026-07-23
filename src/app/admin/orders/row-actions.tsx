'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react'

export function OrderRowActions({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 1000)
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="relative" 
      data-state={isOpen ? 'open' : 'closed'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center p-1.5 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-brand-white border border-brand-border rounded-lg shadow-xl z-10 py-1 animate-scale-in">
          <Link
            href={`/admin/orders/${id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-brand-black hover:bg-brand-cream"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </Link>
          <Link
            href={`/admin/orders/${id}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-brand-black hover:bg-brand-cream"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Order
          </Link>
          <Link
            href={`/admin/orders/${id}/delete`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-brand-danger hover:bg-brand-danger/10"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Link>
        </div>
      )}
    </div>
  )
}
