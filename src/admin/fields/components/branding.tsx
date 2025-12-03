import { Link } from '@payloadcms/ui'

import Image from '$components/Image'

export const Icon = () => {
	return (
		<Link href="/">
			<Image
				src="/favicon.jpg"
				alt="Klop! Logo"
				width={20}
				height={20}
			/>
		</Link>
	)
}

export const Logo = () => {
	return (
		<Link href="/">
			<Image
				src="/logo.svg"
				alt="Klop! Logo"
				width={178}
				height={80}
			/>
		</Link>
	)
}
