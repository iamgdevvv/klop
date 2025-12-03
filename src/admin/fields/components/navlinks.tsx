import { Link, NavGroup } from '@payloadcms/ui'

import Image from '$components/Image'
import { slugDashboard } from '$modules/vars'

export const BeforeNavLinks = () => {
	return (
		<div>
			<Link
				href="/"
				target="_blank"
			>
				<Image
					src="/logo.svg"
					alt="Klop! Logo"
					width={80}
					height={36}
				/>
			</Link>
			<br />
			<NavGroup
				label="General"
				isOpen
			>
				<Link
					href={`/${slugDashboard}`}
					className="nav__link"
				>
					⚙️ Dashboard
				</Link>
				<Link
					href="/"
					target="_blank"
					className="nav__link"
				>
					🌐 Website
				</Link>
			</NavGroup>
		</div>
	)
}
