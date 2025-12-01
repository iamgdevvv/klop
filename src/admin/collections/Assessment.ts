import type { CollectionConfig } from 'payload'

import { slugAssessment } from '$modules/vars'
import { metafield } from '$payload-fields/metadata'
import { authenticated, authenticatedActionRole } from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Assessments: CollectionConfig = {
	slug: 'assessments',
	dbName: 'asss',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt'],
		group: 'General',
		livePreview: {
			url: ({ data, req }) => {
				return generatePreviewPath({
					path: typeof data?.slug === 'string' ? `/${slugAssessment}/${data.slug}` : '/',
					req,
				})
			},
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				path: typeof data?.slug === 'string' ? `/${slugAssessment}/${data.slug}` : '',
				req,
			}),
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
							type: 'richText',
							name: 'description',
						},
					],
				},
			],
		},
		...metafield({
			general: [
				{
					type: 'relationship',
					name: 'vacancy',
					required: true,
					relationTo: 'vacancies',
				},
			],
		}),
	],
}
