import type { Access, AccessArgs } from 'payload'

import type { User } from '$payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
	return !!user
}

export const authenticatedAdmin: isAuthenticated = ({ req: { user } }) => {
	return user?.role === 'admin'
}

export const authenticatedAdminOrCompany: Access = ({ data, req: { user } }) => {
	if (data?.author && user?.collection === 'users') {
		return user.role === 'admin' || user.role === 'company'
	}

	return true
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

	return true
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
