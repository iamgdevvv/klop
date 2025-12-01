'use server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import configPromise from '$payload-config'

export const getAuthUser = async () => {
	try {
		const headers = await getHeaders()
		const payload = await getPayload({ config: configPromise })

		const { user } = await payload.auth({ headers })

		return user
	} catch (error) {
		console.log('getAuthUser', { error })
		return null
	}
}
