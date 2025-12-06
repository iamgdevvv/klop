import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { HeroBullets } from '$blocks/HeroBullets'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export const metadata: Metadata = {
	title: 'Temukan Kandidat yang Klop!',
	robots: 'index, follow',
}

export default async function HomePage() {
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
				<HeroBullets imageSrc="/images/hero-banner.png" />
			</main>

			<Footer />
		</Stack>
	)
}
