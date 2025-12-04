'use client'

import {
	Alert,
	Button,
	Paper,
	PasswordInput,
	SimpleGrid,
	Stack,
	TextInput,
	type PaperProps,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

import { slugCompanies, slugDashboard } from '$modules/vars'
import type { User } from '$payload-types'
import { PayloadRegisterSchema, type PayloadRegister } from '$schema/register'
import { actionRegisterAuth } from '$server-functions/auth'

type Props = {
	role?: User['role']
	redirect?: string
} & PaperProps

export function RegisterForm({ role, redirect, ...props }: Props) {
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
				const action = await actionRegisterAuth(role || 'company', payload)

				if (action.success === false) {
					setErrorMessage(action.error)
					return
				}

				const redirectSearchParam = searchParams.get('redirect')

				if (redirectSearchParam) {
					router.replace(redirectSearchParam)
				} else if (redirect) {
					router.replace(redirect)
				} else if (action.data.role === 'company') {
					router.replace(`/${slugDashboard}/collections/companies/create`)
				} else {
					router.replace(`/${slugCompanies}`)
				}
			})
		},
		[redirect, role, router, searchParams],
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

			<Stack gap="lg">
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
