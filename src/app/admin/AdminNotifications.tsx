'use client'

/**
 * AdminNotifications — the one documented Client Component exception.
 * This is intentionally a client component with real client-runtime logic:
 * - Polls /api/admin/pending-count every 30s
 * - Plays a Web Audio beep on new pending orders
 * - Everything it renders is otherwise presentational; keep it small and isolated
 *
 * Do NOT remove 'use client' — see SKILL.md section 0, allow-list item 3.
 */

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

export function AdminNotifications() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const prevCount = useRef(0)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/admin/pending-count')
        if (res.ok) {
          const data = await res.json()
          const newCount = data.count ?? 0

          // Play beep if count increased
          if (newCount > prevCount.current && prevCount.current > 0) {
            playBeep()
          }
          prevCount.current = newCount
          setCount(newCount)
        }
      } catch {
        // Silently fail — the notification bell is non-critical
      }
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  function playBeep() {
    try {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 880
      oscillator.type = 'sine'
      gain.gain.value = 0.1
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.15)
    } catch {
      // Web Audio not available
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-scale-in absolute right-0 top-full mt-2 w-64 bg-brand-white border border-brand-border rounded-xl shadow-xl z-50 py-3 px-4">
          <p className="text-sm font-semibold text-brand-black mb-2">
            Pending Orders
          </p>
          {count > 0 ? (
            <a
              href="/admin/orders?status=pending"
              className="block text-sm text-brand-black-soft hover:text-brand-black"
              onClick={() => setOpen(false)}
            >
              You have <span className="font-semibold text-brand-warning">{count}</span> pending
              {count === 1 ? ' order' : ' orders'} awaiting confirmation.
            </a>
          ) : (
            <p className="text-sm text-brand-muted">
              No pending orders right now.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
