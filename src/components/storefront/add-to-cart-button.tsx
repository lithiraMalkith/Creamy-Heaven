'use client'

import { useState } from 'react'
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
}

export function AddToCartButton({ product, compact = false, quantity = 1 }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    try {
      await addToCartAction({
        productId: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        image: product.image,
        quantity,
      })
      
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart', error)
      alert('Could not add item to cart. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

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
