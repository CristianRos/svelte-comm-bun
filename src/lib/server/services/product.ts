import { createProductSchema, type createProductType } from "$lib/schemas/products";
import { z } from "zod";
import { db } from "../db";
import { type ProductInsertModel, product, type ProductImagesInsertModel, productImages } from "../db/schema";

export async function createProduct(data: createProductType){
    try{
        const validatedData = createProductSchema.parse(data)
        
        const result = await db.transaction(async (tx) => {
            const productToInsert: ProductInsertModel = {...validatedData}
            console.log(productToInsert)
            const createdProducts = await tx.insert(product)
                .values(productToInsert)
                .returning({ id: product.id, name: product.name })

            if (!createdProducts || createdProducts.length === 0) {
                // This is a safeguard; returning() should give results on success
                tx.rollback();
                throw new Error("Failed to retrieve created product ID.");
            }

            const productImagesToInsert: ProductImagesInsertModel[] = validatedData.images.map((public_id, idx) => ({
                product_id: createdProducts[0].id,
                url: public_id,
                altText: `${validatedData.name} - Image ${idx + 1}`,
                order: idx,
            }))

            await tx.insert(productImages)
                .values(productImagesToInsert)
            
            return createdProducts[0]
        })

        return result
    } catch(e){
        if(e instanceof z.ZodError){
            console.error("Validation error: ", e.errors)
            throw new Error("Invalid product data provided")
        }
        console.error("Database transaction error: ", e)
        throw new Error("Failed to create product and images")
    }
}