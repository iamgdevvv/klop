import { Container, Stack, Text, Title } from '@mantine/core'
import type { Metadata } from 'next'

import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { slugDashboard } from '$root/lib/modules/vars'
import { RegisterForm } from '$root/ui/blocks/RegisterForm'
import { getAuthUser } from '$server-functions/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Buat Akun ⎯ Klop!',
	robots: 'index, follow',
}

export default async function registerPage() {
	const authUser = await getAuthUser()

	if (authUser) {
		return redirect(`/${slugDashboard}`)
	}

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
					w="100%"
				>
					<Title ta="center">Register Your Account</Title>
					<Text
						c="dimmed"
						ta="center"
						mt="sm"
					>
						Join Klop! to find your perfect candidate match
					</Text>
					<RegisterForm />
				</Container>
			</main>

			<Footer />
		</Stack>
	)
}
