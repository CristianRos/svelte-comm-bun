import { relations } from "drizzle-orm/relations";
import { user, userProfile, account, session } from "./schema";

export const userProfileRelations = relations(userProfile, ({one}) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	userProfiles: many(userProfile),
	accounts: many(account),
	sessions: many(session),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));