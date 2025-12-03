import { queryVacancies } from '$server-functions/vacancy'
import { notFound, redirect } from 'next/navigation'

type Args = {
	params: Promise<{
		companyId: string
		slug: string
	}>
}

export default async function shortCompanyPage({ params: paramsPromise }: Args) {
	const { companyId, slug } = await paramsPromise

	const vacancyResult = await queryVacancies(
		{
			limit: 1,
			where: {
				and: [
					{
						slug: {
							equals: slug,
						},
					},
					{
						company: {
							equals: Number(companyId),
						},
					},
				],
			},
		},
		{
			slug: true,
			company: true,
		},
	)

	if (vacancyResult?.docs.length) {
		const vacancy = vacancyResult.docs[0]

		if (typeof vacancy.company === 'object') {
			return redirect(`/${vacancy.company.slug}/${vacancy.slug}`)
		}
	}

	return notFound()
}
