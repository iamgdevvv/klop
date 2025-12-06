'use client'

import {
	Alert,
	Box,
	Card,
	Container,
	Divider,
	List,
	ListItem,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core'
import { Check, ShieldAlert } from 'lucide-react'

export function TermsConditions() {
	return (
		<Container size="md">
			{/* HEADER */}
			<Stack
				gap="sm"
				mb="xl"
				ta="center"
			>
				{/* UPDATE: Judul diubah ke Bahasa Indonesia */}
				<Title
					order={1}
					fz={{ base: 36, md: 54 }}
					fw={900}
					c="dark.9"
				>
					Syarat & Ketentuan
				</Title>
				<Text
					c="dimmed"
					fz="lg"
				>
					Terakhir diperbarui: Desember 2025
				</Text>
			</Stack>

			{/* KONTEN KARTU */}
			<Card
				withBorder
				radius="xl"
				p={{ base: 'xl', md: 80 }}
				bg="white"
			>
				<Stack gap="xl">
					{/* 1. Ketentuan Umum */}
					<Stack gap="sm">
						<Title order={3}>1. Ketentuan Umum</Title>
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
							</Text>
							. Dengan mengakses platform kami, baik sebagai <b>Perusahaan</b> maupun{' '}
							<b>Kandidat</b>, Anda setuju untuk terikat oleh syarat dan ketentuan
							ini. Layanan kami mencakup penyediaan sistem manajemen lowongan dan alat
							asesmen berbasis AI.
						</Text>
					</Stack>

					{/* 2. Akun & Keamanan */}
					<Stack gap="sm">
						<Title order={3}>2. Akun Pengguna</Title>
						<List
							spacing="sm"
							icon={
								<ThemeIcon
									size={6}
									color="blue"
									radius="xl"
									mt={8}
								>
									<Box />
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text c="dimmed">
									<b>Untuk Perusahaan:</b> Anda bertanggung jawab penuh atas
									kebenaran informasi perusahaan dan lowongan yang Anda posting.
									Klop! berhak menghapus konten yang melanggar hukum atau norma.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									<b>Untuk Kandidat:</b> Anda wajib memberikan data diri yang
									akurat. Satu pengguna hanya diperbolehkan memiliki satu akun
									aktif.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda.
									Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung
									jawab Anda sepenuhnya.
								</Text>
							</ListItem>
						</List>
					</Stack>

					{/* 3. Integritas Asesmen (PENTING) */}
					<Stack gap="sm">
						<Title order={3}>3. Integritas & Anti-Kecurangan</Title>
						<Alert
							variant="light"
							color="red"
							title="Peringatan Keras"
							icon={<ShieldAlert size={16} />}
							radius="md"
						>
							Klop! menggunakan teknologi pemantauan canggih untuk menjaga keadilan
							seleksi. Pelanggaran terhadap poin ini dapat mengakibatkan
							diskualifikasi instan dan pemblokiran akun permanen (blacklist).
						</Alert>
						<Text
							c="dimmed"
							mt="xs"
						>
							Selama pengerjaan asesmen, Kandidat dilarang keras untuk:
						</Text>
						<List
							spacing="xs"
							icon={
								<ThemeIcon
									size={16}
									color="red"
									radius="xl"
									variant="light"
								>
									<Paper
										w={6}
										h={6}
										bg="currentColor"
										radius="50%"
									/>
								</ThemeIcon>
							}
						>
							<ListItem>
								<Text c="dimmed">
									Keluar dari mode layar penuh (fullscreen) browser.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Membuka tab baru, aplikasi lain, atau alat bantu AI eksternal.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Menggunakan joki atau bantuan orang lain dalam mengerjakan soal.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Menyalin, memotret, atau menyebarluaskan materi soal asesmen
									milik Klop!.
								</Text>
							</ListItem>
						</List>
					</Stack>

					{/* 4. Layanan AI & Penafian */}
					<Stack gap="sm">
						<Title order={3}>4. Layanan AI & Hasil Seleksi</Title>
						<Text
							lh={1.6}
							c="dimmed"
						>
							Klop! menggunakan algoritma Artificial Intelligence untuk membantu
							proses <i>screening</i> dan penilaian. Namun:
						</Text>
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
									Keputusan akhir penerimaan karyawan sepenuhnya berada di tangan
									Perusahaan, bukan sistem Klop!.
								</Text>
							</ListItem>
							<ListItem>
								<Text c="dimmed">
									Klop! tidak menjamin keakuratan 100% dari prediksi kecocokan AI,
									namun kami terus berupaya meningkatkan akurasi model kami.
								</Text>
							</ListItem>
						</List>
					</Stack>

					{/* 5. Hak Kekayaan Intelektual */}
					<Stack gap="sm">
						<Title order={3}>5. Hak Kekayaan Intelektual</Title>
						<Text c="dimmed">
							Seluruh materi, desain antarmuka, kode sumber, dan algoritma soal pada
							platform Klop! adalah hak milik eksklusif kami dan dilindungi oleh
							undang-undang hak cipta. Penggunaan tanpa izin tertulis adalah
							pelanggaran hukum.
						</Text>
					</Stack>

					<Divider />

					{/* Footer Legal */}
					<Stack gap="sm">
						<Title order={4}>Hubungi Tim Legal</Title>
						<Text c="dimmed">
							Jika Anda menemukan pelanggaran terhadap syarat ini, silakan laporkan
							ke:{' '}
							<Text
								span
								c="blue.6"
								component="a"
								href="mailto:legal@klop.ai"
								fw={600}
								td="none"
							>
								legal@klop.ai
							</Text>
						</Text>
					</Stack>
				</Stack>
			</Card>
		</Container>
	)
}
