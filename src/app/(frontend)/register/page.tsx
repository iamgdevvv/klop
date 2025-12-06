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
				showActions
				user={authUser}
			/>

			<main className="main">
				<Container
					size="sm"
					w="100%"
				>
					<Title ta="center">Daftar Akun</Title>
					<Text
						c="dimmed"
						ta="center"
						mt="sm"
					>
						Bergabunglah dengan Klop! untuk menemukan kandidat terbaik yang sesuai budaya perusahaan Anda.
					</Text>

					<RegisterForm />

					<Text
						ta="center"
						mt="md"
					>
						Sudah punya akun?{' '}
						<Anchor
							component={Link}
							href={`/${slugDashboardLogin}`}
							fw={700}
						>
							Masuk
						</Anchor>
					</Text>
					<Text
						ta="center"
						mt={4}
					>
						Ingin mendaftar sebagai kandidat?{' '}
						<Anchor
							component={Link}
							href={`/${slugRegister}/candidate`}
							fw={700}
							c="blue"
						>
							Daftar di sini
						</Anchor>
					</Text>
				</Container>
			</main>

			<Footer />
		</Stack>
	)
}