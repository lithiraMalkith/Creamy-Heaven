'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { categorySchema, subCategorySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function createCategory(formData: FormData) {
  await requirePermission('categories:write')

  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse(raw)
  if (!parsed.success) {
    const msg = encodeURIComponent(Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Validation failed')
    redirect(`/admin/categories/new?flash=error:${msg}`)
  }

  const now = new Date()
  await adminDb.collection('categories').add({
    ...parsed.data,
    slug: slugify(parsed.data.name),
    subCategories: [],
    order: parsed.data.order ?? 0,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/admin/categories')
  redirect('/admin/categories?flash=success:Category created')
}

export async function updateCategory(id: string, formData: FormData) {
  await requirePermission('categories:write')

  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse(raw)
  if (!parsed.success) {
    const msg = encodeURIComponent('Validation failed')
    redirect(`/admin/categories/${id}/edit?flash=error:${msg}`)
  }

  await adminDb.collection('categories').doc(id).update({
    ...parsed.data,
    slug: slugify(parsed.data.name),
    updatedAt: new Date(),
  })

  revalidatePath('/admin/categories')
  revalidatePath(`/admin/categories/${id}`)
  redirect(`/admin/categories/${id}?flash=success:Category updated`)
}

export async function deleteCategory(id: string) {
  await requirePermission('categories:delete')

  const doc = await adminDb.collection('categories').doc(id).get()
  if (!doc.exists) redirect('/admin/categories?flash=error:Category not found')

  await adminDb.collection('categories').doc(id).delete()

  revalidatePath('/admin/categories')
  redirect('/admin/categories?flash=success:Category deleted')
}

export async function addSubCategory(categoryId: string, formData: FormData) {
  await requirePermission('categories:write')

  const raw = Object.fromEntries(formData)
  const parsed = subCategorySchema.safeParse(raw)
  if (!parsed.success) {
    redirect(`/admin/categories/${categoryId}?flash=error:Invalid sub-category`)
  }

  const doc = await adminDb.collection('categories').doc(categoryId).get()
  if (!doc.exists) redirect('/admin/categories?flash=error:Category not found')

  const subCategories = doc.data()!.subCategories ?? []
  const newSub = {
    id: `sub_${Date.now()}`,
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description,
  }

  await adminDb.collection('categories').doc(categoryId).update({
    subCategories: [...subCategories, newSub],
    updatedAt: new Date(),
  })

  revalidatePath(`/admin/categories/${categoryId}`)
  redirect(`/admin/categories/${categoryId}?flash=success:Sub-category added`)
}

export async function removeSubCategory(categoryId: string, subId: string) {
  await requirePermission('categories:write')

  const doc = await adminDb.collection('categories').doc(categoryId).get()
  if (!doc.exists) redirect('/admin/categories?flash=error:Category not found')

  const subCategories = (doc.data()!.subCategories ?? []).filter(
    (sub: { id: string }) => sub.id !== subId
  )

  await adminDb.collection('categories').doc(categoryId).update({
    subCategories,
    updatedAt: new Date(),
  })

  revalidatePath(`/admin/categories/${categoryId}`)
  redirect(`/admin/categories/${categoryId}?flash=success:Sub-category removed`)
}
