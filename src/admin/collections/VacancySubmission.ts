import type { Access, CollectionConfig } from 'payload'

import { candidateGender, vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'

const authenticatedActionByVacancyAuthor: Access = ({ data, req: { user } }) => {
	if (data?.assessment && user?.collection === 'users') {
		if (user.role === 'admin') {
			return true
		}

		const userIds: number[] = []

		if (data.userCandidateCompany && Array.isArray(data.userCandidateCompany)) {
			data.userCandidateCompany.forEach((item: number | { id: number }) => {
				if (typeof item === 'object') {
					userIds.push(item.id)
				} else if (typeof item === 'number') {
					userIds.push(item)
				}
			})
		}

		return userIds.includes(user.id)
	}

	return !!user
}

export const VacancySubmissions: CollectionConfig = {
	slug: 'vacancySubmissions',
	dbName: 'vcnsbs',
	admin: {
		useAsTitle: 'candidateName',
		defaultColumns: ['candidateName', 'vacancy', 'createdAt'],
		group: 'Submissions',
		// hideAPIURL: true,
		baseFilter({ req }) {
			if (req?.user) {
				if (req.user.role === 'admin') {
					return {
						userCandidateCompany: {
							exists: true,
						},
					}
				}

				return {
					userCandidateCompany: {
						in: [req.user.id],
					},
				}
			}

			return null
		},
	},
	access: {
		create: () => false,
		read: authenticatedActionByVacancyAuthor,
		update: () => false,
		delete: () => false,
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
					label: 'Candidate',
					fields: [
						{
							name: 'candidateName',
							type: 'text',
							required: true,
							admin: {
								readOnly: true,
							},
						},
						{
							type: 'group',
							name: 'candidate',
							label: false,
							fields: [
								{
									type: 'row',
									fields: [
										{
											name: 'avatar',
											type: 'upload',
											relationTo: 'asset',
											admin: {
												width: '100%',
												readOnly: true,
											},
										},
										{
											name: 'phone',
											type: 'text',
											admin: {
												width: '50%',
												readOnly: true,
											},
										},
										{
											name: 'gender',
											type: 'select',
											enumName: 'asbsgnd',
											options: candidateGender,
											admin: {
												width: '50%',
												readOnly: true,
											},
										},
										{
											type: 'select',
											name: 'education',
											enumName: 'asbsedu',
											options: vacancyEducation,
											admin: {
												width: '50%',
												readOnly: true,
											},
										},
										{
											name: 'biography',
											type: 'textarea',
											admin: {
												width: '100%',
												readOnly: true,
											},
										},
										{
											type: 'upload',
											name: 'resume',
											relationTo: 'asset',
											admin: {
												width: '100%',
												readOnly: true,
											},
										},
										{
											type: 'upload',
											name: 'documents',
											relationTo: 'asset',
											hasMany: true,
											admin: {
												width: '100%',
												readOnly: true,
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
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'facebook',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'instagram',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'linkedin',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'twitter',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'youtube',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
												{
													type: 'text',
													name: 'tiktok',
													admin: {
														width: '33.3333%',
														readOnly: true,
													},
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					label: 'Vacancy',
					fields: [
						{
							type: 'relationship',
							name: 'userCandidateCompany',
							relationTo: 'users',
							label: 'Relation',
							required: true,
							hasMany: true,
							maxRows: 2,
							admin: {
								readOnly: true,
							},
							filterOptions: ({ user }) => {
								if (user?.role === 'candidate') {
									return {
										role: {
											equals: 'company',
										},
									}
								}

								if (user?.role === 'company') {
									return {
										role: {
											equals: 'candidate',
										},
									}
								}

								return false
							},
						},
						{
							type: 'group',
							name: 'vacancy',
							label: false,
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
												readOnly: true,
												width: '33.3333%',
											},
										},
										{
											type: 'select',
											name: 'level',
											enumName: 'vclvl',
											options: vacancyLevel,
											admin: {
												readOnly: true,
												width: '33.3333%',
											},
										},
										{
											type: 'select',
											name: 'education',
											enumName: 'vcedu',
											options: vacancyEducation,
											admin: {
												readOnly: true,
												width: '33.3333%',
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
														readOnly: true,
														width: '50%',
													},
												},
												{
													type: 'number',
													label: 'Maximum',
													name: 'toExpectedSalary',
													admin: {
														readOnly: true,
														width: '50%',
													},
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'relationship',
							name: 'vacancyReference',
							relationTo: 'vacancies',
							required: true,
							admin: {
								readOnly: true,
								condition: (_, __, { user }) => {
									return user?.role === 'company'
								},
							},
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
				},
			],
		},
	],
}
