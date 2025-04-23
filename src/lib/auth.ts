import { betterAuth } from "better-auth";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import * as schema from './server/db/schema'
import * as authSchema from '../../auth-schema'

export const auth = betterAuth({
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
            ...authSchema,
        }
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    }
});