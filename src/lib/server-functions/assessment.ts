'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Assessment } from '$payload-types'

export type OptionsQueryAssessments = Omit<
	Options<'assessments', Record<keyof Assessment, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Assessment
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['title', 'excerpt']

export const queryAssessments = async <
	T extends Partial<Record<keyof Assessment, true>> | undefined,
>(
	options?: OptionsQueryAssessments,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Assessment, T extends undefined ? keyof Assessment : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-updatedAt'
		const whereAnd: Where['and'] = [
			...(options?.where?.and || []),
			...(options?.whereAnd || []),
		]
		const whereOr: Where['or'] = [...(options?.where?.or || []), ...(options?.whereOr || [])]

		if (options?.filter) {
			if (options.filter.ids?.length) {
				whereAnd.push({
					id: {
						in: options.filter.ids,
					},
				})
			}

			if (options.filter.toolIds?.length) {
				whereAnd.push({
					skills: {
						in: options.filter.toolIds,
					},
				})
			}
		}

		if (options?.search) {
			const whereSearch: Where['or'] = []

			fieldSearch.forEach((field) => {
				whereSearch.push({
					[field]: {
						contains: options.search,
					},
				})
			})

			whereAnd.push({
				or: whereSearch,
			})
		}

		if (options?.queried?.id) {
			whereAnd.push({
				id: {
					not_equals: options.queried.id,
				},
			})
		}

		const result = await payload.find({
			collection: 'assessments',
			limit,
			page,
			sort,
			select,
			overrideAccess: true,
			where: {
				...options?.where,
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:assessments')

		return result
	} catch (error) {
		console.log('Error fetching assessments', { error })
		return null
	}
}
