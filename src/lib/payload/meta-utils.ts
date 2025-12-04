import type { Metadata } from 'next'

import type { Asset, Company, Vacancy } from '$payload-types'
import type { PageQueried } from '$type'
import { assetUrl } from '$utils/common'

export async function generateMeta(
	doc: (Pick<Company | Vacancy, 'meta' | 'excerpt' | 'featuredImage' | 'title'> | PageQueried) & {
		robots?: string
		favicon?: number | Asset | null
		link: string
	},
): Promise<Metadata> {
	const siteTitle = 'Klop!'

	let ogImage = undefined
	let title = siteTitle
	let description = doc?.excerpt || undefined
	let favicon = '/favicon.jpg'

	if (doc.favicon) {
		favicon = assetUrl(doc.favicon)!
	}

	if (doc?.featuredImage && !ogImage) {
		ogImage = assetUrl(doc.featuredImage)
	}

	if (favicon && !ogImage) {
		ogImage = favicon
	}

	if (doc?.title) {
		title = `${doc.title} ⎯ ${siteTitle}`
	}

	if ('meta' in doc) {
		if (doc.meta?.title) {
			title = doc.meta.title
		}

		if (doc?.meta?.description) {
			description = doc.meta.description
		}

		if (doc?.meta?.image) {
			ogImage = assetUrl(doc.meta.image)
		}
	}

	return {
		title,
		description,
		robots:
			process.env.NEXT_PUBLIC_SITE_INDEX === 'false'
				? 'noindex, nofollow'
				: doc?.robots || 'index, follow',
		icons: favicon,
		openGraph: {
			description,
			images: ogImage,
			title,
			type: 'website',
			url: doc.link,
		},
		twitter: {
			site: siteTitle,
			description,
			title,
			images: ogImage,
		},
		pinterest: {
			richPin: true,
		},
		applicationName: siteTitle,
		alternates: {
			canonical: doc.link,
		},
	}
}
