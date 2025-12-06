'use server'
import { cacheTag } from 'next/cache'
import { cookies as getCookies } from 'next/headers'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { User, Vacancy, VacancySubmission } from '$payload-types'
import type { PayloadApplyVacancy, PayloadApplyVacancyRegister } from '$schema/vacancy'

export type ReturnVacancySubmission =
	| {
			success: true
			data: VacancySubmission
			error?: undefined
	  }
	| {
			success: false
			data?: undefined
			error: string
	  }

export async function actionVacancySubmission({
	vacancy,
	candidate,
	formData,
}: {
	vacancy: Vacancy
	candidate: User
	formData: PayloadApplyVacancy
}): Promise<ReturnVacancySubmission> {
	try {
		const payload = await getPayload({ config: configPromise })

		let resume: number | null = null
		const documents: number[] = []
		const userCandidateCompany: number[] = [candidate.id]

		if (formData.resume) {
			const bytes = await formData.resume.arrayBuffer()
			const buffer = Buffer.from(bytes)

			const asset = await payload.create({
				collection: 'asset',
				data: {
					filename: formData.resume.name,
					author: candidate.id,
				},
				file: {
					data: buffer,
					size: formData.resume.size,
					name: formData.resume.name,
					mimetype: formData.resume.type,
				},
				select: {
					filename: true,
				},
			})

			resume = asset.id
		}

		if (!resume && candidate.resume) {
			if (typeof candidate.resume === 'object') {
				resume = candidate.resume.id
			} else {
				resume = candidate.resume
			}
		}

		if (formData.documents && formData.documents.length) {
			await Promise.all(
				formData.documents.map(async (document) => {
					const bytes = await document.arrayBuffer()
					const buffer = Buffer.from(bytes)

					const asset = await payload.create({
						collection: 'asset',
						data: {
							filename: document.name,
							author: candidate.id,
						},
						file: {
							data: buffer,
							size: document.size,
							name: document.name,
							mimetype: document.type,
						},
						select: {
							filename: true,
						},
					})

					documents.push(asset.id)
				}),
			)
		}

		if (!documents.length && candidate.documents) {
			candidate.documents.forEach((document) => {
				if (typeof document === 'object') {
					documents.push(document.id)
				} else {
					documents.push(document)
				}
			})
		}

		if (vacancy.author) {
			if (typeof vacancy.author === 'object') {
				userCandidateCompany.push(vacancy.author.id)
			} else {
				userCandidateCompany.push(vacancy.author)
			}
		}

		const vacancySubmission = await payload.create({
			collection: 'vacancySubmissions',
			overrideAccess: true,
			data: {
				candidateName: candidate.name,
				candidate: {
					avatar: candidate.avatar,
					email: candidate.email,
					phone: candidate.phone,
					gender: candidate.gender,
					education: candidate.education,
					biography: formData.biography,
					resume,
					documents: documents.length ? documents : null,
					socials: {
						website: candidate.socials?.website,
						facebook: candidate.socials?.facebook,
						instagram: candidate.socials?.instagram,
						twitter: candidate.socials?.twitter,
						linkedin: candidate.socials?.linkedin,
						youtube: candidate.socials?.youtube,
						tiktok: candidate.socials?.tiktok,
					},
				},
				userCandidateCompany,
				vacancy: {
					title: vacancy.title,
					type: vacancy.type,
					level: vacancy.level,
					education: vacancy.education,
					fromExpectedSalary: vacancy.fromExpectedSalary,
					toExpectedSalary: vacancy.toExpectedSalary,
				},
				vacancyReference: vacancy.id,
			},
		})

		if (vacancySubmission) {
			return {
				success: true,
				data: vacancySubmission,
			}
		}

		return {
			success: false,
			error: 'Something went wrong',
		}
	} catch (error) {
		console.log('actionVacancySubmission', { error })

		return {
			success: false,
			error: 'Internal server error',
		}
	}
}

