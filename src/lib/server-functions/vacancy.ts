'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Vacancy } from '$payload-types'

export type OptionsQueryVacancies = Omit<
	Options<'vacancies', Record<keyof Vacancy, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Vacancy
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['type', 'level', 'education', 'education', 'title', 'excerpt']

export const queryVacancies = async <T extends Partial<Record<keyof Vacancy, true>> | undefined>(
	options?: OptionsQueryVacancies,
	select?: T,
): Promise<PaginatedDocs<Pick<Vacancy, T extends undefined ? keyof Vacancy : keyof T>> | null> => {
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
			collection: 'vacancies',
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

		cacheTag('collection', 'collection:vacancies')

		return result
	} catch (error) {
		console.log('Error fetching vacancies', { error })
		return null
	}
}
