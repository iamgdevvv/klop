import type { BreadcrumbList, ListItem } from 'schema-dts'

import type { SeoDts } from '$seo/index'

export const breadcrumbSchema = ({ data, collection }: SeoDts): BreadcrumbList => {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

	const itemListElement = (): ListItem[] => {
		const listElements: ListItem[] = []

		listElements.push({
			'@type': 'ListItem',
			position: listElements.length + 1,
			name: 'Klop!',
			item: siteUrl,
		})

		if (collection === 'pages') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title,
				item: `${siteUrl}/${data.slug}`,
			})
		}

		if (collection === 'companies') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title,
				item: `${siteUrl}/${data.slug}`,
			})
		}

		if (collection === 'vacancies') {
			const company = typeof data.company === 'object' ? data.company : null

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: company?.title || 'Unknown',
				item: `${siteUrl}/${company?.slug || 'unknown'}`,
			})

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title,
				item: `${siteUrl}/${company?.slug || 'unknown'}/${data.slug}`,
			})
		}

		listElements.push({
			'@type': 'ListItem',
			position: listElements.length + 1,
			name: data.title,
		})

		return listElements
	}

	return {
		'@type': 'BreadcrumbList',
		itemListElement: itemListElement(),
	}
}
