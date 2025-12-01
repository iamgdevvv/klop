import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { slugField } from '$payload-fields/slug'
import { authenticated, authenticatedActionRole } from '$payload-libs/access-rules'
import { vacancyLevel } from '$payload-libs/enum'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Vacancies: CollectionConfig = {
	slug: 'vacancies',
	dbName: 'vcn',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt'],
		group: 'General',
		livePreview: {
			url: ({ data, req }) => {
				let companySlug = 'unknown'

				if (
					data?.company &&
					typeof data.company === 'object' &&
					'slug' in data.company &&
					typeof data.company.slug === 'string'
				) {
					companySlug = data.company.slug
				}

				return generatePreviewPath({
					path: typeof data?.slug === 'string' ? `/${companySlug}/${data.slug}` : '/',
					req,
				})
			},
		},
		preview: (data, { req }) => {
			let companySlug = 'unknown'

			if (
				data?.company &&
				typeof data.company === 'object' &&
				'slug' in data.company &&
				typeof data.company.slug === 'string'
			) {
				companySlug = data.company.slug
			}

			return generatePreviewPath({
				path: typeof data?.slug === 'string' ? `/${companySlug}/${data.slug}` : '',
				req,
			})
		},
	},
	access: {
		create: authenticated,
		read: authenticatedActionRole,
		update: authenticatedActionRole,
		delete: authenticatedActionRole,
	},
	hooks: {
		afterChange: [revalidateChange],
		afterDelete: [revalidateDelete],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'General',
					fields: [
						{
							type: 'row',
							fields: [
								{
									type: 'select',
									name: 'level',
									options: vacancyLevel,
									admin: {
										width: '50%',
									},
								},
								{
									type: 'number',
									name: 'expectedSalary',
									admin: {
										width: '50%',
									},
								},
							],
						},
						{
							type: 'richText',
							name: 'description',
						},
					],
				},
			],
		},
		...metafield({
			slug: {
				...slugField,
				unique: false,
			},
			general: [
				{
					type: 'relationship',
					name: 'company',
					required: true,
					relationTo: 'companies',
				},
			],
		}),
	],
}
