import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchMessage } from '@/lib/data/messages'
import { deleteMessage } from '../../actions'

export default async function DeleteMessagePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('messages:delete')
  const { id } = await params
  const message = await fetchMessage(id)
  if (!message) notFound()
  const deleteWithId = deleteMessage.bind(null, id)

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-scale-in max-w-sm w-full bg-brand-white border border-brand-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-brand-black">Delete message?</h2>
        <p className="text-brand-muted text-sm">Message from <strong>{message.name}</strong>: &ldquo;{message.subject}&rdquo;</p>
        <div className="flex gap-3">
          <a href="/admin/messages" className="btn-hover flex-1 text-center px-4 py-2 border border-brand-border rounded-lg text-brand-black hover:bg-brand-cream">Cancel</a>
          <form action={deleteWithId} className="flex-1"><button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-danger text-white rounded-lg">Delete</button></form>
        </div>
      </div>
    </div>
  )
}
