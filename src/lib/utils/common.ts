import type { Asset } from '$payload-types'

export function isServer() {
	return typeof window === 'undefined'
}

export function slugify(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/^\s+|\s+$/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
}

export function assetUrl(asset: number | Asset | null | undefined): string | undefined {
	if (!asset) return undefined

	if (typeof asset === 'number') return `/api/media/${asset}`

	if (asset.url) return asset.url

	return undefined
}

export function printSalary(salary: number) {
	return salary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}

export function formatCompactNumber(angka: number): string {
	if (angka >= 1_000_000) {
		const hasil = angka / 1_000_000

		return `${parseFloat(hasil.toFixed(2))} juta`
	} else if (angka >= 1_000) {
		const hasil = angka / 1_000
		return `${parseFloat(hasil.toFixed(2))} ribu`
	}

	return angka.toString()
}
