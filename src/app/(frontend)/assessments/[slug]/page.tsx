import type { Metadata } from 'next'

import { Stack } from '@mantine/core'
import { redirect } from 'next/navigation'

import { AssessmentRunner } from '$blocks/AssessmentRunner'
import { slug404 } from '$modules/vars'
import type { AssessmentSubmission } from '$payload-types'
import { queryAssessments } from '$server-functions/assessment'
import { queryAssessmentSubmissions } from '$server-functions/assessmentSubmission'
import { getAuthUser } from '$server-functions/auth'

type Args = {
	params: Promise<{
		slug: string
	}>
}

export const metadata: Metadata = {
	title: 'Assessment ⎯ Klop!',
}

export default async function assessmentPage({ params }: Args) {
	const { slug } = await params
	const [authUser, assessmentResult] = await Promise.all([
		getAuthUser(),
		queryAssessments({
			limit: 1,
			where: {
				slug: {
					equals: slug,
				},
			},
		}),
	])

	if (!assessmentResult || assessmentResult.docs.length === 0) {
		return redirect(`/${slug404}`)
	}

	const assessment = assessmentResult.docs[0]

	let userAssessmentSubmission: AssessmentSubmission | null = null

	if (
		assessment.mustSelectedCandidate &&
		(!assessment.candidates || assessment.candidates.length === 0)
	) {
		return redirect(`/${slug404}`)
	}

	if (authUser) {
		if (assessment.mustSelectedCandidate) {
			const isCandidateSelected = assessment.candidates?.some((candidate) => {
				if (typeof candidate === 'number') {
					return candidate === authUser.id
				}

				return candidate.id === authUser.id
			})

			if (!isCandidateSelected) {
				return redirect(`/${slug404}`)
			}
		}

		const assessmentSubmissionResult = await queryAssessmentSubmissions({
			limit: 1,
			whereAnd: [
				{
					assessment: {
						equals: assessment.id,
					},
				},
				{
					userCandidateCompany: {
						in: [authUser.id],
					},
				},
			],
		})

		if (assessmentSubmissionResult?.docs.length) {
			userAssessmentSubmission = assessmentSubmissionResult.docs[0]

			const assessmentIdSubmissionResult: number | undefined =
				typeof userAssessmentSubmission.assessment === 'number'
					? userAssessmentSubmission.assessment
					: userAssessmentSubmission.assessment?.id

			if (!assessmentIdSubmissionResult || assessmentIdSubmissionResult !== assessment.id) {
				userAssessmentSubmission = null
			}
		}
	}

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<main className="main">
				<AssessmentRunner
					data={assessment}
					authUser={authUser}
					userAssessmentSubmission={userAssessmentSubmission}
				/>
			</main>
		</Stack>
	)
}
