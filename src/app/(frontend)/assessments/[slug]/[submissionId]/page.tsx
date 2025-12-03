import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'
import { Box } from '@mantine/core'
import { AssessmentResult } from './../../../components/blocks/AssessmentResult'

export default async function assessmentSubmissionPage({ params }: { params: { slug: string, submissionId: string } }) {
	const authUser = await getAuthUser()

	// Contoh teks hasil generate AI
	const mockAiFeedback = `Kandidat menunjukkan penguasaan yang sangat baik pada sintaks dasar JavaScript dan manipulasi Array. Namun, terdeteksi keragu-raguan pada soal asynchronous programming. Disarankan untuk memperdalam materi Promise dan Async/Await untuk mencapai level Senior yang solid.`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header showActions={true} user={authUser} />

			<Box
				component="main"
				style={{
					flex: 1,
					backgroundColor: 'var(--mantine-color-gray-0)',
					backgroundImage: 'radial-gradient(var(--mantine-color-gray-3) 1.5px, transparent 1.5px)',
					backgroundSize: '24px 24px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<AssessmentResult
					candidateName={authUser?.name || "Petugas 1"}
					score={80}
					passingScore={60}
					correctAnswers={12}
					totalQuestions={15}
					assessmentTitle="JavaScript Developer Assessment"
					aiFeedback={mockAiFeedback}
				/>
			</Box>

			<Footer />
		</div>
	)
}