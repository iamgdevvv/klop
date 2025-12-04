'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { AssessmentSubmission } from '$payload-types'
import { klopAIAssessmentScoring } from '$repo/klop-ai'
import type { PayloadCandidateAssessment, PayloadExamAssessment } from '$schema/assesment'

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
	assessment,
	candidate,
	exams,
}: {
	companyUserId: number
	assessment: {
		id: number
		title: string
		description: string
	}
	candidate: PayloadCandidateAssessment
	exams: (PayloadExamAssessment & {
		expectedAnswer: string
	})[]
}): Promise<ReturnAssessmentSubmission> {
	try {
		const payload = await getPayload({ config: configPromise })

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
					candidateName: candidate.name,
					candidate: {
						email: candidate.email,
						phone: candidate.phone,
						gender: candidate.gender,
					},
					userCandidateCompany: [companyUserId],
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
					candidateName: candidate.name,
					candidate: {
						email: candidate.email,
						phone: candidate.phone,
						gender: candidate.gender,
					},
					userCandidateCompany: [companyUserId],
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

const fieldSearch = ['title', 'excerpt']

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
		const sort = options?.sort || '-startDate'
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
