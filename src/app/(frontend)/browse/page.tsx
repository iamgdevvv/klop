import { Box, Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { BrowseCompanies } from '$blocks/BrowseCompanies'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export const metadata: Metadata = {
	title: 'Temukan Perusahaan ⎯ Klop!',
	robots: 'index, follow',
}

export default async function browseCompaniesPage() {
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
				<BrowseCompanies />
			</Box>

			<Footer />
		</Stack>
	)
}
