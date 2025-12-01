import type { Access, CollectionConfig } from 'payload'

import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'

const authenticatedActionByAssessmentAuthor: Access = ({ data, req: { user } }) => {
	if (data?.assessment && user?.collection === 'users') {
		if (user.role === 'admin') {
			return true
		}

		if (typeof data.assessment.author === 'object') {
			return data.assessment.author.id === user.id
		}

		return data.assessment.author === user.id
	}

	if (!data?.author && !!user) {
		return true
	}

	return false
}

export const AssessmentSubmissions: CollectionConfig = {
	slug: 'assessmentSubmissions',
	dbName: 'assbs',
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'assessment', 'createdAt'],
		group: 'General',
	},
	access: {
		create: () => false,
		read: authenticatedActionByAssessmentAuthor,
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
							type: 'text',
							name: 'name',
							required: true,
						},
					],
				},
				{
					label: 'Assessment',
					fields: [
						{
							type: 'relationship',
							name: 'assessment',
							relationTo: 'assessments',
							required: true,
							admin: {
								readOnly: true,
							},
						},
					],
				},
			],
		},
	],
}
