'use client'
import {
	Alert,
	Button,
	Divider,
	FileInput,
	Group,
	PasswordInput,
	Radio,
	RadioGroup,
	Select,
	SimpleGrid,
	Stack,
	Textarea,
	TextInput,
	type StackProps,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useCallback, useMemo, useState, useTransition } from 'react'

import { useRouter } from '$hooks/use-router'
import { candidateGender, vacancyEducation } from '$payload-libs/enum'
import type { User, Vacancy } from '$payload-types'
import {
	PayloadApplyVacancyRegisterSchema,
	PayloadApplyVacancySchema,
	type PayloadApplyVacancy,
	type PayloadApplyVacancyRegister,
} from '$schema/vacancy'
import {
	actionVacancySubmission,
	actionVacancySubmissionRegister,
} from '$server-functions/vacancySubmission'

type Props = {
	vacancy: Vacancy
	authUser: User | null
} & StackProps

export default function FormApplyVacancy({ authUser, ...props }: Props) {
	if (authUser?.role === 'candidate') {
		return (
			<FormApplyVacancyAuthUser
				{...props}
				authUser={authUser}
			/>
		)
	}

	return <FormApplyVacancyRegister {...props} />
}

function FormApplyVacancyAuthUser({
	vacancy,
	authUser,
	...props
}: Omit<Props, 'authUser'> & { authUser: User }) {
	const router = useRouter()
	const [isLoadingApplyVacancyAuthUser, startActionRegister] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const documents = useMemo((): string[] => {
		const documentNames: string[] = []

		authUser.documents?.forEach((document) => {
			if (typeof document === 'object' && document.filename) {
				documentNames.push(document.filename)
			}
		})

		return documentNames
	}, [authUser])

	const form = useForm<PayloadApplyVacancy>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadApplyVacancySchema),
		validateInputOnBlur: true,
		onValuesChange: () => {
			setErrorMessage(null)
		},
		initialValues: {
			biography: authUser.biography || '',
		},
	})

	const handlerSubmit = useCallback(
		(payload: TransformedValues<typeof form>) => {
			startActionRegister(async () => {
				startActionRegister(async () => {
					const action = await actionVacancySubmission({
						vacancy,
						candidate: authUser,
						formData: payload,
					})

					if (action.success === false) {
						setErrorMessage(action.error)
						return
					}

					router.refresh()
				})
			})
		},
		[authUser, router, vacancy],
	)

	return (
		<form
			onSubmit={form.onSubmit(handlerSubmit)}
			onReset={form.onReset}
		>
			{errorMessage ? (
				<Alert
					variant="light"
					color="red"
					mb="sm"
				>
					{errorMessage}
				</Alert>
			) : null}

			<Stack
				{...props}
				gap={props.gap || 'xl'}
			>
				<Stack gap="sm">
					<Textarea
						label="Perkenalan Diri"
						key={form.key('biography')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('biography')}
					/>
					<FileInput
						label="Resume (Optional)"
						key={form.key('resume')}
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						placeholder={
							typeof authUser.resume === 'object'
								? authUser.resume?.filename
								: undefined
						}
						{...form.getInputProps('resume')}
					/>
					<FileInput
						label="Dokumen Pendukung (Optional)"
						key={form.key('documents')}
						multiple
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						placeholder={documents.join(', ')}
						{...form.getInputProps('documents')}
					/>
				</Stack>

				<Group justify="flex-end">
					<Button
						type="submit"
						size="xl"
						loading={isLoadingApplyVacancyAuthUser}
					>
						Submit Lamaran
					</Button>
				</Group>
			</Stack>
		</form>
	)
}

function FormApplyVacancyRegister({ vacancy, ...props }: Omit<Props, 'authUser'>) {
	const router = useRouter()
	const [isLoadingApplyVacancyAuthUser, startActionRegister] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const form = useForm<PayloadApplyVacancyRegister>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadApplyVacancyRegisterSchema),
		validateInputOnBlur: true,
		onValuesChange: () => {
			setErrorMessage(null)
		},
	})

	const handlerSubmit = useCallback(
		(payload: TransformedValues<typeof form>) => {
			startActionRegister(async () => {
				const action = await actionVacancySubmissionRegister({
					vacancy,
					formData: payload,
				})

				if (action.success === false) {
					setErrorMessage(action.error)
					return
				}

				router.refresh()
			})
		},
		[router, vacancy],
	)

	return (
		<form
			onSubmit={form.onSubmit(handlerSubmit)}
			onReset={form.onReset}
		>
			{errorMessage ? (
				<Alert
					variant="light"
					color="red"
					mb="sm"
				>
					{errorMessage}
				</Alert>
			) : null}

			<Stack
				{...props}
				gap={props.gap || 'xl'}
			>
				<Stack gap="sm">
					<TextInput
						label="Nama"
						key={form.key('name')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('name')}
					/>
					<RadioGroup
						label="Jenis Kelamin"
						readOnly={isLoadingApplyVacancyAuthUser}
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
					<Select
						label="Pendidikan Terakhir"
						data={vacancyEducation}
						key={form.key('education')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('education')}
					/>
					<SimpleGrid
						cols={{ base: 1, sm: 2 }}
						spacing="md"
					>
						<TextInput
							type="email"
							label="Email"
							key={form.key('email')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('email')}
						/>
						<TextInput
							type="tel"
							label="No. Telp / Whatsapp"
							placeholder="0812..."
							key={form.key('phone')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('phone')}
						/>
						<PasswordInput
							label="Password"
							key={form.key('password')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('password')}
						/>
						<PasswordInput
							label="Confirm Password"
							key={form.key('confirmPassword')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('confirmPassword')}
						/>
					</SimpleGrid>
					<Divider
						mt="lg"
						mb="md"
					/>
					<Textarea
						label="Perkenalan Diri"
						key={form.key('biography')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('biography')}
					/>
					<FileInput
						label="Resume"
						key={form.key('resume')}
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						{...form.getInputProps('resume')}
					/>
					<FileInput
						label="Dokumen Pendukung (Optional)"
						key={form.key('documents')}
						multiple
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						{...form.getInputProps('documents')}
					/>
				</Stack>

				<Group justify="flex-end">
					<Button
						type="submit"
						size="xl"
						loading={isLoadingApplyVacancyAuthUser}
					>
						Submit Lamaran
					</Button>
				</Group>
			</Stack>
		</form>
	)
}
