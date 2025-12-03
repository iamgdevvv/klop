import type { CollectionConfig } from 'payload'

import { slugAssessment } from '$modules/vars'
import { metafield } from '$payload-fields/metadata'
import { authenticated, authenticatedAdminOrAuthor } from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Assessments: CollectionConfig = {
	slug: 'assessments',
	dbName: 'asss',
	admin: {
		hidden({ user }) {
			return user?.role === 'candidate'
		},
		components: {
			edit: {
				beforeDocumentControls: [
					'$payload-fields/components/preview-copy#PreviewAssessmentCopy',
				],
			},
		},
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt'],
		// hideAPIURL: true,
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
									type: 'number',
									name: 'duration',
									admin: {
										width: '50%',
										description: 'In minutes',
									},
								},
								{
									type: 'number',
									name: 'passingGrade',
									min: 0,
									max: 100,
									admin: {
										width: '50%',
										description: 'In percentage',
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
				{
					label: 'Questions',
					fields: [
						{
							type: 'array',
							name: 'questions',
							dbName: (args) => {
								if (args.tableName) {
									return args.tableName + '_aasssqs'
								}

								return 'aasssqs'
							},
							fields: [
								{
									type: 'textarea',
									name: 'question',
									admin: {
										components: {
											Field: {
												path: '$payload-fields/components/assessment#QuestionField',
											},
										},
									},
								},
								{
									type: 'upload',
									name: 'questionMedia',
									relationTo: 'asset',
									admin: {
										description:
											'Please use this only as a helper for the question, not as the main question, because this feature is not supported yet if you treat as main question.',
									},
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
									type: 'checkbox',
									name: 'isAnswerOptions',
									admin: {
										description:
											'Please make sure to include answer options, and fill the "expected answer" field with the correct answer selected from those options.',
									},
								},
								{
									type: 'array',
									name: 'answerOptions',
									dbName: (args) => {
										if (args.tableName) {
											return args.tableName + '_aasssqs'
										}

										return 'aasssqs'
									},
									admin: {
										condition: (_, siblingData) => siblingData.isAnswerOptions,
									},
									fields: [
										{
											type: 'text',
											name: 'answerOption',
											label: false,
										},
									],
								},
								{
									type: 'textarea',
									name: 'expectedAnswer',
									admin: {
										components: {
											Field: {
												path: '$payload-fields/components/assessment#ExpectedAnswerField',
											},
										},
									},
								},
							],
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
					relationTo: 'vacancies',
					filterOptions: ({ user }) => {
						if (user?.role === 'admin') {
							return true
						}

						return {
							author: {
								equals: user?.id,
							},
							expiresAt: {
								greater_than_equal: new Date().toISOString(),
							},
							closeVacancy: {
								not_equals: true,
							},
						}
					},
				},
			],
		}),
	],
}
