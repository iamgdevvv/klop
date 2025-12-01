'use server'
import { revalidatePath, revalidateTag } from 'next/cache'
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	GlobalAfterChangeHook,
} from 'payload'

export const revalidateChange: CollectionAfterChangeHook = async ({ doc, req: { context } }) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection', 'max')
		revalidateTag('sitemap', 'max')
		revalidatePath('/', 'layout')
	}

	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection', 'max')
		revalidateTag('sitemap', 'max')
		revalidatePath('/', 'layout')
	}

	return doc
}

export const revalidateChangeStatic: CollectionAfterChangeHook = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection', 'max')
		revalidatePath('/', 'layout')
	}

	return doc
}

export const revalidateDeleteStatic: CollectionAfterDeleteHook = async ({
	doc,
	req: { context },
}) => {
	if (!context.disableRevalidate) {
		revalidateTag('collection', 'max')
		revalidatePath('/', 'layout')
	}

	return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ context }) => {
	if (!context.disableRevalidate) {
		revalidateTag('global', 'max')
		revalidatePath('/', 'layout')
	}
}
