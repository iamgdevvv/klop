'use client'
import {
	Box,
	Button,
	Card,
	Container,
	Divider,
	Grid,
	Group,
	List,
	Radio,
	RadioGroup,
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
import { useCallback, useMemo, useTransition } from 'react'

import Richtext from '$components/Richtext'
import { candidateGender, vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import type { Assessment } from '$payload-types'
import { queryAssessmentSubmissions } from '$root/lib/server-functions/assessmentSubmission'
import {
	PayloadCandidateAssessmentSchema,
	type PayloadCandidateAssessment,
} from '$schema/assesment'
import { printSalary } from '$utils/common'

type Props = {
	data: Assessment
	onSubmit: (payload: PayloadCandidateAssessment) => void
} & Omit<ContainerProps, 'onSubmit'>

export function IntroView({ data, onSubmit, ...props }: Props) {
	const [isLoadingCandidateExist, startActionCandidateExist] = useTransition()

	const form = useForm<PayloadCandidateAssessment>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadCandidateAssessmentSchema),
		validateInputOnBlur: true,
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
			startActionCandidateExist(async () => {
				const assessmentSubmissionsCandidateExist = await queryAssessmentSubmissions({
					limit: 1,
					whereAnd: [
						{
							assessment: {
								equals: data.id,
							},
						},
					],
					whereOr: [
						{
							['candidate.email']: {
								equals: payload.email,
							},
						},
						{
							['candidate.phone']: {
								equals: payload.phone,
							},
						},
					],
				})

				if (assessmentSubmissionsCandidateExist?.docs.length) {
					const candidate = assessmentSubmissionsCandidateExist.docs[0].candidate

					if (candidate?.phone === payload.phone) {
						form.setFieldError(
							'phone',
							'Candidate already exist with this phone number',
						)
					}

					if (candidate?.email === payload.email) {
						form.setFieldError('email', 'Candidate already exist with this email')
					}
				} else {
					onSubmit(payload)
				}
			})
		},
		[data.id, form, onSubmit],
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
							style={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
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
								Lengkapi data diri Anda untuk masuk ke ujian.
							</Text>

							<form onSubmit={form.onSubmit(handlerSubmit)}>
								<Stack gap="xs">
									<TextInput
										label="Nama Lengkap"
										readOnly={isLoadingCandidateExist}
										key={form.key('name')}
										{...form.getInputProps('name')}
									/>
									<TextInput
										type="email"
										label="Email"
										readOnly={isLoadingCandidateExist}
										key={form.key('email')}
										{...form.getInputProps('email')}
									/>
									<TextInput
										type="tel"
										label="Nomor WhatsApp"
										placeholder="0812..."
										readOnly={isLoadingCandidateExist}
										key={form.key('phone')}
										{...form.getInputProps('phone')}
									/>
									<RadioGroup
										label="Jenis Kelamin"
										readOnly={isLoadingCandidateExist}
										{...form.getInputProps('gender')}
									>
										<Stack
											gap="xs"
											mt={4}
										>
											{candidateGender.map((item, index) => (
												<Radio
													key={`${item.value}-${index}`}
													value={item.value}
													label={item.label}
												/>
											))}
										</Stack>
									</RadioGroup>
								</Stack>

								<Button
									type="submit"
									fullWidth
									size="lg"
									radius="md"
									mt="md"
									color="blue"
									loading={isLoadingCandidateExist}
									disabled={closeVacancy}
								>
									Mulai Asesmen
								</Button>
							</form>
						</Card>
					</Grid.Col>
				</Grid>
			</Stack>
		</Container>
	)
}
