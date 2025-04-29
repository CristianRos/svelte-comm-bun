import { v2 } from "cloudinary";
import { db } from "../db";
import { productImages } from "../db/schema";
import type { CloudinaryResource } from "@cloudinary-util/types";
import { gte } from "drizzle-orm";
import 'dotenv/config'

v2.config({
    cloud_name: process.env.VITE_CLOUDINARY_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

async function runCleanup() {
    console.log("Scheduled cleanup task started...")

    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        const cloudinaryImages = await v2.search
            .expression('uploaded_at>1w AND resource_type:image')
            .execute()
        
        const cloudinaryResources = cloudinaryImages.resources as CloudinaryResource[]

        cloudinaryResources.map((res) => {
            console.log('Created at: ', res.created_at, 'Public ID: ', res.public_id)
        })

        const dbImages = await db.select({url: productImages.url})
            .from(productImages)
            .where(gte(productImages.createdAt, weekAgo))

        const dbImagesSet = new Set(dbImages.map((row) => row.url).filter((url): url is string => typeof url === 'string' && url.length > 0));
        
        console.log('DB Images: ', dbImages);

        const filteredImages = cloudinaryResources.filter((res) => !dbImagesSet.has(res.public_id));


        filteredImages.forEach((img) => {
            console.log('Filtered: ', img.public_id);
            v2.uploader.destroy(img.public_id)
        })
        
    } catch(e){
        console.error('Error during scheduled cleanup task: ', e)
        process.exit(1);
    }
}

runCleanup();