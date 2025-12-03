import { Company } from '$blocks/Company'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'
import { Box } from '@mantine/core'

export default async function companyPage({ params }: { params: { company: string } }) {
	const authUser = await getAuthUser()

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
				}}
			>
				<Company companySlug={params.company} />
			</Box>

			<Footer />
		</div>
	)
}