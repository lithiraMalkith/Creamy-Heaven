'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { productSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { uploadImage } from '@/lib/cloudinary'

export async function createProduct(formData: FormData) {
  const session = await requirePermission('products:write')

  const raw = Object.fromEntries(formData)
  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = encodeURIComponent(
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Validation failed'
    )
    redirect(`/admin/products/new?flash=error:${msg}`)
  }

  const now = new Date()
  const slug = slugify(parsed.data.name)

  // Determine availability status from stock
  const stockQty = parsed.data.stockQty
  const availabilityStatus =
    stockQty === 0 ? 'out_of_stock' : stockQty <= 10 ? 'low_stock' : 'in_stock'

  const imageFile = formData.get('image') as File | null
  const images: string[] = []

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const url = await uploadImage(buffer)
    images.push(url)
  }

  await adminDb.collection('products').add({
    ...parsed.data,
    slug,
    availabilityStatus,
    images,
    createdBy: session.uid,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/admin/products')
  redirect('/admin/products?flash=success:Product created')
}

export async function updateProduct(id: string, formData: FormData) {
  await requirePermission('products:write')

  const raw = Object.fromEntries(formData)
  const parsed = productSchema.partial().safeParse(raw)
  if (!parsed.success) {
    const msg = encodeURIComponent('Validation failed')
    redirect(`/admin/products/${id}/edit?flash=error:${msg}`)
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date(),
  }

  // Recalculate availability if stock changed
  if (data.stockQty !== undefined) {
    updateData.availabilityStatus =
      data.stockQty === 0 ? 'out_of_stock' : data.stockQty <= 10 ? 'low_stock' : 'in_stock'
  }

  // Recalculate slug if name changed
  if (data.name) {
    updateData.slug = slugify(data.name)
  }

  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const url = await uploadImage(buffer)
    updateData.images = [url]
  }

  await adminDb.collection('products').doc(id).update(updateData)

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  redirect(`/admin/products/${id}?flash=success:Product updated`)
}

export async function deleteProduct(id: string) {
  await requirePermission('products:delete')

  const doc = await adminDb.collection('products').doc(id).get()
  if (!doc.exists) {
    redirect('/admin/products?flash=error:Product not found')
  }

  await adminDb.collection('products').doc(id).delete()

  revalidatePath('/admin/products')
  redirect('/admin/products?flash=success:Product deleted')
}
