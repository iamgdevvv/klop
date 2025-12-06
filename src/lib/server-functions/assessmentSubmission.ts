'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { AssessmentSubmission } from '$payload-types'
import { klopAIAssessmentScoring } from '$repo/klop-ai'
import type { PayloadExamAssessment } from '$schema/assesment'

export type ReturnAssessmentSubmission =
	| {
			success: true
			data: AssessmentSubmission
			error?: undefined
	  }
	| {
			success: false
			data?: undefined
			error: string
	  }

export async function actionAssessmentSubmission({
	companyUserId,
	candidateUserId,
	assessment,
	exams,
}: {
	companyUserId: number
	candidateUserId: number
	assessment: {
		id: number
		title: string
		description: string
	}
	exams: (PayloadExamAssessment & {
		expectedAnswer: string
	})[]
}): Promise<ReturnAssessmentSubmission> {
	try {
		const payload = await getPayload({ config: configPromise })

		const [companyUser, candidateUser] = await Promise.all([
			payload.findByID({
				collection: 'users',
				id: companyUserId,
				overrideAccess: true,
				select: {
					role: true,
				},
			}),
			payload.findByID({
				collection: 'users',
				id: candidateUserId,
				overrideAccess: true,
			}),
		])

		if (companyUser?.role !== 'company') {
			return {
				success: false,
				error: 'Company user not found',
			}
		}

		if (candidateUser?.role !== 'candidate') {
			return {
				success: false,
				error: 'Candidate user not found',
			}
		}

		const userCandidateCompany: number[] = [companyUser.id, candidateUser.id]

		if (exams.length) {
			const assessmentScoring = await klopAIAssessmentScoring({
				title: assessment.title,
				description: assessment.description,
				questions: exams,
			})

			if (!assessmentScoring) {
				return {
					success: false,
					error: 'Something went wrong',
				}
			}

			const totalCorrect = assessmentScoring.questions.filter((q) => q.isAnswerCorrect).length
			const scoreSubmission = (totalCorrect / assessmentScoring.questions.length) * 100

			const assessmentSubmission = await payload.create({
				collection: 'assessmentSubmissions',
				overrideAccess: true,
				data: {
					candidateName: candidateUser.name,
					candidate: {
						avatar: candidateUser.avatar,
						email: candidateUser.email,
						phone: candidateUser.phone,
						gender: candidateUser.gender,
						education: candidateUser.education,
						biography: candidateUser.biography,
						resume: candidateUser.resume,
						documents: candidateUser.documents,
						socials: {
							website: candidateUser.socials?.website,
							facebook: candidateUser.socials?.facebook,
							instagram: candidateUser.socials?.instagram,
							twitter: candidateUser.socials?.twitter,
							linkedin: candidateUser.socials?.linkedin,
							youtube: candidateUser.socials?.youtube,
							tiktok: candidateUser.socials?.tiktok,
						},
					},
					userCandidateCompany,
					score: scoreSubmission,
					assessment: assessment.id,
					summary: assessmentScoring.summary,
					assessmentResults: assessmentScoring.questions,
				},
			})

			if (assessmentSubmission) {
				return {
					success: true,
					data: assessmentSubmission,
				}
			}
		} else {
			const assessmentSubmission = await payload.create({
				collection: 'assessmentSubmissions',
				overrideAccess: true,
				data: {
					candidateName: candidateUser.name,
					candidate: {
						avatar: candidateUser.avatar,
						email: candidateUser.email,
						phone: candidateUser.phone,
						gender: candidateUser.gender,
						education: candidateUser.education,
						biography: candidateUser.biography,
						resume: candidateUser.resume,
						documents: candidateUser.documents,
						socials: {
							website: candidateUser.socials?.website,
							facebook: candidateUser.socials?.facebook,
							instagram: candidateUser.socials?.instagram,
							twitter: candidateUser.socials?.twitter,
							linkedin: candidateUser.socials?.linkedin,
							youtube: candidateUser.socials?.youtube,
							tiktok: candidateUser.socials?.tiktok,
						},
					},
					userCandidateCompany,
					score: 0,
					assessment: assessment.id,
					summary: 'Kandidat gagal melakukan assessment',
					assessmentResults: [],
				},
			})

			if (assessmentSubmission) {
				return {
					success: true,
					data: assessmentSubmission,
				}
			}
		}

		return {
			success: false,
			error: 'Something went wrong',
		}
	} catch (error) {
		console.log('actionAssessmentSubmission', { error })

		return {
			success: false,
			error: 'Internal server error',
		}
	}
}

export async function getAssessmentSubmission(id: number) {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		cacheTag('collection', 'collection:assessmentSubmissions')

		return await payload.findByID({
			collection: 'assessmentSubmissions',
			id,
			overrideAccess: true,
		})
	} catch (error) {
		console.log('Error fetching assessmentSubmissions', { error })
		return null
	}
}

export type OptionsQueryAssessmentSubmissions = Omit<
	Options<'assessmentSubmissions', Record<keyof AssessmentSubmission, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: AssessmentSubmission
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['candidateName', 'summary']

export const queryAssessmentSubmissions = async <
	T extends Partial<Record<keyof AssessmentSubmission, true>> | undefined,
>(
	options?: OptionsQueryAssessmentSubmissions,
	select?: T,
): Promise<PaginatedDocs<
	Pick<AssessmentSubmission, T extends undefined ? keyof AssessmentSubmission : keyof T>
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
			collection: 'assessmentSubmissions',
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

		cacheTag('collection', 'collection:assessmentSubmissions')

		return result
	} catch (error) {
		console.log('Error fetching assessmentSubmissions', { error })
		return null
	}
}
