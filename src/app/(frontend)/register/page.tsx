import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { RegisterForm } from '$blocks/RegisterForm'
import Link from '$components/Link'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { slugDashboard, slugDashboardLogin, slugRegister } from '$modules/vars'
import { getAuthUser } from '$server-functions/auth'

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
					<Text
						ta="center"
						mt="md"
					>
						Sudah memiliki akun?{' '}
						<Anchor
							component={Link}
							href={`/${slugDashboardLogin}`}
							fw={700}
						>
							Login
						</Anchor>
					</Text>
					<Text
						ta="center"
						mt={4}
						c="dimmed"
					>
						Mendaftar sebagai kandidat?{' '}
						<Anchor
							component={Link}
							href={`/${slugRegister}/candidate`}
							fw={700}
							c="dimmed"
						>
							Daftar (kandidat)
						</Anchor>
					</Text>
				</Container>
			</main>

			<Footer />
		</Stack>
	)
}
