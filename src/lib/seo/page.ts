import type { WebPage } from 'schema-dts'

import type { PageQueried } from '$type'

export const pageSchema = (data: PageQueried): WebPage => {
	return {
		'@type': 'WebPage',
		name: data.title,
		headline: data.title,
		description: data.excerpt || undefined,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/${data.slug}`,
		image: `${process.env.NEXT_PUBLIC_SITE_URL}${data.featuredImage}`,
	}
}
