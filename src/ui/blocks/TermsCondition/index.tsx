import { Alert, Box, Container, List, ListItem, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { AlertCircle, Check } from 'lucide-react'

export function TermsConditions() {
	return (
		<Container
			size="md"
			py={60}
		>
			{/* --- HEADER POLOS (Sama seperti Privacy Policy) --- */}
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
					Terms & Conditions
				</Title>
				<Text
					c="dimmed"
					mt="sm"
					fz="lg"
				>
					Terakhir diperbarui: Desember 2025
				</Text>
			</Box>

			{/* --- KONTEN DOCUMENT --- */}
			{/* Box Putih dengan Border Tipis */}
			<Box
				bg="white"
				p={{ base: 'md', md: 50 }}
				style={{
					border: '1px solid var(--mantine-color-gray-2)',
					borderRadius: 8,
				}}
			>
				<Stack gap="xl">
					{/* Section 1 */}
					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							1. Persetujuan Syarat
						</Title>
						<Text
							lh={1.6}
							c="dimmed"
						>
							Dengan mengakses dan menggunakan platform{' '}
							<Text
								span
								fw={700}
								c="dark.9"
							>
								Klop!
							</Text>
							, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda
							tidak setuju dengan bagian mana pun dari syarat ini, mohon untuk tidak
							menggunakan layanan kami.
						</Text>
					</Box>

					{/* Section 2 */}
					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							2. Lisensi Penggunaan
						</Title>
						<Text
							mb="sm"
							c="dimmed"
						>
							Kami memberikan lisensi terbatas untuk mengakses layanan asesmen AI
							kami. Anda setuju untuk{' '}
							<Text
								span
								fw={700}
								c="red.6"
							>
								TIDAK
							</Text>
							:
						</Text>
						<List
							spacing="sm"
							icon={
								<ThemeIcon
									size={6}
									color="red"
									radius="xl"
								>
									<Box />
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text c="dimmed">
									Memodifikasi atau menyalin materi asesmen tanpa izin.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Menggunakan materi untuk tujuan komersial di luar platform
									Klop!.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Mencoba merekayasa balik (reverse engineer) algoritma AI kami.
								</Text>
							</ListItem>
						</List>
					</Box>

					{/* Section 3 (Penting untuk App Ujian) */}
					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							3. Integritas Asesmen
						</Title>
						<Alert
							variant="light"
							color="blue"
							title="Kejujuran adalah Kunci"
							icon={<AlertCircle />}
						>
							Pengguna wajib menjaga integritas selama proses asesmen. Tindakan
							kecurangan, joki, atau penggunaan alat bantu AI lain tanpa izin akan
							mengakibatkan diskualifikasi instan.
						</Alert>
					</Box>

					{/* Section 4 */}
					<Box>
						<Title
							order={3}
							c="blue.7"
							mb="sm"
						>
							4. Akun Pengguna
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
									Anda bertanggung jawab menjaga kerahasiaan password akun Anda.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Informasi yang Anda berikan harus akurat dan terbaru.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Klop! berhak menangguhkan akun yang melanggar ketentuan.
								</Text>
							</ListItem>
						</List>
					</Box>

					{/* Footer Contact */}
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
							Pertanyaan Hukum?
						</Title>
						<Text c="dimmed">
							Hubungi tim legal kami:{' '}
							<Text
								span
								c="blue.6"
								component="a"
								href="mailto:legal@klop.ai"
							>
								legal@klop.ai
							</Text>
						</Text>
					</Box>
				</Stack>
			</Box>
		</Container>
	)
}
