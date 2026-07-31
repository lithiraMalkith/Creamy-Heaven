'use client'

import { useState, useTransition } from 'react'
import { addToCartAction } from '@/app/(storefront)/cart/actions'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    slug: string
    image?: string
  }
  compact?: boolean
  quantity?: number
  disabled?: boolean
}

// Hoist formatter outside the component to avoid re-creating on every render
const formatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
})

export function AddToCartButton({ product, compact = false, quantity = 1, disabled = false }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Show "Added" feedback immediately (optimistic UI)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)

    // Run the server action in a non-blocking transition —
    // the UI stays responsive while the mutation happens in the background
    startTransition(async () => {
      try {
        await addToCartAction({
          productId: product.id,
          name: product.name,
          price: product.price,
          slug: product.slug,
          image: product.image,
          quantity,
        })
      } catch (error) {
        console.error('Failed to add to cart', error)
        setAdded(false)
      }
    })
  }

  if (disabled) {
    if (compact) {
      return (
        <button 
          disabled
          className="w-10 h-10 rounded-full bg-brand-cream text-brand-black/40 border border-brand-border flex items-center justify-center cursor-not-allowed"
          aria-label="Out of stock"
          title="Out of stock"
        >
          <span className="material-symbols-outlined text-[18px]">remove_shopping_cart</span>
        </button>
      )
    }

    return (
      <button 
        disabled
        className="flex-1 w-full bg-brand-cream/60 text-brand-black/50 border border-brand-border px-8 py-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 cursor-not-allowed font-bold"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">block</span>
        Out of Stock
      </button>
    )
  }

  if (compact) {
    return (
      <button 
        onClick={handleAdd}
        disabled={isPending}
        className={`w-10 h-10 rounded-full text-surface-container-lowest flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${added ? 'bg-brand-success' : 'bg-brand-black'} ${isPending ? 'opacity-70 cursor-wait' : ''}`}
        aria-label="Add to cart"
      >
        <span className="material-symbols-outlined text-[20px]">
          {added ? 'check' : isPending ? 'hourglass_empty' : 'add_shopping_cart'}
        </span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={isPending}
      className={`flex-1 w-full text-brand-white transition-all duration-300 px-8 py-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-[1.02] ${added ? 'bg-brand-success hover:bg-brand-success' : 'bg-brand-black hover:bg-surface-tint'} ${isPending ? 'opacity-70 cursor-wait' : ''}`}
      type="button"
    >
      <span className="material-symbols-outlined text-[20px]">
        {added ? 'check' : isPending ? 'hourglass_empty' : 'shopping_cart'}
      </span>
      {added ? 'Added to Cart' : isPending ? 'Adding...' : `Add to Cart - ${formatter.format(product.price * quantity)}`}
    </button>
  )
}
