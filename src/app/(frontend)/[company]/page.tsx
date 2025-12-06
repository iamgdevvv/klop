import { Stack } from '@mantine/core'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Company } from '$blocks/Company'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { slug404 } from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import { queryVacancies } from '$root/lib/server-functions/vacancy'
import { getAuthUser } from '$server-functions/auth'
import { queryCompanies } from '$server-functions/company'

type Args = {
	params: Promise<{
		company: string
	}>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
	const { company } = await params

	const companyResult = await queryCompanies({
		limit: 1,
		where: {
			slug: {
				equals: company,
			},
		},
	})

	if (companyResult?.docs.length) {
		const company = companyResult.docs[0]

		return generateMeta({
			...company,
			robots: 'index, follow',
			link: process.env.NEXT_PUBLIC_SITE_URL + '/' + company.slug,
		})
	}

	return {
		title: 'Company ⎯ Klop!',
	}
}

export default async function companyPage({ params }: Args) {
	const { company } = await params

	const [authUser, companyResult] = await Promise.all([
		getAuthUser(),
		queryCompanies({
			limit: 1,
			where: {
				slug: {
					equals: company,
				},
			},
		}),
	])

	if (!companyResult?.docs.length) {
		return redirect(`/${slug404}`)
	}

	const companyDoc = companyResult.docs[0]

	const vacancies = await queryVacancies({
		limit: 999999999999999,
		where: {
			company: {
				equals: companyDoc.id,
			},
		},
	})

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
				<Company
					data={companyDoc}
					vacancies={vacancies?.docs}
				/>
			</main>

			<Footer />
		</Stack>
	)
}
