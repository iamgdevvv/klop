import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

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
			<Header
				showActions={true}
				user={authUser}
			/>

			<main className="main">Browse Companies</main>

			<Footer />
		</Stack>
	)
}
