import type { CollectionConfig } from 'payload'

import { authenticatedAdminOrAuthor } from '$payload-libs/access-rules'

export const Asset: CollectionConfig = {
	slug: 'asset',
	admin: {
		// hideAPIURL: true,
		baseFilter({ req }) {
			if (!req?.user) {
				return null
			}
			return {
				author: {
					equals: req?.user?.id,
				},
			}
		},
	},
	access: {
		read: authenticatedAdminOrAuthor,
	},
	hooks: {
		beforeChange: [
			({ data, req }) => {
				const user = req?.user

				return {
					...data,
					author: data?.author || (user ? user.id : 1),
				}
			},
		],
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
		},
		{
			name: 'author',
			type: 'relationship',
			relationTo: 'users',
			admin: {
				condition: () => false,
			},
			defaultValue: ({ req }) => {
				if (req?.user) {
					return req.user.id
				}

				return undefined
			},
			filterOptions({ user }) {
				if (!user) {
					return false
				}

				return {
					id: {
						equals: user.id,
					},
				}
			},
		},
	],
}
