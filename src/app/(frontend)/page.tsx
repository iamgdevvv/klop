import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { HeroBullets } from '$root/ui/blocks/HeroBullets'
import { getAuthUser } from '$server-functions/auth'
import { Stack } from '@mantine/core'

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
