'use client'

import {
	Alert,
	Button,
	Paper,
	PasswordInput,
	Radio,
	RadioGroup,
	Select,
	SimpleGrid,
	Stack,
	Textarea,
	TextInput,
	type PaperProps,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

import { useRouter } from '$hooks/use-router'
import { slugDashboard } from '$modules/vars'
import { candidateGender, vacancyEducation } from '$payload-libs/enum'
import {
	PayloadRegisterCandidateSchema,
	PayloadRegisterSchema,
	type PayloadRegister,
	type PayloadRegisterCandidate,
} from '$schema/register'
import { actionRegisterAuth } from '$server-functions/auth'

type Props = {
	redirect?: string
} & PaperProps

export function RegisterForm({ redirect, ...props }: Props) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isLoadingRegister, startActionRegister] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const form = useForm<PayloadRegister>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadRegisterSchema),
		validateInputOnBlur: true,
		onValuesChange: () => {
			setErrorMessage(null)
		},
	})

	const handlerSubmit = useCallback(
		(payload: TransformedValues<typeof form>) => {
			startActionRegister(async () => {
				const action = await actionRegisterAuth('company', payload)

				if (action.success === false) {
					setErrorMessage(action.error)
					return
				}

				const redirectSearchParam = searchParams.get('redirect')

				if (redirectSearchParam) {
					router.replace(redirectSearchParam)
				} else if (redirect) {
					router.replace(redirect)
				} else {
					router.replace(`/${slugDashboard}/collections/companies/create`)
				}
			})
		},
		[redirect, router, searchParams],
	)

	return (
		<Paper
			{...props}
			component="form"
			withBorder
			shadow="md"
			p={30}
			mt={30}
			radius="lg"
			onSubmit={form.onSubmit(handlerSubmit)}
			onReset={form.onReset}
		>
			{errorMessage ? (
				<Alert
					variant="light"
					color="red"
					mb="lg"
				>
					{errorMessage}
				</Alert>
			) : null}

			<Stack gap="md">
				<TextInput
					label="Nama"
					key={form.key('name')}
					readOnly={isLoadingRegister}
					{...form.getInputProps('name')}
				/>
				<TextInput
					type="email"
					label="Email"
					key={form.key('email')}
					readOnly={isLoadingRegister}
					{...form.getInputProps('email')}
				/>
				<SimpleGrid
					cols={{ base: 1, sm: 2 }}
					spacing="md"
				>
					<PasswordInput
						label="Password"
						key={form.key('password')}
						readOnly={isLoadingRegister}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label="Confirm Password"
						key={form.key('confirmPassword')}
						readOnly={isLoadingRegister}
						{...form.getInputProps('confirmPassword')}
					/>
				</SimpleGrid>
			</Stack>

			<Button
				fullWidth
				mt="xl"
				size="md"
				type="submit"
				loading={isLoadingRegister}
			>
				Create Account
			</Button>
		</Paper>
	)
}

export function RegisterCandidateForm({ redirect, ...props }: Props) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isLoadingRegister, startActionRegister] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const form = useForm<PayloadRegisterCandidate>({
		mode: 'uncontrolled',
		validate: zod4Resolver(PayloadRegisterCandidateSchema),
		validateInputOnBlur: true,
		onValuesChange: () => {
			setErrorMessage(null)
		},
	})

	const handlerSubmit = useCallback(
		(payload: TransformedValues<typeof form>) => {
			setErrorMessage(null)

			startActionRegister(async () => {
				const action = await actionRegisterAuth('candidate', payload)

				if (action.success === false) {
					setErrorMessage(action.error)
					return
				}

				const redirectSearchParam = searchParams.get('redirect')

				if (redirectSearchParam) {
					router.replace(redirectSearchParam)
				} else if (redirect) {
					router.replace(redirect)
				} else {
					router.replace(`/${slugDashboard}/account`)
				}
			})
		},
		[redirect, router, searchParams],
	)

	return (
		<Paper
			{...props}
			component="form"
			withBorder
			shadow="md"
			p={30}
			mt={30}
			radius="lg"
			onSubmit={form.onSubmit(handlerSubmit)}
			onReset={form.onReset}
		>
			{errorMessage ? (
				<Alert
					variant="light"
					color="red"
					mb="lg"
				>
					{errorMessage}
				</Alert>
			) : null}

			<Stack gap="md">
				<TextInput
					label="Nama"
					key={form.key('name')}
					readOnly={isLoadingRegister}
					{...form.getInputProps('name')}
				/>
				<RadioGroup
					label="Jenis Kelamin"
					readOnly={isLoadingRegister}
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
					readOnly={isLoadingRegister}
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
						readOnly={isLoadingRegister}
						{...form.getInputProps('email')}
					/>
					<TextInput
						type="tel"
						label="No. Telp / Whatsapp"
						placeholder="0812..."
						key={form.key('phone')}
						readOnly={isLoadingRegister}
						{...form.getInputProps('phone')}
					/>
					<PasswordInput
						label="Password"
						key={form.key('password')}
						readOnly={isLoadingRegister}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label="Confirm Password"
						key={form.key('confirmPassword')}
						readOnly={isLoadingRegister}
						{...form.getInputProps('confirmPassword')}
					/>
				</SimpleGrid>
				<Textarea
					label="Perkenalan Diri"
					key={form.key('biography')}
					readOnly={isLoadingRegister}
					{...form.getInputProps('biography')}
				/>
			</Stack>

			<Button
				fullWidth
				mt="xl"
				size="md"
				type="submit"
				loading={isLoadingRegister}
			>
				Create Account
			</Button>
		</Paper>
	)
}
