import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { loginSchema } from "$lib/schemas/auth";
import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";

export const load = async ({ request }) => {
    const pageType = 'login'
    
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (session) {
        throw redirect(302, '/')
    }

    const form = await superValidate(zod(loginSchema));

    return { form, pageType };
};
