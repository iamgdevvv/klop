import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { NothingFoundBackground } from '$blocks/NotFound'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export const metadata: Metadata = {
	title: '404 ⎯ Klop!',
}

export default async function notFoundPage() {
	const authUser = await getAuthUser()

	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<Header
				showActions
				user={authUser}
			/>

			<main className="main">
				<NothingFoundBackground />
			</main>

			<Footer />
		</Stack>
	)
}
