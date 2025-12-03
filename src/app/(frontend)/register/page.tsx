import { Container, Stack } from '@mantine/core'

import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { RegisterForm } from '$root/ui/blocks/RegisterForm'
import { getAuthUser } from '$server-functions/auth'

export default async function registerPage() {
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
				<Container
					size="sm"
					py={60}
					w="100%"
				>
					<RegisterForm />
				</Container>
			</main>

			<Footer />
		</Stack>
	)
}
