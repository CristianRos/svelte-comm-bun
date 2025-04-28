import { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private"
import { v2 } from "cloudinary"

export async function deleteUnusedCloudinaryImages(images: string[]){
    v2.config({
        cloud_name: VITE_CLOUDINARY_CLOUD_NAME,
        api_key: VITE_CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true
    })
    images.forEach((img) => {
        v2.uploader.destroy(img)
    })
}

