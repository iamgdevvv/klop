import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { slugField } from '$payload-fields/slug'
import { authenticatedAdminOrAuthor, authenticatedAdminOrCompany } from '$payload-libs/access-rules'
import { vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Vacancies: CollectionConfig = {
	slug: 'vacancies',
	dbName: 'vcn',
	admin: {
		hidden({ user }) {
			return user?.role === 'candidate'
		},
		components: {
			edit: {
				beforeDocumentControls: [
					'$payload-fields/components/preview-copy#PreviewVacancyCopy',
				],
			},
		},
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'level', 'company', 'closeVacancy', 'expiresAt'],
		group: 'Company',
		baseFilter({ req }) {
			if (req?.user) {
				if (req.user.role === 'admin') {
					return {
						author: {
							exists: true,
						},
					}
				}

				if (req.user.role === 'company') {
					return {
						author: {
							equals: req.user.id,
						},
					}
				}
			}

			return null
		},
		livePreview: {
			url: ({ data, req }) => {
				if (!data?.slug && typeof data.slug !== 'string') {
					return null
				}

				if (!data?.company) {
					return null
				}

				if (
					typeof data.company === 'object' &&
					'slug' in data.company &&
					typeof data.company.slug === 'string'
				) {
					return generatePreviewPath({
						path: `/${data.company.slug}/${data.slug}`,
						req,
					})
				} else if (typeof data.company === 'number') {
					return generatePreviewPath({
						path: `/scv/${data.company}/${data.slug}`,
						req,
					})
				}

				return null
			},
		},
		preview: (data, { req }) => {
			if (!data?.slug && typeof data.slug !== 'string') {
				return null
			}

			if (!data?.company) {
				return null
			}

			if (
				typeof data.company === 'object' &&
				'slug' in data.company &&
				typeof data.company.slug === 'string'
			) {
				return generatePreviewPath({
					path: `/${data.company.slug}/${data.slug}`,
					req,
				})
			} else if (typeof data.company === 'number') {
				return generatePreviewPath({
					path: `/scv/${data.company}/${data.slug}`,
					req,
				})
			}

			return null
		},
	},
	access: {
		create: authenticatedAdminOrCompany,
		read: authenticatedAdminOrAuthor,
		update: authenticatedAdminOrAuthor,
		delete: authenticatedAdminOrAuthor,
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
									name: 'type',
									enumName: 'vcltyp',
									options: vacancyType,
									admin: {
										width: '33.333%',
									},
								},
								{
									type: 'select',
									name: 'level',
									enumName: 'vclvl',
									options: vacancyLevel,
									admin: {
										width: '33.333%',
									},
								},
								{
									type: 'select',
									name: 'education',
									enumName: 'vcedu',
									options: vacancyEducation,
									admin: {
										width: '33.333%',
									},
								},
							],
						},
						{
							type: 'collapsible',
							label: 'Salary',
							fields: [
								{
									type: 'row',
									fields: [
										{
											type: 'number',
											label: 'Minimum',
											name: 'fromExpectedSalary',
											admin: {
												width: '50%',
											},
										},
										{
											type: 'number',
											label: 'Maximum',
											name: 'toExpectedSalary',
											admin: {
												width: '50%',
											},
										},
									],
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
			filterOptionsAuthor({ user }) {
				if (user) {
					if (user.role === 'admin') {
						return true
					}

					return {
						id: {
							equals: user.id,
						},
					}
				}

				return false
			},
			general: [
				{
					type: 'relationship',
					name: 'company',
					required: true,
					relationTo: 'companies',
					filterOptions: ({ user }) => {
						if (user) {
							if (user.role === 'admin') {
								return true
							}

							return {
								author: {
									equals: user.id,
								},
							}
						}

						return false
					},
				},
				{
					type: 'date',
					name: 'expiresAt',
				},
				{
					type: 'checkbox',
					name: 'closeVacancy',
					defaultValue: false,
				},
			],
		}),
	],
}
