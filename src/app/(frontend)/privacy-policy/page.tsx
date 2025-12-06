import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { PrivacyPolicy } from '$blocks/PrivacyPolicy'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export const metadata: Metadata = {
	title: 'Kebijakan Privasi ⎯ Klop!',
	robots: 'index, follow',
}

export default async function privacyPolicyPage() {
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
				<PrivacyPolicy />
			</main>

			<Footer />
		</Stack>
	)
}
