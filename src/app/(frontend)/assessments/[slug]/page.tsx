import type { Metadata } from 'next'

import { Stack } from '@mantine/core'
import { redirect } from 'next/navigation'

import { AssessmentRunner } from '$blocks/AssessmentRunner'
import { slug404 } from '$modules/vars'
import { queryAssessments } from '$server-functions/assessment'
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

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<main className="main">
				<AssessmentRunner data={assessmentResult.docs[0]} />
			</main>
		</Stack>
	)
}
