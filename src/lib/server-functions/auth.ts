'use server'
import { headers as getHeaders } from 'next/headers'
import { getPayload, ValidationError } from 'payload'

import configPromise from '$payload-config'
import type { User } from '$payload-types'
import type { PayloadRegister, PayloadRegisterCandidate } from '$schema/register'

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

export async function actionRegisterAuth<T extends User['role']>(
	role: T,
	body: T extends 'candidate' ? PayloadRegisterCandidate : PayloadRegister,
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

		const message: string[] = []

		if (error instanceof ValidationError) {
			if (
				typeof error.cause === 'object' &&
				error.cause &&
				'errors' in error.cause &&
				Array.isArray(error.cause.errors)
			) {
				error.cause.errors.forEach((err) => {
					if (
						typeof err === 'object' &&
						err &&
						'path' in err &&
						typeof err.path === 'string'
					) {
						if (err.path === 'email') {
							message.push('Email sudah digunakan')
						}

						if (err.path === 'phone') {
							message.push('Nomor telepon sudah digunakan')
						}
					}
				})
			}
		} else {
			message.push('Internal server error')
		}

		return {
			success: false,
			error: message.join(', '),
		}
	}
}
