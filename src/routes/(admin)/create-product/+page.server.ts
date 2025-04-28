import { auth } from "$lib/auth"
import { createProductSchema } from "$lib/schemas/products"
import { redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { type Actions } from "@sveltejs/kit"
import { createProduct } from "$lib/server/services/product"
import { deleteUnusedCloudinaryImages } from "$lib/server/utils/cloudinary"

export const load = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (session) {
        throw redirect(302, '/')
    }

    const form = await superValidate(zod(createProductSchema));

    return { form };
};

export const actions = {
	default: async ({request}) => {
        const data = await request.formData();
        const allImages: string[] = (data.get('allImages') as string)
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0);
        
        const form = await superValidate(data, zod(createProductSchema));

        const unusedImages = allImages.filter((id) => !form.data.images.includes(id));
        deleteUnusedCloudinaryImages(unusedImages)

        const result = await createProduct(form.data)
        return result
	},
} satisfies Actions;
