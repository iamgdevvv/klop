import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { authenticated, authenticatedActionRole } from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Companies: CollectionConfig = {
	slug: 'companies',
	dbName: 'cmps',
	admin: {
		useAsTitle: 'title',
		defaultColumns: [
			'title',
			'slug',
			'businessCategory',
			'location',
			'totalEmployees',
			'updatedAt',
		],
		group: 'General',
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
							type: 'upload',
							name: 'logo',
							relationTo: 'asset',
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
						},
					],
				},
			],
		},
		...metafield({
			general: [
				{
					type: 'upload',
					name: 'favicon',
					relationTo: 'asset',
				},
			],
		}),
	],
}
