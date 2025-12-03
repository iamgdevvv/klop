import { Stack } from '@mantine/core'

import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export default async function companyPage() {
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
				<h1>Company Page</h1>
			</main>
			<Footer />
		</Stack>
	)
}
