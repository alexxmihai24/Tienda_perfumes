import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `products/${productSlug}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('azahara')
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('azahara').getPublicUrl(path)
  return data.publicUrl
}
