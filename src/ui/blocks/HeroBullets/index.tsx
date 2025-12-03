import {
	Button,
	Container,
	Group,
	Image,
	List,
	ListItem,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core'
import { Check } from 'lucide-react'

import classes from '$styles/blocks/HeroBullets.module.css'

interface HeroBulletsProps {
	description?: string
	imageSrc?: string
}

export function HeroBullets({ description, imageSrc = '' }: HeroBulletsProps) {
	return (
		<Container size="md">
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title>
						Temukan Kandidat yang <span className={classes.highlight}>Klop!</span>{' '}
						dengan Bantuan AI
					</Title>

					<Text
						c="dimmed"
						mt="md"
					>
						{description ||
							'Rekrutmen bukan sekadar mencari nilai tinggi, tapi menemukan kecocokan. Klop! membantu Anda meracik asesmen, menilai secara objektif, dan menemukan talenta yang benar-benar pas dengan kultur perusahaan.'}
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
						<ListItem>
							<b>Asesmen Otomatis</b> – AI meracik pertanyaan yang relevan dan
							presisi.
						</ListItem>
						<ListItem>
							<b>Penilaian Objektif</b> – Hilangkan bias dengan *scoring* instan dan
							adil.
						</ListItem>
						<ListItem>
							<b>Insight Kandidat</b> – Keputusan lebih percaya diri dengan data
							kecocokan.
						</ListItem>
					</List>

					<Group mt={30}>
						<Button
							radius="xl"
							size="md"
							className={classes.control}
						>
							Coba Klop! Sekarang
						</Button>
						<Button
							variant="default"
							radius="xl"
							size="md"
							className={classes.control}
						>
							Pelajari Cara Kerja
						</Button>
					</Group>
				</div>

				{/* Gambar Ilustrasi */}
				{/* Class image di CSS sudah mengatur agar responsive */}
				<Image
					src={imageSrc}
					className={classes.image}
					alt="Ilustrasi Seleksi Kandidat Klop"
				/>
			</div>
		</Container>
	)
}
