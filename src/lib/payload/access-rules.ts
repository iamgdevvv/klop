import type { Access, AccessArgs } from 'payload'

import type { User } from '$payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
	return Boolean(user)
}

export const authenticatedAdmin: isAuthenticated = ({ req: { user } }) => {
	return user?.collection === 'users' && user.role === 'admin'
}

export const authenticatedAdminOrAuthor: Access = ({ data, req: { user } }) => {
	if (data?.author && user?.collection === 'users') {
		if (user.role === 'admin') {
			return true
		}

		if (typeof data.author === 'object') {
			return data.author.id === user.id
		}

		return data.author === user.id
	}

	if (!data?.author && !!user) {
		return true
	}

	return false
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
	if (user) {
		return true
	}

	return {
		_status: {
			equals: 'published',
		},
	}
}
