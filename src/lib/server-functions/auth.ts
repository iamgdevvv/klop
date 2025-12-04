'use server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import configPromise from '$payload-config'
import type { User } from '$payload-types'
import type { PayloadRegister } from '$schema/register'

export type ReturnAuth =
	| {
			success: true
			data: User
			error?: undefined
	  }
	| {
			success: false
			data?: undefined
			error: string
	  }

export const getAuthUser = async () => {
	'use cache: private'
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

export async function actionRegisterAuth(
	role: User['role'],
	body: PayloadRegister,
): Promise<ReturnAuth> {
	try {
		const payload = await getPayload({ config: configPromise })

		const register = await payload.create({
			collection: 'users',
			data: {
				...body,
				role,
			},
		})

		if (register) {
			return {
				success: true,
				data: register,
			}
		}

		return {
			success: false,
			error: 'Invalid credentials',
		}
	} catch (error) {
		console.log('actionRegisterAuth', { error })

		return {
			success: false,
			error: 'Internal server error',
		}
	}
}
