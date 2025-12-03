import type { CollectionConfig } from 'payload'

import { authenticatedAdminOrAuthor } from '$payload-libs/access-rules'

export const Asset: CollectionConfig = {
	slug: 'asset',
	admin: {
		hideAPIURL: true,
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
	fields: [
		{
			name: 'alt',
			type: 'text',
		},
		{
			name: 'author',
			type: 'relationship',
			relationTo: 'users',
			required: true,
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
}
