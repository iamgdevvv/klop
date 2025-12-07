import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { authenticatedAdminOrAuthor, authenticatedAdminOrCompany } from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Companies: CollectionConfig = {
	slug: 'companies',
	dbName: 'cmps',
	admin: {
		hidden({ user }) {
			return user?.role === 'candidate'
		},
		components: {
			edit: {
				beforeDocumentControls: [
					'$payload-fields/components/preview-copy#PreviewCompanyCopy',
				],
			},
		},
		useAsTitle: 'title',
		defaultColumns: [
			'title',
			'slug',
			'businessCategory',
			'location',
			'totalEmployees',
			'author',
		],
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
				return generatePreviewPath({
					path: typeof data?.slug === 'string' ? `/${data.slug}` : '/',
					req,
				})
			},
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				path: typeof data?.slug === 'string' ? `/${data.slug}` : '',
				req,
			}),
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
							type: 'upload',
							name: 'logo',
							relationTo: 'asset',
							filterOptions({ user }) {
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
							type: 'richText',
							name: 'description',
						},
						{
							type: 'row',
							fields: [
								{
									type: 'text',
									name: 'businessCategory',
									admin: {
										width: '33.3333%',
									},
								},
								{
									type: 'text',
									name: 'location',
									admin: {
										width: '33.3333%',
									},
								},
								{
									type: 'number',
									name: 'totalEmployees',
									admin: {
										width: '33.3333%',
									},
								},
							],
						},
						{
							type: 'group',
							name: 'socials',
							fields: [
								{
									type: 'row',
									fields: [
										{
											type: 'text',
											name: 'website',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'facebook',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'instagram',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'linkedin',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'twitter',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'youtube',
											admin: {
												width: '33.3333%',
											},
										},
										{
											type: 'text',
											name: 'tiktok',
											admin: {
												width: '33.3333%',
											},
										},
									],
								},
							],
						},
						{
							type: 'upload',
							name: 'gallery',
							relationTo: 'asset',
							hasMany: true,
							filterOptions({ user }) {
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
					],
				},
			],
		},
		...metafield({
			filterOptionsAuthor({ user }) {
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
			general: [
				{
					type: 'upload',
					name: 'favicon',
					relationTo: 'asset',
					filterOptions({ user }) {
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
			],
		}),
	],
}
