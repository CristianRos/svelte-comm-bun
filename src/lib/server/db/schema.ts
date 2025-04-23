import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

import { user as authUser } from '../../../../auth-schema';
import { relations } from 'drizzle-orm';

export const userProfile = pgTable('user_profile', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => authUser.id, { onDelete: 'cascade' }),
	age: integer('age'),
});

// Relations

export const userProfilesRelations = relations(userProfile, ({ one }) => ({
	user: one(authUser, {
		fields: [userProfile.userId],
		references: [authUser.id],
	}),
}));