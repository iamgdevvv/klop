import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import { getAuthUser } from '$server-functions/auth'

export default async function vacancyPage() {
	const authUser = await getAuthUser()

	return (
		<>
			<Header
				showActions={true}
				user={authUser}
			/>
			<h1>Vacancy Page</h1>
			<Footer />
		</>
	)
}
