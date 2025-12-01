import type { Asset, Company, Vacancy } from '$payload-types'

export type PageQueried = {
	title: string
	slug: string
	excerpt?: string | null
	featuredImage?: number | Asset | null
}

export type Queried =
	| {
			collection: 'pages'
			data: PageQueried
	  }
	| {
			collection: 'companies'
			data: Company
	  }
	| {
			collection: 'vacancies'
			data: Vacancy
	  }
