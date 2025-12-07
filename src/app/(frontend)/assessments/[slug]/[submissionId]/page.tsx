import { Stack } from '@mantine/core'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AssessmentResult } from '$blocks/AssessmentResult'
import Footer from '$layouts/Footer'
import { slug404 } from '$modules/vars'
import { getAssessmentSubmission } from '$server-functions/assessmentSubmission'
import { getAuthUser } from '$server-functions/auth'

type Args = {
	params: Promise<{
		slug: string
		submissionId: string
	}>
}

export const metadata: Metadata = {
	title: 'Hasil Asesmen ⎯ Klop!',
}

export default async function assessmentSubmissionPage({ params }: Args) {
	const { slug, submissionId } = await params
	const [authUser, assessmentSubmission] = await Promise.all([
		getAuthUser(),
		getAssessmentSubmission(Number(submissionId)),
	])

	if (!authUser) {
		return redirect(`/${slug404}`)
	}

	const assessment =
		typeof assessmentSubmission?.assessment === 'object'
			? assessmentSubmission?.assessment
			: null

	if (!assessmentSubmission || !assessment || assessment.slug !== slug) {
		return redirect(`/${slug404}`)
	}

	if (!assessmentSubmission.userCandidateCompany) {
		return redirect(`/${slug404}`)
	}

	const isCandidateExist = assessmentSubmission.userCandidateCompany.some((item) => {
		if (typeof item === 'number') {
			return item === authUser.id
		}

		return item.id === authUser.id
	})

	if (!isCandidateExist) {
		return redirect(`/${slug404}`)
	}

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<main className="main">
				<AssessmentResult
					data={assessmentSubmission}
					assessment={assessment}
				/>
			</main>

			<Footer />
		</Stack>
	)
}