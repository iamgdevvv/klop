import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { NothingFoundBackground } from '$blocks/NotFound'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'

export const metadata: Metadata = {
	title: '404 ⎯ Klop!',
}

export default async function notFoundPage() {
	return (
		<Stack
			gap={0}
			mih="100vh"
		>
			<Header showActions={false} />

			<main className="main">
				<NothingFoundBackground />
			</main>

			<Footer />
		</Stack>
	)
}
