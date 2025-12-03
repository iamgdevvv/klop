import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'
import { Box, Container } from '@mantine/core'
import { RegisterForm } from './../components/blocks/RegisterForm'

export default async function registerPage() {
	const authUser = await getAuthUser()

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header showActions={true} user={authUser} />

			<Box
				component="main"
				style={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'var(--mantine-color-gray-0)',
					backgroundImage: 'radial-gradient(var(--mantine-color-gray-3) 1.5px, transparent 1.5px)',
					backgroundSize: '24px 24px',
				}}
			>
				<Container size="sm" py={60} w="100%">
					<RegisterForm />
				</Container>
			</Box>

			<Footer />
		</div>
	)
}	