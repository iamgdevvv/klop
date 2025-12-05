import { Anchor, Divider, Group, Stack, Text, type StackProps } from '@mantine/core'

import Link from '$components/Link'
import { slugPrivacyPolicy, slugTermCondition } from '$modules/vars'

const CURRENT_YEAR = new Date().getFullYear()

export type FooterProps = StackProps

export default function Footer(props: FooterProps) {
	return (
		<Stack
			{...props}
			component="footer"
			data-slot="footer"
			pb={props.pb || 'lg'}
		>
			<Divider mb="lg" />
			<Group
				justify="space-between"
				className="container"
			>
				<Text size="sm">&copy; {CURRENT_YEAR} Klop!</Text>
				<Group
					gap="xs"
					ml="auto"
				>
					<Anchor
						component={Link}
						href={`/${slugPrivacyPolicy}`}
						target="_blank"
					>
						Kebijakan Privasi
					</Anchor>
					<Anchor
						component={Link}
						href={`/${slugTermCondition}`}
						target="_blank"
					>
						Syarat & Ketentuan
					</Anchor>
				</Group>
			</Group>
		</Stack>
	)
}
