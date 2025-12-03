import { Stack } from '@mantine/core'

import { AssessmentResult } from '$blocks/AssessmentResult'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export default async function assessmentSubmissionPage({
	params,
}: {
	params: { slug: string; submissionId: string }
}) {
	const authUser = await getAuthUser()

	// Contoh teks hasil generate AI
	const mockAiFeedback = `Kandidat menunjukkan penguasaan yang sangat baik pada sintaks dasar JavaScript dan manipulasi Array. Namun, terdeteksi keragu-raguan pada soal asynchronous programming. Disarankan untuk memperdalam materi Promise dan Async/Await untuk mencapai level Senior yang solid.`

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<Header
				showActions={true}
				user={authUser}
			/>

			<main className="main">
				<AssessmentResult
					candidateName={authUser?.name || 'Petugas 1'}
					score={80}
					passingScore={60}
					correctAnswers={12}
					totalQuestions={15}
					assessmentTitle="JavaScript Developer Assessment"
					aiFeedback={mockAiFeedback}
				/>
			</main>

			<Footer />
		</Stack>
	)
}
