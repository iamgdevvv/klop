import { Stack } from '@mantine/core'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { VacancyView } from '$blocks/VacancyView'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { slug404 } from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import type { VacancySubmission } from '$payload-types'
import { getAuthUser } from '$server-functions/auth'
import { queryCompanies } from '$server-functions/company'
import { queryVacancies } from '$server-functions/vacancy'
import { queryVacancySubmissions } from '$server-functions/vacancySubmission'

type Args = {
	params: Promise<{
		company: string
		vacancy: string
	}>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
	const { company, vacancy } = await params

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

		const vacancyResult = await queryVacancies({
			limit: 1,
			whereAnd: [
				{
					slug: {
						equals: vacancy,
					},
				},
				{
					company: {
						equals: company.id,
					},
				},
			],
		})

		if (vacancyResult?.docs.length) {
			const vacancData = vacancyResult.docs[0]

			return generateMeta({
				...vacancData,
				title: `${vacancData.title} di ${company.title}`,
				favicon: company.favicon,
				robots: 'index, follow',
				link: process.env.NEXT_PUBLIC_SITE_URL + '/' + company.slug + '/' + vacancy,
			})
		}
	}

	return {
		title: 'Company ⎯ Klop!',
	}
}

export default async function vacancyPage({ params }: Args) {
	const { vacancy, company } = await params

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

	const companyData = companyResult.docs[0]

	const vacancies = await queryVacancies({
		limit: 999999999999999,
		where: {
			company: {
				equals: companyData.id,
			},
		},
	})

	if (!vacancies?.docs.length) {
		return redirect(`/${companyData.slug}`)
	}

	const vacancyData = vacancies.docs.find((v) => v.slug === vacancy)

	if (!vacancyData) {
		return redirect(`/${companyData.slug}`)
	}

	let userVacancySubmission: VacancySubmission | null = null

	if (authUser) {
		const vacancySubmissionResult = await queryVacancySubmissions({
			limit: 1,
			whereOr: [
				{
					vacancyReference: {
						equals: vacancyData.id,
					},
				},
				{
					userCandidateCompany: {
						in: [authUser.id],
					},
				},
				{
					['candidate.email']: {
						equals: authUser.email,
					},
				},
				{
					['candidate.phone']: {
						equals: authUser.phone,
					},
				},
			],
		})

		if (vacancySubmissionResult?.docs.length) {
			userVacancySubmission = vacancySubmissionResult.docs[0]

			const vacancyIdSubmissionResult: number | undefined =
				typeof userVacancySubmission.vacancyReference === 'number'
					? userVacancySubmission.vacancyReference
					: userVacancySubmission.vacancyReference?.id

			if (!vacancyIdSubmissionResult || vacancyIdSubmissionResult !== vacancyData.id) {
				userVacancySubmission = null
			}
		}
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
				<VacancyView
					data={vacancyData}
					company={companyData}
					vacancies={vacancies.docs}
					authUser={authUser}
					userVacancySubmission={userVacancySubmission}
				/>
			</main>

			<Footer />
		</Stack>
	)
}
