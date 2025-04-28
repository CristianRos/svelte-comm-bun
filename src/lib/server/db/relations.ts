import { relations } from "drizzle-orm/relations";
import * as schema from './schema'
import * as authSchema from '../../../../auth-schema'

export const userProfileRelations = relations(schema.userProfile, ({one}) => ({
	user: one(authSchema.user, {
		fields: [schema.userProfile.userId],
		references: [authSchema.user.id]
	}),
}));

export const userRelations = relations(authSchema.user, ({many}) => ({
	userProfiles: many(schema.userProfile),
	accounts: many(authSchema.account),
	sessions: many(authSchema.session),
}));

export const accountRelations = relations(authSchema.account, ({one}) => ({
	user: one(authSchema.user, {
		fields: [authSchema.account.userId],
		references: [authSchema.user.id]
	}),
}));

export const sessionRelations = relations(authSchema.session, ({one}) => ({
	user: one(authSchema.user, {
		fields: [authSchema.session.userId],
		references: [authSchema.user.id]
	}),
}));
