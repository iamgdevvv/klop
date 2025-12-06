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
	type ContainerProps,
} from '@mantine/core'
import { Check } from 'lucide-react'

import Link from '$components/Link'
import { slugCompanies, slugDashboard, slugRegister } from '$modules/vars'
import type { User } from '$payload-types'

import classes from '$styles/blocks/HeroBullets.module.css'

type Props = {
	user: User | null
} & ContainerProps

export function HeroBullets({ user, ...props }: Props) {
	return (
		<Container
			{...props}
			size={props.size || 'md'}
		>
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className={classes.title}>
						Satu Dashboard untuk Rekrutmen yang{' '}
						<span className={classes.highlight}>Klop!</span>
					</Title>

					<Text
						c="dimmed"
						mt="md"
					>
						Solusi lengkap bagi perusahaan: Kelola data perusahaan & lowongan, buat
						asesmen instan berbasis AI, bagikan tautan seleksi, dan tinjau hasil
						kandidat secara terpusat dan efisien.
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
							<b>Manajemen Data Terpusat</b> – Buat profil perusahaan & lowongan,
							langsung aktif di dashboard.
						</ListItem>
						<ListItem>
							<b>AI Assessment Generator</b> – Otomatis buat soal, opsi jawaban, dan
							kunci jawaban presisi.
						</ListItem>
						<ListItem>
							<b>Bagikan & Tinjau</b> – Salin link seleksi ke mana saja & review
							submission kandidat dengan mudah.
						</ListItem>
					</List>

					<Group mt={30}>
						{user?.role === 'candidate' ? (
							<>
								<Button
									component={Link}
									href={`/${slugCompanies}`}
									radius="xl"
									size="md"
									className={classes.control}
								>
									Telusuri Perusahaan
								</Button>
								<Button
									component={Link}
									href={`/${slugDashboard}/account`}
									radius="xl"
									size="md"
									className={classes.control}
								>
									Profil Saya
								</Button>
							</>
						) : user?.role === 'company' ? (
							<>
								<Button
									component={Link}
									href={`/${slugDashboard}/collections/assessmentSubmissions`}
									radius="xl"
									size="md"
									className={classes.control}
								>
									Assessmen Kandidat
								</Button>
								<Button
									component={Link}
									href={`/${slugDashboard}/collections/vacancySubmissions`}
									radius="xl"
									size="md"
									className={classes.control}
								>
									Lamaran Kandidat
								</Button>
							</>
						) : (
							<>
								<Button
									component={Link}
									href={`/${slugRegister}`}
									radius="xl"
									size="md"
									className={classes.control}
								>
									Daftar sebagai Perusahaan
								</Button>
								<Button
									component={Link}
									href={`/${slugRegister}/candidate`}
									variant="default"
									radius="xl"
									size="md"
									className={classes.control}
								>
									Daftar sebagai Kandidat
								</Button>
							</>
						)}
					</Group>
				</div>

				<Image
					src="/images/hero-banner.png"
					className={classes.image}
					width={400}
					height={400}
					alt="Ilustrasi Dashboard Owner Klop"
				/>
			</div>
		</Container>
	)
}