export async function actionVacancySubmissionRegister({
	vacancy,
	formData,
}: {
	vacancy: Vacancy
	formData: PayloadApplyVacancyRegister
}): Promise<ReturnVacancySubmission> {
	try {
		const payload = await getPayload({ config: configPromise })

		let resume: number | null = null
		const documents: number[] = []
		const userCandidateCompany: number[] = []

		const candidate = await payload.create({
			collection: 'users',
			overrideAccess: true,
			data: {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				phone: formData.phone,
				biography: formData.biography,
				gender: formData.gender,
				education: formData.education,
				role: 'candidate',
			},
		})

		userCandidateCompany.push(candidate.id)

		const candidateLogin = await payload.login({
			collection: 'users',
			data: {
				email: formData.email,
				password: formData.password,
			},
		})

		if (candidateLogin.exp && candidateLogin.token) {
			const cookies = await getCookies()

			cookies.set('payload-token', candidateLogin.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV == 'production',
				maxAge: candidateLogin.exp,
				sameSite: 'lax',
				path: '/',
			})
		} else {
			return {
				success: false,
				error: 'Something went wrong cant login',
			}
		}

		if (formData.resume) {
			const bytes = await formData.resume.arrayBuffer()
			const buffer = Buffer.from(bytes)

			const asset = await payload.create({
				collection: 'asset',
				data: {
					filename: formData.resume.name,
					author: candidate.id,
				},
				file: {
					data: buffer,
					size: formData.resume.size,
					name: formData.resume.name,
					mimetype: formData.resume.type,
				},
				select: {
					filename: true,
				},
			})

			resume = asset.id
		}

		if (formData.documents && formData.documents.length) {
			await Promise.all(
				formData.documents.map(async (document) => {
					const bytes = await document.arrayBuffer()
					const buffer = Buffer.from(bytes)

					const asset = await payload.create({
						collection: 'asset',
						data: {
							filename: document.name,
							author: candidate.id,
						},
						file: {
							data: buffer,
							size: document.size,
							name: document.name,
							mimetype: document.type,
						},
						select: {
							filename: true,
						},
					})

					documents.push(asset.id)
				}),
			)
		}

		if (resume || documents.length) {
			await payload.update({
				collection: 'users',
				id: candidate.id,
				data: {
					email: candidate.email,
					password: formData.password,
				},
				select: {
					email: true,
				},
			})
		}

		if (vacancy.author) {
			if (typeof vacancy.author === 'object') {
				userCandidateCompany.push(vacancy.author.id)
			} else {
				userCandidateCompany.push(vacancy.author)
			}
		}

		const vacancySubmission = await payload.create({
			collection: 'vacancySubmissions',
			overrideAccess: true,
			data: {
				candidateName: formData.name,
				candidate: {
					avatar: candidate.avatar,
					email: candidate.email,
					phone: candidate.phone,
					gender: candidate.gender,
					education: candidate.education,
					biography: candidate.biography,
					resume,
					documents: documents.length ? documents : null,
					socials: {
						website: candidate.socials?.website,
						facebook: candidate.socials?.facebook,
						instagram: candidate.socials?.instagram,
						twitter: candidate.socials?.twitter,
						linkedin: candidate.socials?.linkedin,
						youtube: candidate.socials?.youtube,
						tiktok: candidate.socials?.tiktok,
					},
				},
				userCandidateCompany,
				vacancy: {
					title: vacancy.title,
					type: vacancy.type,
					level: vacancy.level,
					education: vacancy.education,
					fromExpectedSalary: vacancy.fromExpectedSalary,
					toExpectedSalary: vacancy.toExpectedSalary,
				},
				vacancyReference: vacancy.id,
			},
		})

		if (vacancySubmission) {
			return {
				success: true,
				data: vacancySubmission,
			}
		}

		return {
			success: false,
			error: 'Something went wrong',
		}
	} catch (error) {
		console.log('actionVacancySubmission', { error })

		return {
			success: false,
			error: 'Internal server error',
		}
	}
}

export type OptionsQueryVacancySubmissions = Omit<
	Options<'vacancySubmissions', Record<keyof VacancySubmission, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: VacancySubmission
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['candidateName']

export const queryVacancySubmissions = async <
	T extends Partial<Record<keyof VacancySubmission, true>> | undefined,
>(
	options?: OptionsQueryVacancySubmissions,
	select?: T,
): Promise<PaginatedDocs<
	Pick<VacancySubmission, T extends undefined ? keyof VacancySubmission : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-updatedAt'
		const whereAnd: Where['and'] = [
			...(options?.where?.and || []),
			...(options?.whereAnd || []),
		]
		const whereOr: Where['or'] = [...(options?.where?.or || []), ...(options?.whereOr || [])]

		if (options?.filter) {
			if (options.filter.ids?.length) {
				whereAnd.push({
					id: {
						in: options.filter.ids,
					},
				})
			}

			if (options.filter.toolIds?.length) {
				whereAnd.push({
					skills: {
						in: options.filter.toolIds,
					},
				})
			}
		}

		if (options?.search) {
			const whereSearch: Where['or'] = []

			fieldSearch.forEach((field) => {
				whereSearch.push({
					[field]: {
						contains: options.search,
					},
				})
			})

			whereAnd.push({
				or: whereSearch,
			})
		}

		if (options?.queried?.id) {
			whereAnd.push({
				id: {
					not_equals: options.queried.id,
				},
			})
		}

		const result = await payload.find({
			collection: 'vacancySubmissions',
			limit,
			page,
			sort,
			select,
			overrideAccess: true,
			where: {
				...options?.where,
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:vacancySubmissions')

		return result
	} catch (error) {
		console.log('Error fetching vacancySubmissions', { error })
		return null
	}
}
