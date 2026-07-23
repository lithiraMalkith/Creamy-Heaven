import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Upload an image to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'creamy-heaven'
): Promise<string> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
    {
      folder,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto', format: 'auto' },
      ],
    }
  )
  return result.secure_url
}

/**
 * Delete an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
