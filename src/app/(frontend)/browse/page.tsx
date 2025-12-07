import { Stack } from '@mantine/core'
import type { Metadata } from 'next'

import { BrowseCompanies } from '$blocks/BrowseCompanies'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'
import { queryCompanies } from '$server-functions/company'

export const metadata: Metadata = {
	title: 'Temukan Perusahaan ⎯ Klop!',
	robots: 'index, follow',
}

type Args = {
	searchParams: Promise<{ search: string | undefined }>
}

export default async function browseCompaniesPage({ searchParams }: Args) {
	const { search } = await searchParams
	const [authUser, companiesResult] = await Promise.all([
		getAuthUser(),
		queryCompanies({
			limit: 80,
			search,
		}),
	])

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
				<BrowseCompanies companies={companiesResult?.docs || []} />
			</main>

			<Footer />
		</Stack>
	)
}
