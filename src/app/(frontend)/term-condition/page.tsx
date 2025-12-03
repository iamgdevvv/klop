import { Stack } from '@mantine/core'

import { TermsConditions } from '$blocks/TermsCondition'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export default async function termConditionPage() {
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
				<TermsConditions />
			</main>

			<Footer />
		</Stack>
	)
}
