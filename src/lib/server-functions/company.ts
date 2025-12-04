'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Company } from '$payload-types'

export type OptionsQueryCompanies = Omit<
	Options<'companies', Record<keyof Company, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Company
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['type', 'level', 'education', 'education', 'title', 'excerpt']

export const queryCompanies = async <T extends Partial<Record<keyof Company, true>> | undefined>(
	options?: OptionsQueryCompanies,
	select?: T,
): Promise<PaginatedDocs<Pick<Company, T extends undefined ? keyof Company : keyof T>> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-startDate'
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
			collection: 'companies',
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

		cacheTag('collection', 'collection:companies')

		return result
	} catch (error) {
		console.log('Error fetching companies', { error })
		return null
	}
}
