import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { RegisterCandidateForm } from '$blocks/RegisterForm'
import Link from '$components/Link'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { slugDashboard, slugDashboardLogin } from '$modules/vars'
import { getAuthUser } from '$server-functions/auth'

export const metadata: Metadata = {
	title: 'Buat Akun Kandidat ⎯ Klop!',
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
				showActions
				user={authUser}
			/>

			<main className="main">
				<Container
					size="sm"
					w="100%"
				>
					<Title ta="center">Register Your Account Kandidat</Title>
					<Text
						c="dimmed"
						ta="center"
						mt="sm"
					>
						Join Klop! to find your perfect candidate match
					</Text>
					<RegisterCandidateForm />
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
				</Container>
			</main>

			<Footer />
		</Stack>
	)
}
