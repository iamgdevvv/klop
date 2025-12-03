import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { HeroBullets } from '$root/ui/blocks/HeroBullets'
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
				showActions={true}
				user={authUser}
			/>
			<main className="main">
				<HeroBullets imageSrc="/images/hero-banner.png" />
			</main>

			<Footer />
		</Stack>
	)
}
