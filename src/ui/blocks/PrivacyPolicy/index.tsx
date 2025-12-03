import { Box, Container, List, ListItem, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { Check } from 'lucide-react'

export function PrivacyPolicy() {
	return (
		<Container
			size="md"
			py={60}
		>
			<Box
				mb={50}
				ta="center"
			>
				<Title
					order={1}
					fz={{ base: 36, md: 54 }}
					fw={900}
					c="dark.9"
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

			<Box
				bg="white"
				p={{ base: 'md', md: 50 }}
				style={{
					border: '1px solid var(--mantine-color-gray-2)',
					borderRadius: 8,
				}}
			>
				<Stack gap="xl">
					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							1. Pendahuluan
						</Title>
						<Text
							lh={1.6}
							c="dimmed"
						>
							Selamat datang di{' '}
							<Text
								span
								fw={700}
								c="dark.9"
							>
								Klop!
							</Text>{' '}
							(&quot;kami&quot;). Privasi Anda adalah prioritas utama kami. Kebijakan
							Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
							melindungi data Anda saat Anda menggunakan platform asesmen berbasis AI
							kami.
						</Text>
					</Box>

					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							2. Data yang Kami Kumpulkan
						</Title>
						<Text
							mb="sm"
							c="dimmed"
						>
							Agar Klop! dapat bekerja maksimal, kami mengumpulkan:
						</Text>
						<List
							spacing="sm"
							icon={
								<ThemeIcon
									size={6}
									color="blue"
									radius="xl"
								>
									<Box />
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text
									span
									fw={700}
									c="dark.9"
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
									c="dark.9"
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
									c="dark.9"
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
					</Box>

					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							3. Penggunaan Informasi
						</Title>
						<List
							spacing="xs"
							icon={
								<ThemeIcon
									color="transparent"
									c="blue.6"
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
					</Box>

					<Box
						mt="xl"
						pt="xl"
						style={{ borderTop: '1px dashed var(--mantine-color-gray-3)' }}
					>
						<Title
							order={4}
							c="dark.9"
							mb="xs"
						>
							Hubungi Kami
						</Title>
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
					</Box>
				</Stack>
			</Box>
		</Container>
	)
}
