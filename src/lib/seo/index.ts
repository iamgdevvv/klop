import type { Graph, Thing } from 'schema-dts'

import { breadcrumbSchema } from '$seo/breadcrumb'
import { pageSchema } from '$seo/page'
import type { Queried } from '$type'

export type SeoDts = Queried

export const seoSchema = ({ data, collection }: SeoDts): Graph => {
	const graph: Thing[] = []

	// @ts-expect-error
	graph.push(breadcrumbSchema({ data, collection }))
	graph.push(pageSchema(data))

	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	}
}
