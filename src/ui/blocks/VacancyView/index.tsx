import {
	Badge,
	Button,
	Card,
	Container,
	Divider,
	Grid,
	GridCol,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
	type ContainerProps,
} from '@mantine/core'
import dayjs from 'dayjs'
import {
	ArrowRight,
	Ban,
	Building,
	CheckCircle2,
	Clock,
	FolderClock,
	GraduationCap,
	PersonStanding,
} from 'lucide-react'

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
	const isExpired = dayjs(data.expiresAt).isBefore(dayjs())

	const sortedVacancies = vacancies.sort((a, b) => {
		const aIsOpen = !a.closeVacancy && dayjs(a.expiresAt).isBefore(dayjs())
		const bIsOpen = !b.closeVacancy && dayjs(b.expiresAt).isBefore(dayjs())

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
						<Title
							order={4}
							size="h5"
						>
							Posisi Tersedia
						</Title>
						<Text
							size="xs"
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
								vacancy.closeVacancy || dayjs(vacancy.expiresAt).isBefore(dayjs())

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

							<Title
								order={2}
								size="h5"
							>
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
									p="md"
									radius="md"
									style={{
										borderColor: 'var(--mantine-color-gray-3)',
										backgroundColor: 'var(--mantine-color-gray-0)',
										backgroundImage:
											'radial-gradient(var(--mantine-color-teal-2) 1.5px, transparent 1.5px)',
										backgroundSize: '20px 20px',
									}}
									withBorder
								>
									{userVacancySubmission ? (
										<Paper
											p="md"
											radius="md"
											bg="teal.0"
											withBorder
											style={{ borderColor: 'var(--mantine-color-teal-2)' }}
										>
											<Group
												justify="space-between"
												align="center"
												wrap="nowrap"
											>
												<Group
													gap="md"
													wrap="nowrap"
												>
													<ThemeIcon
														radius="xl"
														size="lg"
														color="teal"
														variant="white"
													>
														<CheckCircle2 size={20} />
													</ThemeIcon>
													<div>
														<Text
															fw={600}
															c="teal.9"
															size="sm"
														>
															Lamaran Berhasil Dikirim
														</Text>
														<Text
															size="xs"
															c="teal.7"
														>
															Kami telah menerima data Anda. Pantau
															status seleksi secara berkala.
														</Text>
													</div>
												</Group>

												<Button
													component={Link}
													href={`/${slugDashboard}/collections/vacancySubmissions/${userVacancySubmission.id}`}
													variant="white"
													color="teal"
													size="xs"
													radius="md"
													rightSection={<ArrowRight size={14} />}
												>
													Cek Status
												</Button>
											</Group>
										</Paper>
									) : isExpired ? (
										<Paper
											p="md"
											radius="md"
											bg="orange.0"
											withBorder
											style={{ borderColor: 'var(--mantine-color-orange-2)' }}
										>
											<Group
												gap="md"
												wrap="nowrap"
											>
												<ThemeIcon
													radius="xl"
													size="lg"
													color="orange"
													variant="white"
												>
													<Clock size={20} />
												</ThemeIcon>
												<div>
													<Text
														fw={600}
														c="orange.9"
														size="sm"
													>
														Masa Berlaku Habis
													</Text>
													<Text
														size="xs"
														c="orange.8"
													>
														Lowongan ini telah melewati batas waktu
														pendaftaran.
													</Text>
												</div>
											</Group>
										</Paper>
									) : data.closeVacancy ? (
										<Paper
											p="md"
											radius="md"
											bg="red.0"
											withBorder
											style={{ borderColor: 'var(--mantine-color-red-2)' }}
										>
											<Group
												gap="md"
												wrap="nowrap"
											>
												<ThemeIcon
													radius="xl"
													size="lg"
													color="red"
													variant="white"
												>
													<Ban size={20} />
												</ThemeIcon>
												<div>
													<Text
														fw={600}
														c="red.9"
														size="sm"
													>
														Pendaftaran Ditutup
													</Text>
													<Text
														size="xs"
														c="red.7"
													>
														Mohon maaf, kuota pelamar untuk posisi ini
														sudah penuh atau periode pendaftaran telah
														berakhir.
													</Text>
												</div>
											</Group>
										</Paper>
									) : (
										<Paper
											p={{ base: 'md', md: 'xl' }}
											radius="md"
											bg="white"
											withBorder
											style={{
												boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
											}}
										>
											<Stack
												gap="xs"
												mb="lg"
											>
												<Title
													order={3}
													size="h4"
													c="dark.8"
												>
													Lamar Sekarang
												</Title>
												<Text
													size="sm"
													c="dimmed"
												>
													Lengkapi formulir singkat di bawah ini untuk
													mengikuti asesmen AI.
												</Text>
											</Stack>

											<FormApplyVacancy
												vacancy={data}
												authUser={authUser}
											/>
										</Paper>
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
