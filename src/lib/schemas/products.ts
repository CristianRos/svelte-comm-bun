import { z } from "zod";

export const createProductSchema = z.object({
    product_group_id: z.number()
        .int('Invalid group ID')
        .optional(),
    name: z.string()
        .min(1, "Product name is required"),
    description: z.string()
        .optional(),
    use_group_description: z.boolean()
        .optional(),
    price: z.number()
        .int()
        .min(0, "Price must be a non-negative integer"),
    stock: z.number()
        .int()
        .min(0, "Stock must be a non-negative integer"),
    images: z.string()
        .min(1, "At least one image is required")
        .array()
        .max(5, "Cannot upload more than 5 images"),
})

export const createProductGroupSchema = z.object({
    name: z.string()
        .min(1, 'Product group name is required'),
    description: z.string()
        .optional(),
    products: z.array(createProductSchema)
        .min(1, "At least one product is required"),
})


export type createProductType = z.infer<typeof createProductSchema>