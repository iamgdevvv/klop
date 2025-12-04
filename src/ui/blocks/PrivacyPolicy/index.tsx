import { Box, Card, Container, List, ListItem, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { Check } from 'lucide-react'

export function PrivacyPolicy() {
	return (
		<Container size="md">
			<Box
				mb={50}
				ta="center"
			>
				<Title
					order={1}
					fz={{ base: 36, md: 54 }}
					fw={900}
					style={{ letterSpacing: -1 }}
				>
					Privacy Policy
				</Title>
				<Text
					c="dimmed"
					mt="sm"
					fz="lg"
				>
					Terakhir diperbarui: Desember 2025
				</Text>
			</Box>

			<Card
				withBorder
				radius="xl"
				p={{
					base: 'xl',
					md: 80,
				}}
			>
				<Stack gap="xl">
					<Stack gap="sm">
						<Title order={3}>1. Pendahuluan</Title>
						<Text
							lh={1.6}
							c="dimmed"
						>
							Selamat datang di{' '}
							<Text
								span
								fw={700}
							>
								Klop!
							</Text>{' '}
							(&quot;kami&quot;). Privasi Anda adalah prioritas utama kami. Kebijakan
							Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
							melindungi data Anda saat Anda menggunakan platform asesmen berbasis AI
							kami.
						</Text>
					</Stack>

					<Stack gap="sm">
						<Title order={3}>2. Data yang Kami Kumpulkan</Title>
						<Text c="dimmed">
							Agar Klop! dapat bekerja maksimal, kami mengumpulkan:
						</Text>
						<List
							spacing="sm"
							icon={
								<ThemeIcon
									size={6}
									color="blue"
									radius="xl"
									pos="relative"
									top={-5}
								>
									<Box />
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text
									span
									fw={700}
								>
									Data Identitas:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Nama, email, nomor telepon.
								</Text>
							</ListItem>
							<ListItem>
								<Text
									span
									fw={700}
								>
									Data Asesmen:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Jawaban tes dan skor AI.
								</Text>
							</ListItem>
							<ListItem>
								<Text
									span
									fw={700}
								>
									Data Perangkat:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									IP address dan log aktivitas.
								</Text>
							</ListItem>
						</List>
					</Stack>

					<Stack gap="sm">
						<Title order={3}>3. Penggunaan Informasi</Title>
						<List
							spacing="xs"
							icon={
								<ThemeIcon
									color="transparent"
									c="blue.6"
									pos="relative"
									top={2}
								>
									<Check size={18} />
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text c="dimmed">
									Memproses hasil asesmen menggunakan algoritma AI.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Memberikan rekomendasi kandidat yang &quot;klop&quot;.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">Meningkatkan akurasi sistem penilaian.</Text>
							</ListItem>
						</List>
					</Stack>

					<Stack gap="xs">
						<Title order={4}>Hubungi Kami</Title>
						<Text c="dimmed">
							Email:{' '}
							<Text
								span
								c="blue.6"
								component="a"
								href="mailto:privacy@klop.ai"
							>
								privacy@klop.ai
							</Text>
						</Text>
					</Stack>
				</Stack>
			</Card>
		</Container>
	)
}
