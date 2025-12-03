import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { Box } from '@mantine/core'
import { NothingFoundBackground } from './../components/blocks/NotFound'

export default async function notFoundPage() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header showActions={false} />

			<Box
				component="main"
				style={{
					flex: 1,
					// --- STYLE DOT PATTERN ---
					backgroundColor: 'var(--mantine-color-gray-0)',
					backgroundImage: 'radial-gradient(var(--mantine-color-gray-3) 1.5px, transparent 1.5px)',
					backgroundSize: '24px 24px',
					// Alignment
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<NothingFoundBackground />
			</Box>

			<Footer />
		</div>
	)
}