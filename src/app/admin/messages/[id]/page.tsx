import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Mail, Phone } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchMessage } from '@/lib/data/messages'
import { formatDateLong } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'
import { updateMessageStatus } from '../actions'

export default async function ViewMessagePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('messages:read')
  const { id } = await params
  const { flash } = await searchParams
  const message = await fetchMessage(id)
  if (!message) notFound()

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/messages" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-heading text-xl font-semibold text-brand-black">{message.subject}</h1>
        </div>
        <Link href={`/admin/messages/${id}/delete`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-sm text-brand-danger">
          <Trash2 className="w-4 h-4" /> Delete
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message body */}
        <div className="lg:col-span-2 bg-brand-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-border">
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-sm font-semibold text-brand-black">
              {message.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-brand-black">{message.name}</p>
              <p className="text-xs text-brand-muted">{formatDateLong(message.createdAt)}</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-brand-black-soft leading-relaxed whitespace-pre-wrap">
            {message.body}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">Contact</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-brand-black-soft"><Mail className="w-3.5 h-3.5 text-brand-muted" /> {message.email}</div>
              {message.phone && <div className="flex items-center gap-2 text-brand-black-soft"><Phone className="w-3.5 h-3.5 text-brand-muted" /> {message.phone}</div>}
            </div>
          </div>

          {/* Status update */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">Status</h2>
            <p className="text-sm text-brand-black mb-3 capitalize">{message.status}</p>
            <form action={updateMessageStatus} className="space-y-2">
              <input type="hidden" name="messageId" value={message.id} />
              <select name="status" defaultValue={message.status} className="form-select">
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">Update Status</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
