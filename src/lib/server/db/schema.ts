import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { user as authUser } from '../../../../auth-schema';

// USER

export const userProfile = pgTable('user_profile', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => authUser.id, { onDelete: 'cascade' }),
	age: integer('age'),
});

// PRODUCTS

export const productGroup = pgTable('product_group', {
	id: serial('id').primaryKey(),
	name: text('name'),
	description: text('description'),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow(),
})

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	group_id: serial('group_id')
		.references(() => productGroup.id, { onDelete: 'cascade' }),
	name: text('name')
		.notNull()
		.unique(),
	description: text('description'),
	use_group_description: boolean('use_group_description'),
	price: integer('price')
		.notNull()
		.default(0),
	stock: integer('stock')
		.notNull()
		.default(0),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow(),
})
export type ProductInsertModel = typeof product.$inferInsert

export const productImages = pgTable('product_images', {
	id: serial('id').primaryKey(),
	product_id: serial('product_id')
		.references(() => product.id, { onDelete: 'cascade' })
		.notNull(),
	url: text('url')
		.notNull(),
	altText: text('alt_text'),
	order: integer('order')
		.default(0),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow()
})
export type ProductImagesInsertModel = typeof productImages.$inferInsert