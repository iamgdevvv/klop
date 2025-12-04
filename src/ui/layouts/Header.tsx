import { ActionIcon, Button, Group, Stack, type StackProps } from '@mantine/core'
import { LogIn, Settings, UserRoundPlus } from 'lucide-react'

import Image from '$components/Image'
import Link from '$components/Link'
import { slugDashboard, slugDashboardLogin, slugRegister } from '$modules/vars'
import type { User } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/header.module.css'

export type HeaderProps = {
	user?: User | null
	showActions?: boolean
} & StackProps

export default function Header({ user, showActions, ...props }: HeaderProps) {
	return (
		<Stack
			{...props}
			component="header"
			data-slot="header"
			py={props.py || 'md'}
			className={cx(styles.header, props.className)}
		>
			<Group
				justify="space-between"
				className="container"
			>
				<Link
					href="/"
					aria-label="Home"
					className={styles.logo}
				>
					<span className="sr-only">Logo</span>
					<Image
						src="/logo.svg"
						width={80}
						height={36}
					/>
				</Link>
				{showActions ? (
					<Group gap="sm">
						{user ? (
							<>
								<Button
									component={Link}
									href={`/${slugDashboard}`}
									visibleFrom="lg"
								>
									Dashboard
								</Button>
								<ActionIcon
									component={Link}
									href={`/${slugDashboard}`}
									hiddenFrom="md"
								>
									<Settings />
								</ActionIcon>
							</>
						) : (
							<>
								<Button
									component={Link}
									variant="subtle"
									href={`/${slugRegister}`}
									visibleFrom="lg"
								>
									Sign up
								</Button>
								<Button
									component={Link}
									href={`/${slugDashboardLogin}`}
									visibleFrom="lg"
								>
									Sign in
								</Button>
								<ActionIcon
									component={Link}
									variant="subtle"
									href={`/${slugRegister}`}
									hiddenFrom="md"
								>
									<UserRoundPlus />
								</ActionIcon>
								<ActionIcon
									component={Link}
									variant="subtle"
									href={`/${slugDashboardLogin}`}
									hiddenFrom="md"
								>
									<LogIn />
								</ActionIcon>
							</>
						)}
					</Group>
				) : null}
			</Group>
		</Stack>
	)
}
