import {
	Alert,
	Anchor,
	Badge,
	Card,
	Container,
	Divider,
	Grid,
	GridCol,
	Group,
	Paper,
	Stack,
	Text,
	Title,
	type ContainerProps,
} from '@mantine/core'
import dayjs from 'dayjs'
import { Building, FolderClock, GraduationCap, PersonStanding } from 'lucide-react'

import Link from '$components/Link'
import Richtext from '$components/Richtext'
import FormApplyVacancy from '$forms/ApplyVacancy'
import { slugDashboard } from '$modules/vars'
import { vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import type { Company, User, Vacancy, VacancySubmission } from '$payload-types'
import { formatCompactNumber } from '$utils/common'
import { cx } from '$utils/styles'

type Props = {
	data: Vacancy
	vacancies: Vacancy[]
	company: Company
	authUser: User | null
	userVacancySubmission: VacancySubmission | null
} & ContainerProps

export function VacancyView({
	data,
	vacancies,
	company,
	authUser,
	userVacancySubmission,
	...props
}: Props) {
	const type = vacancyType.find((t) => t.value === data.type)
	const level = vacancyLevel.find((l) => l.value === data.level)
	const education = vacancyEducation.find((e) => e.value === data.education)
	const isExpired = dayjs(data.expiresAt).isAfter(dayjs())

	const sortedVacancies = vacancies.sort((a, b) => {
		const aIsOpen = !a.closeVacancy && dayjs(a.expiresAt).isAfter(dayjs())
		const bIsOpen = !b.closeVacancy && dayjs(b.expiresAt).isAfter(dayjs())

		return aIsOpen === bIsOpen ? 0 : aIsOpen ? 1 : -1
	})

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			<Grid gutter="xl">
				<GridCol span={{ base: 12, md: 4 }}>
					<Stack gap="xs">
						<Title order={4} size="h4">
							Posisi Tersedia
						</Title>
						<Text
							size="sm"
							c="dimmed"
						>
							Lowongan lain di {company.title} ({vacancies.length})
						</Text>
					</Stack>

					<Stack
						gap="sm"
						mt="lg"
					>
						{sortedVacancies.map((vacancy, index) => {
							const isActive = vacancy.id === data.id
							const closeVacancy =
								vacancy.closeVacancy || dayjs(vacancy.expiresAt).isAfter(dayjs())

							return (
								<Card
									key={`${vacancy.id}-${index}`}
									component={Link}
									href={closeVacancy ? '#' : `/${company.slug}/${vacancy.slug}`}
									radius="md"
									p="md"
									withBorder
									bg={closeVacancy ? 'gray.1' : isActive ? 'blue.0' : 'white'}
									className={cx(closeVacancy && 'pointer-events-none')}
								>
									<Title
										order={5}
										size="h6"
										mb="sm"
										c={isActive ? 'blue.9' : 'dark.9'}
									>
										{vacancy.title}
									</Title>
									<Group justify="space-between">
										<Text
											size="xs"
											c="dimmed"
										>
											{company.title}
										</Text>
										<Text
											size="xs"
											fw={700}
											c={isActive ? 'blue.6' : 'green.6'}
										>
											{[vacancy.fromExpectedSalary, vacancy.toExpectedSalary]
												.filter(Boolean)
												.map((value) => formatCompactNumber(value!))
												.join(' - ')}
										</Text>
									</Group>
								</Card>
							)
						})}
					</Stack>
				</GridCol>

				<GridCol
					span={{ base: 12, md: 8 }}
					className="-order-1 md:order-2"
				>
					<Card
						withBorder
						padding="xl"
						radius="lg"
						bg="white"
					>
						<Stack gap="xs">
							<Group justify="flex-end">
								<Badge
									size="lg"
									color="green"
									variant="light"
								>
									{[data.fromExpectedSalary, data.toExpectedSalary]
										.filter(Boolean)
										.map((value) => formatCompactNumber(value!))
										.join(' - ')}
								</Badge>
								{data.closeVacancy ? (
									<Badge
										size="lg"
										color="red"
										variant="light"
									>
										Lowongan Tutup
									</Badge>
								) : isExpired ? (
									<Badge
										size="lg"
										color="orange"
										variant="light"
									>
										Lowongan Berakhir
									</Badge>
								) : null}
							</Group>

							<Title order={2} size="h3">
								{data.title}
							</Title>

							<Group gap="md">
								<Group gap={6}>
									<Building
										size={14}
										color="gray"
									/>
									<Text
										size="sm"
										component="span"
										c="dimmed"
									>
										{company.title}
									</Text>
								</Group>
								{type ? (
									<Group gap={6}>
										<FolderClock
											size={14}
											color="gray"
										/>
										<Text
											size="sm"
											component="span"
											c="dimmed"
										>
											{type.label}
										</Text>
									</Group>
								) : null}
								{level ? (
									<Group gap={6}>
										<PersonStanding
											size={14}
											color="gray"
										/>
										<Text
											size="sm"
											component="span"
											c="dimmed"
										>
											{level.label}
										</Text>
									</Group>
								) : null}
								{education ? (
									<Group gap={6}>
										<GraduationCap
											size={14}
											color="gray"
										/>
										<Text
											size="sm"
											component="span"
											c="dimmed"
										>
											{education.label}
										</Text>
									</Group>
								) : null}
							</Group>
						</Stack>

						<Divider my="xl" />

						<Richtext data={data.description} />

						{!authUser || authUser.role === 'candidate' ? (
							<>
								<Divider
									mt="lg"
									mb="xl"
								/>

								<Paper
									p="xl"
									radius="lg"
									bg="gray.0"
									withBorder
								>
									{userVacancySubmission ? (
										<>
											<Title
												order={3}
												mb="sm"
												size="h4"
												c="green.5"
											>
												Lamaran Terkirim
											</Title>
											<Text
												c="dimmed"
												mb="lg"
											>
												Anda telah melamar pada lowongan ini, lihat riwayat
												lamaran Anda di{' '}
												<Anchor
													component={Link}
													c="green.5"
													href={`/${slugDashboard}/collections/vacancySubmissions/${userVacancySubmission.id}`}
													target="_blank"
												>
													Lamaran Saya
												</Anchor>
												.
											</Text>
										</>
									) : isExpired ? (
										<Alert
											color="orange"
											variant="light"
										>
											Lowongan Berakhir
										</Alert>
									) : data.closeVacancy ? (
										<Alert
											color="red"
											variant="light"
										>
											Lowongan Tutup
										</Alert>
									) : (
										<>
											{/* Translate Title */}
											<Title
												order={3}
												mb="sm"
												size="h4"
											>
												Lamar Sekarang
											</Title>
											<Text
												size="sm"
												c="dimmed"
												mb="lg"
											>
												Isi data singkat Anda untuk melanjutkan ke tahap
												asesmen.
											</Text>

											<FormApplyVacancy
												vacancy={data}
												authUser={authUser}
											/>
										</>
									)}
								</Paper>
							</>
						) : null}
					</Card>
				</GridCol>
			</Grid>
		</Container>
	)
}