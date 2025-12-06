'use client'

import { Box, Card, Container, List, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { Check } from 'lucide-react'

export function PrivacyPolicy() {
	return (
		<Container size="md">
			{/* HEADER SEDERHANA */}
			<Box
				mb={50}
				ta="center"
			>
				<Title
					order={1}
					fz={{ base: 36, md: 54 }}
					fw={900}
				>
					Kebijakan Privasi
				</Title>
				<Text
					c="dimmed"
					mt="sm"
					fz="lg"
				>
					Terakhir diperbarui: Desember 2025
				</Text>
			</Box>

			{/* KONTEN KARTU */}
			<Card
				withBorder
				radius="xl"
				p={{ base: 'xl', md: 80 }}
				bg="white"
			>
				<Stack gap="xl">
					{/* 1. Pendahuluan */}
					<Stack gap="sm">
						<Title order={3}>1. Pendahuluan</Title>
						<Text
							lh={1.7}
							c="dimmed"
						>
							Selamat datang di{' '}
							<Text
								span
								fw={700}
								c="dark"
							>
								Klop!
							</Text>{' '}
							(&quot;kami&quot;, &quot;kita&quot;, atau &quot;milik kami&quot;). Klop!
							adalah platform rekrutmen berbasis kecerdasan buatan (AI) yang dirancang
							untuk membantu perusahaan menemukan kandidat yang paling sesuai
							(&quot;klop&quot;) melalui asesmen otomatis, manajemen lowongan
							terpusat, dan evaluasi objektif.
						</Text>
						<Text
							lh={1.7}
							c="dimmed"
						>
							Kami berkomitmen untuk melindungi privasi data pribadi Anda, baik Anda
							sebagai Perusahaan (Pemberi Kerja) maupun sebagai Kandidat (Pencari
							Kerja). Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
							menggunakan, mengungkapkan, dan mengamankan informasi Anda.
						</Text>
					</Stack>

					{/* 2. Informasi yang Kami Kumpulkan */}
					<Stack gap="sm">
						<Title order={3}>2. Informasi yang Kami Kumpulkan</Title>
						<Text c="dimmed">
							Untuk mendukung fitur canggih seperti Asesmen AI dan Sistem Anti-Curang,
							kami mengumpulkan beberapa jenis data:
						</Text>
						<List
							spacing="md"
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
							<List.Item>
								<Text
									span
									fw={700}
									c="dark"
								>
									Data Akun & Profil:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Informasi pendaftaran seperti nama lengkap, alamat email, nomor
									telepon, nama perusahaan, industri, dan struktur organisasi
									untuk keperluan manajemen dashboard.
								</Text>
							</List.Item>
							<List.Item>
								<Text
									span
									fw={700}
									c="dark"
								>
									Data Karir & Lamaran:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Untuk kandidat, kami mengumpulkan riwayat pekerjaan, pendidikan,
									tautan portofolio, CV/Resume, dan preferensi pekerjaan.
								</Text>
							</List.Item>
							<List.Item>
								<Text
									span
									fw={700}
									c="dark"
								>
									Data Asesmen & Interaksi AI:
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Jawaban yang Anda berikan selama tes, waktu pengerjaan per soal,
									dan pola interaksi yang dianalisis oleh AI kami untuk
									menghasilkan skor kompetensi dan wawasan kepribadian (insight).
								</Text>
							</List.Item>
							<List.Item>
								<Text
									span
									fw={700}
									c="dark"
								>
									Data Integritas & Pemantauan (Anti-Curang):
								</Text>{' '}
								<Text
									span
									c="dimmed"
								>
									Demi menjaga keadilan ujian, sistem kami memantau aktivitas
									browser selama sesi asesmen, termasuk status layar penuh
									(fullscreen), perpindahan tab (tab switching), dan deteksi
									kursor keluar area ujian.
								</Text>
							</List.Item>
						</List>
					</Stack>

					{/* 3. Penggunaan Informasi */}
					<Stack gap="sm">
						<Title order={3}>3. Bagaimana Kami Menggunakan Informasi Anda</Title>
						<Text c="dimmed">
							Data Anda digunakan untuk memaksimalkan fitur utama Klop!:
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
							<List.Item>
								<Text c="dimmed">
									Memfasilitasi pembuatan dan pengelolaan lowongan kerja secara
									terpusat.
								</Text>
							</List.Item>
							<List.Item>
								<Text c="dimmed">
									Melatih dan menjalankan algoritma AI untuk meracik pertanyaan
									relevan dan menilai jawaban secara otomatis.
								</Text>
							</List.Item>
							<List.Item>
								<Text c="dimmed">
									Memastikan integritas proses seleksi melalui sistem evaluasi
									real-time dan deteksi kecurangan.
								</Text>
							</List.Item>
							<List.Item>
								<Text c="dimmed">
									Memberikan rekomendasi pencocokan (matching) yang akurat antara
									kualifikasi kandidat dan kebutuhan perusahaan.
								</Text>
							</List.Item>
							<List.Item>
								<Text c="dimmed">
									Mengirimkan notifikasi hasil asesmen dan status lamaran kerja.
								</Text>
							</List.Item>
						</List>
					</Stack>

					{/* 4. Keamanan Data */}
					<Stack gap="sm">
						<Title order={3}>4. Keamanan & Penyimpanan Data</Title>
						<Text
							lh={1.7}
							c="dimmed"
						>
							Kami menerapkan langkah-langkah keamanan teknis standar industri untuk
							melindungi data Anda. Hasil asesmen AI disimpan secara terenkripsi dan
							hanya dapat diakses oleh Perusahaan yang membuka lowongan tersebut. Kami
							tidak akan menjual data pribadi Anda kepada pihak ketiga untuk tujuan
							pemasaran tanpa persetujuan Anda.
						</Text>
					</Stack>

					{/* 5. Hak Pengguna */}
					<Stack gap="sm">
						<Title order={3}>5. Hak Anda</Title>
						<Text
							lh={1.7}
							c="dimmed"
						>
							Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan
							data pribadi Anda dari sistem kami. Kandidat juga berhak mengetahui
							kriteria dasar penilaian yang digunakan oleh AI dalam proses seleksi.
						</Text>
					</Stack>

					{/* Footer Kontak */}
					<Stack
						gap="xs"
						mt="lg"
						pt="xl"
						className="border-t border-dashed border-gray-300"
					>
						<Title order={4}>Hubungi Kami</Title>
						<Text c="dimmed">
							Jika Anda memiliki pertanyaan mengenai penggunaan data atau privasi di
							Klop!, silakan hubungi kami:
						</Text>
						<Text c="dimmed">
							Email:{' '}
							<Text
								span
								c="blue.6"
								component="a"
								href="mailto:privacy@klop.ai"
								td="none"
							>
								privacy@klop.ai
							</Text>
						</Text>
						<Text c="dimmed">Alamat: Jakarta, Indonesia</Text>
					</Stack>
				</Stack>
			</Card>
		</Container>
	)
}
