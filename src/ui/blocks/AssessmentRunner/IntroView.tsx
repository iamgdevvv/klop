'use client'
import {
	Alert,
	Anchor,
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Divider,
	Grid,
	Group,
	List,
	PasswordInput,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	type ContainerProps,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { Check, Clock, ListFilter, Trophy } from 'lucide-react'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useCallback, useMemo, useState, useTransition } from 'react'

import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { slugDashboard } from '$modules/vars'
import { vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import type { Assessment, AssessmentSubmission, User } from '$payload-types'
import { actionRegisterAuth } from '$root/lib/server-functions/auth'
import {
	PayloadCandidateAssessmentSchema,
	type PayloadCandidateAssessment,
} from '$schema/assesment'
import { printSalary } from '$utils/common'

type Props = {
	data: Assessment
	authUser: User | null
	userAssessmentSubmission: AssessmentSubmission | null
	onSubmit: (candidate: User) => void
} & Omit<ContainerProps, 'onSubmit'>

export function IntroView({ data, authUser, userAssessmentSubmission, onSubmit, ...props }: Props) {
	const [isLoadingCreateCandidate, startActionCreateCandidate] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const form = useForm<PayloadCandidateAssessment>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadCandidateAssessmentSchema),
		validateInputOnBlur: true,
		onValuesChange: () => {
			setErrorMessage(null)
		},
	})

	const vacancy = useMemo(() => {
		if (typeof data.vacancy === 'object') {
			return data.vacancy
		}

		return null
	}, [data.vacancy])

	const closeVacancy = useMemo(() => {
		if (typeof vacancy?.closeVacancy === 'boolean') {
			return vacancy.closeVacancy
		}

		return false
	}, [vacancy])

	const company = useMemo(() => {
		if (typeof vacancy?.company === 'object') {
			return vacancy.company
		}

		return null
	}, [vacancy])

	const vacancyMetadata = useMemo(() => {
		const salary = [vacancy?.fromExpectedSalary, vacancy?.toExpectedSalary]
			.filter(Boolean)
			.map((salary) => printSalary(salary!))
			.join(' - ')

		return [
			vacancy?.title,
			vacancyType.find((type) => type.value === vacancy?.type)?.label,
			vacancyLevel.find((level) => level.value === vacancy?.level)?.label,
			vacancyEducation.find((education) => education.value === vacancy?.education)?.label,
			salary,
		]
			.filter(Boolean)
			.join(' • ')
	}, [vacancy])

	const handlerSubmit = useCallback(
		(payload: TransformedValues<typeof form>) => {
			setErrorMessage(null)

			startActionCreateCandidate(async () => {
				const registerCandidate = await actionRegisterAuth('candidate', payload)

				if (registerCandidate.success) {
					onSubmit(registerCandidate.data)
				} else {
					setErrorMessage(registerCandidate.error)
				}
			})
		},
		[onSubmit],
	)

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			<Stack gap="xl">
				<Card
					radius="xl"
					p={{ base: 'md', md: 50 }}
					bg="white"
					withBorder
					shadow="sm"
				>
					<Stack gap="xs">
						{company ? (
							<Text
								size="sm"
								c="dimmed"
								fw={700}
								mb={5}
								tt="uppercase"
							>
								{company.title}
							</Text>
						) : null}
						<Title
							order={1}
							size={42}
							fw={900}
							c="dark.9"
						>
							{vacancy?.title || 'Assessment'}
						</Title>
						{vacancyMetadata ? (
							<Text
								c="dimmed"
								mt={5}
							>
								{vacancyMetadata}
							</Text>
						) : null}
					</Stack>

					<Divider my="xl" />

					<SimpleGrid
						cols={{ base: 2, md: 4 }}
						spacing="xl"
					>
						<Box>
							<Text
								size="xs"
								c="dimmed"
								fw={700}
								tt="uppercase"
								mb={5}
							>
								Duration
							</Text>
							<Group
								gap={10}
								align="center"
							>
								<ThemeIcon
									variant="light"
									color="blue"
									size="md"
									radius="xl"
								>
									<Clock size={18} />
								</ThemeIcon>
								<Text
									fw={700}
									size="xl"
									c="dark.8"
								>
									{data.duration || 20} min
								</Text>
							</Group>
						</Box>
						<Box>
							<Text
								size="xs"
								c="dimmed"
								fw={700}
								tt="uppercase"
								mb={5}
							>
								Questions
							</Text>
							<Group
								gap={10}
								align="center"
							>
								<ThemeIcon
									variant="light"
									color="blue"
									size="md"
									radius="xl"
								>
									<ListFilter size={18} />
								</ThemeIcon>
								<Text
									fw={700}
									size="xl"
									c="dark.8"
								>
									{data.questions?.length || 0} Butir
								</Text>
							</Group>
						</Box>
						<Box>
							<Text
								size="xs"
								c="dimmed"
								fw={700}
								tt="uppercase"
								mb={5}
							>
								Passing Grade
							</Text>
							<Group
								gap={10}
								align="center"
							>
								<ThemeIcon
									variant="light"
									color="green"
									size="md"
									radius="xl"
								>
									<Trophy size={18} />
								</ThemeIcon>
								<Text
									fw={700}
									size="xl"
									c="green.7"
								>
									{data.passingGrade || 70}%
								</Text>
							</Group>
						</Box>
					</SimpleGrid>
				</Card>

				<Grid gutter="xl">
					<Grid.Col span={{ base: 12, md: 8 }}>
						<Card
							withBorder
							shadow="sm"
							radius="xl"
							p="xl"
							h="100%"
						>
							{data.description ? (
								<>
									<Title
										order={5}
										mb="sm"
									>
										Deskripsi Assessment
									</Title>
									<Richtext
										data={data.description}
										mb="xl"
									/>
								</>
							) : null}
							<Title
								order={5}
								mb="sm"
							>
								Perhatian & Persyaratan Assessment
							</Title>
							<List
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
									<strong>Koneksi Stabil</strong> - Peserta wajib menggunakan
									jaringan internet yang stabil selama ujian.
								</List.Item>
								<List.Item>
									<strong>Mode Layar Penuh</strong> - Peserta harus tetap berada
									dalam mode layar penuh selama assessment berlangsung.
								</List.Item>
								<List.Item>
									<strong>Tidak Berpindah Tab/Aplikasi</strong> - Perpindahan tab
									atau aplikasi tidak diperbolehkan dan akan tercatat sebagai
									pelanggaran.
								</List.Item>
							</List>
						</Card>
					</Grid.Col>

					<Grid.Col span={{ base: 12, md: 4 }}>
						<Card
							shadow="sm"
							radius="xl"
							p="xl"
							withBorder
							className="h-full flex flex-col justify-center"
						>
							{userAssessmentSubmission && authUser ? (
								<>
									<Title
										order={4}
										mb="xs"
									>
										Halo, {authUser.name}! Asessmen sudah selesai.
									</Title>
									<Text
										c="dimmed"
										mb="lg"
									>
										Anda telah menyelesaikan assesmen ini, lihat riwayat
										assessment Anda di{' '}
										<Anchor
											component={Link}
											c="green.5"
											href={`/${slugDashboard}/collections/assessmentSubmissions/${userAssessmentSubmission.id}`}
											target="_blank"
										>
											Assessment Saya
										</Anchor>
										.
									</Text>
								</>
							) : authUser?.role === 'candidate' ? (
								<>
									<Title
										order={4}
										mb="xs"
									>
										Halo,{' '}
										<Text
											span
											c="blue"
											fz="inherit"
											fw="inherit"
										>
											{authUser.name}
										</Text>
										! Siap Memulai?
									</Title>
									<Checkbox
										label="Saya menyetujui ketentuan dan syarat yang berlaku."
										checked
									/>
									<Button
										fullWidth
										size="lg"
										radius="md"
										mt="md"
										color="blue"
										loading={isLoadingCreateCandidate}
										disabled={closeVacancy}
										onClick={() => {
											onSubmit(authUser)
										}}
									>
										Mulai Asesmen
									</Button>
								</>
							) : (
								<>
									<Title
										order={4}
										mb="xs"
									>
										Siap Memulai?
									</Title>
									<Text
										c="dimmed"
										size="sm"
										mb="md"
									>
										Lengkapi data diri Anda untuk daftar menjadi kandidat
										lansung melaksanakan asassesmen.
									</Text>

									{errorMessage ? (
										<Alert
											variant="light"
											color="red"
											mb="lg"
										>
											{errorMessage}
										</Alert>
									) : null}

									<form onSubmit={form.onSubmit(handlerSubmit)}>
										<Stack gap="xs">
											<TextInput
												label="Nama Lengkap"
												readOnly={isLoadingCreateCandidate}
												key={form.key('name')}
												{...form.getInputProps('name')}
											/>
											<TextInput
												type="email"
												label="Email"
												readOnly={isLoadingCreateCandidate}
												key={form.key('email')}
												{...form.getInputProps('email')}
											/>
											<TextInput
												type="tel"
												label="No. Telp / Whatsapp"
												placeholder="0812..."
												readOnly={isLoadingCreateCandidate}
												key={form.key('phone')}
												{...form.getInputProps('phone')}
											/>
											<PasswordInput
												label="Password"
												key={form.key('password')}
												readOnly={isLoadingCreateCandidate}
												{...form.getInputProps('password')}
											/>
											<PasswordInput
												label="Confirm Password"
												key={form.key('confirmPassword')}
												readOnly={isLoadingCreateCandidate}
												{...form.getInputProps('confirmPassword')}
											/>
											<Checkbox
												key={form.key('agreeToc')}
												label="Saya menyetujui ketentuan dan syarat yang berlaku."
												{...form.getInputProps('agreeToc', {
													type: 'checkbox',
												})}
											/>
										</Stack>

										<Button
											type="submit"
											fullWidth
											size="lg"
											radius="md"
											mt="md"
											color="blue"
											loading={isLoadingCreateCandidate}
											disabled={closeVacancy}
										>
											Mulai Asesmen
										</Button>
									</form>
								</>
							)}
						</Card>
					</Grid.Col>
				</Grid>
			</Stack>
		</Container>
	)
}
