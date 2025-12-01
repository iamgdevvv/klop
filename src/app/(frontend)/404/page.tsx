import Footer from '$layouts/Footer'
import Header from '$layouts/Header'

export default async function notFoundPage() {
	return (
		<>
			<Header />
			<h1>Not Found Page</h1>
			<Footer />
		</>
	)
}
