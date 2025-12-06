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
			setErrorMessage(null)
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
		},
		[authUser, router, vacancy],
	)

	return (
		<form
			onSubmit={form.onSubmit(handlerSubmit)}
			onReset={form.onReset}
		>
			{errorMessage ? (
				<Alert variant="light" color="red" mb="sm">
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
						placeholder="Jelaskan secara singkat mengapa Anda cocok untuk posisi ini..."
						key={form.key('biography')}
						readOnly={isLoadingApplyVacancyAuthUser}
						autosize
						minRows={3}
						{...form.getInputProps('biography')}
					/>
					<FileInput
						label="Resume / CV (Opsional)"
						placeholder={
							typeof authUser.resume === 'object'
								? authUser.resume?.filename
								: "Upload file PDF..."
						}
						key={form.key('resume')}
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						{...form.getInputProps('resume')}
					/>
					<FileInput
						label="Dokumen Pendukung (Opsional)"
						placeholder={documents.length > 0 ? documents.join(', ') : "Sertifikat, Portofolio, dll..."}
						key={form.key('documents')}
						multiple
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf"
						{...form.getInputProps('documents')}
					/>
				</Stack>

				<Group justify="flex-end">
					<Button
						type="submit"
						size="xl"
						loading={isLoadingApplyVacancyAuthUser}
					>
						Kirim Lamaran
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
				<Alert variant="light" color="red" mb="sm">
					{errorMessage}
				</Alert>
			) : null}

			<Stack
				{...props}
				gap={props.gap || 'xl'}
			>
				<Stack gap="sm">
					<TextInput
						label="Nama Lengkap"
						placeholder="Contoh: Budi Santoso"
						key={form.key('name')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('name')}
					/>
					<RadioGroup
						label="Jenis Kelamin"
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('gender')}
					>
						<Stack gap="xs" mt={4}>
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
						placeholder="Pilih tingkat pendidikan"
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
							label="Alamat Email"
							placeholder="contoh@email.com"
							key={form.key('email')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('email')}
						/>
						<TextInput
							type="tel"
							label="No. Telp / WhatsApp"
							placeholder="0812..."
							key={form.key('phone')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('phone')}
						/>
						<PasswordInput
							label="Kata Sandi"
							placeholder="Minimal 8 karakter"
							key={form.key('password')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('password')}
						/>
						<PasswordInput
							label="Konfirmasi Kata Sandi"
							placeholder="Ulangi kata sandi"
							key={form.key('confirmPassword')}
							readOnly={isLoadingApplyVacancyAuthUser}
							{...form.getInputProps('confirmPassword')}
						/>
					</SimpleGrid>
					<Divider mt="lg" mb="md" />
					<Textarea
						label="Perkenalan Diri"
						placeholder="Ceritakan pengalaman dan keahlian Anda secara singkat..."
						key={form.key('biography')}
						readOnly={isLoadingApplyVacancyAuthUser}
						{...form.getInputProps('biography')}
					/>
					<FileInput
						label="Resume / CV"
						placeholder="Upload file PDF..."
						key={form.key('resume')}
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="application/pdf"
						{...form.getInputProps('resume')}
					/>
					<FileInput
						label="Dokumen Pendukung (Opsional)"
						placeholder="Sertifikat, Portofolio..."
						key={form.key('documents')}
						multiple
						readOnly={isLoadingApplyVacancyAuthUser}
						accept="image/*,application/pdf"
						{...form.getInputProps('documents')}
					/>
				</Stack>

				<Group justify="flex-end">
					<Button
						type="submit"
						size="md"
						loading={isLoadingApplyVacancyAuthUser}
					>
						Submit Lamaran
					</Button>
				</Group>
			</Stack>
		</form>
	)
}