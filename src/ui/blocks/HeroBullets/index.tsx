'use client';

import {
	Button,
	Container,
	Group,
	Image,
	List,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { Check } from 'lucide-react';
import Link from 'next/link';

import classes from '$styles/blocks/HeroBullets.module.css';

interface HeroBulletsProps {
	description?: string
	imageSrc?: string
}

export function HeroBullets({ description, imageSrc = '' }: HeroBulletsProps) {
	return (
		<Container size="md">
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className={classes.title}>
						Satu Dashboard untuk Rekrutmen yang <span className={classes.highlight}>Klop!</span>
					</Title>

					<Text
						c="dimmed"
						mt="md"
					>
						{description ||
							'Solusi lengkap bagi perusahaan: Kelola data perusahaan & lowongan, buat asesmen instan berbasis AI, bagikan tautan seleksi, dan tinjau hasil kandidat secara terpusat dan efisien.'}
					</Text>

					<List
						mt={30}
						spacing="sm"
						size="sm"
						icon={
							<ThemeIcon
								size={20}
								radius="xl"
							>
								<Check size={12} />
							</ThemeIcon>
						}
					>
						<List.Item>
							<b>Manajemen Data Terpusat</b> – Buat profil perusahaan & lowongan, langsung aktif di dashboard.
						</List.Item>
						<List.Item>
							<b>AI Assessment Generator</b> – Otomatis buat soal, opsi jawaban, dan kunci jawaban presisi.
						</List.Item>
						<List.Item>
							<b>Bagikan & Tinjau</b> – Salin link seleksi ke mana saja & review submission kandidat dengan mudah.
						</List.Item>
					</List>

					<Group mt={30}>
						<Button
							component={Link}
							href="/register"
							radius="xl"
							size="md"
							className={classes.control}
						>
							Daftar Perusahaan
						</Button>
						<Button
							component={Link}
							href="/login"
							variant="default"
							radius="xl"
							size="md"
							className={classes.control}
						>
							Masuk Dashboard
						</Button>
					</Group>
				</div>

				{/* Gambar Ilustrasi */}
				<Image
					src={imageSrc}
					className={classes.image}
					alt="Ilustrasi Dashboard Owner Klop"
				/>
			</div>
		</Container>
	)
}