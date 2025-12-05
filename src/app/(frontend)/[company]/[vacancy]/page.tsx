import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { VacancyView } from '$root/ui/blocks/VacancyView'
import { getAuthUser } from '$server-functions/auth'
import { Box, Stack } from '@mantine/core'


export default async function vacancyPage({ params }: { params: { company: string, vacancy: string } }) {
	const authUser = await getAuthUser()

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<Header showActions={true} user={authUser} />

			<Box
				component="main"
				style={{
					flex: 1,
					// --- DOT PATTERN (KONSISTEN) ---
					backgroundColor: 'var(--mantine-color-gray-0)',
					backgroundImage: 'radial-gradient(var(--mantine-color-gray-3) 1.5px, transparent 1.5px)',
					backgroundSize: '24px 24px',
				}}
			>
				<VacancyView
					companySlug={params.company}
					vacancySlug={params.vacancy}
				/>
			</Box>

			<Footer />
		</Stack>
	)
}