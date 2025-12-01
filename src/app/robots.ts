import type { MetadataRoute } from 'next'

import { slugAssessment, slugDashboard, slugDashboardLogin } from '$modules/vars'

export default async function robots(): Promise<MetadataRoute.Robots> {
	return {
		rules: {
			userAgent: '*',
			disallow:
				process.env.NEXT_PUBLIC_SITE_INDEX === 'true'
					? [
							'/admin/',
							`/${slugDashboard}/`,
							`/${slugDashboardLogin}/`,
							`/${slugAssessment}/`,
						]
					: '/',
		},
		sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
	}
}
