// import { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private"
import { v2 } from "cloudinary"
import 'dotenv/config'

export async function deleteUnusedCloudinaryImages(images: string[]){
    v2.config({
        cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.VITE_CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    })
    images.forEach((img) => {
        v2.uploader.destroy(img)
    })
}

