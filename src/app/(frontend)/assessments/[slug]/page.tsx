import Footer from '$layouts/Footer';
import Header from '$layouts/Header';
import { getAuthUser } from '$server-functions/auth';
import { Box } from '@mantine/core';
import { AssessmentRunner } from '../../components/blocks/AssessmentRunner';

export default async function assessmentPage({ params }: { params: { slug: string } }) {
	// Data fetching bisa dilakukan di sini nanti berdasarkan params.slug
	const authUser = await getAuthUser();

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header showActions={true} user={authUser} />

			<Box
				component="main"
				style={{
					flex: 1,
					// 1. Warna Dasar (Abu sangat muda)
					backgroundColor: 'var(--mantine-color-gray-0)',

					// 2. BAGIAN INI YANG HILANG DI KODEMU (Pola Titik-titik)
					backgroundImage: 'radial-gradient(var(--mantine-color-gray-3) 1.5px, transparent 1.5px)',

					// 3. Ukuran jarak antar titik
					backgroundSize: '24px 24px',
				}}
			>
				<AssessmentRunner />
			</Box>

			<Footer />
		</div>
	)
}