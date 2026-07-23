import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { parseFlash } from '@/lib/utils'

/**
 * Server Component that reads a flash message from searchParams
 * and renders it with CSS auto-dismiss animation.
 * No setTimeout, no client state — pure CSS .animate-toast-fade.
 */
export function FlashMessage({ value }: { value?: string }) {
  const flash = parseFlash(value)
  if (!flash) return null

  return (
    <div
      className={`animate-toast-fade fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border shadow-lg ${
        flash.type === 'success'
          ? 'bg-brand-white text-brand-success border-brand-border'
          : flash.type === 'error'
            ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/30'
            : 'bg-brand-cream text-brand-black border-brand-border'
      }`}
    >
      {flash.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
      {flash.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
      {flash.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
      <span>{flash.message}</span>
    </div>
  )
}
