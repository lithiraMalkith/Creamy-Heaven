import Link from 'next/link'
import { Search, Mail, MailOpen } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchMessages } from '@/lib/data/messages'
import { formatDate, truncate } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
  { label: 'Replied', value: 'replied' },
  { label: 'Archived', value: 'archived' },
]

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; flash?: string }> }) {
  await requirePermission('messages:read')
  const { q, status, flash } = await searchParams
  const messages = await fetchMessages({ q, status })

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-semibold text-brand-black">Messages</h1>
        <p className="text-brand-muted text-sm mt-1">{messages.length} messages</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = (status ?? 'all') === tab.value
          const params = new URLSearchParams()
          if (tab.value !== 'all') params.set('status', tab.value)
          if (q) params.set('q', q)
          const href = `/admin/messages${params.toString() ? '?' + params.toString() : ''}`

          return (
            <Link key={tab.value} href={href} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${isActive ? 'bg-brand-black text-brand-white border-brand-black' : 'bg-brand-white text-brand-muted border-brand-border hover:text-brand-black'}`}>
              {tab.label}
            </Link>
          )
        })}
      </div>

      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        {status && <input type="hidden" name="status" value={status} />}
        <input type="text" name="q" defaultValue={q ?? ''} placeholder="Search messages..." className="form-input !pl-10" />
      </form>

      <div className="animate-in-stagger space-y-2">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/admin/messages/${msg.id}`}
            className={`block bg-brand-white rounded-xl border border-brand-border p-4 card-hover ${msg.status === 'unread' ? 'border-l-4 border-l-brand-warning' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${msg.status === 'unread' ? 'bg-brand-warning/10 text-brand-warning' : 'bg-brand-cream text-brand-muted'}`}>
                {msg.status === 'unread' ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${msg.status === 'unread' ? 'font-semibold text-brand-black' : 'font-medium text-brand-black-soft'}`}>{msg.name}</p>
                  <span className="text-xs text-brand-muted tabular-nums">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-sm font-medium text-brand-black mt-0.5">{msg.subject}</p>
                <p className="text-xs text-brand-muted mt-1 line-clamp-1">{truncate(msg.body, 120)}</p>
              </div>
            </div>
          </Link>
        ))}
        {messages.length === 0 && (
          <p className="text-center py-12 text-brand-muted text-sm">No messages found</p>
        )}
      </div>
    </div>
  )
}
