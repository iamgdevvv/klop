'use client'

import {
	Anchor,
	Button,
	Paper,
	PasswordInput,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

import { slugDashboard, slugDashboardLogin } from '$root/lib/modules/vars'
import { PayloadRegisterSchema, type PayloadRegister } from '$schema/register'
import { actionRegisterAuth } from '$server-functions/auth'

export function RegisterForm() {
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

				router.replace(`/${slugDashboard}/collections/companies/create`)
			})
		},
		[router],
	)

	return (
		<Paper
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
				<Text
					c="primary"
					size="xs"
					mb="lg"
				>
					{errorMessage}
				</Text>
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

			<Text
				ta="center"
				mt="md"
			>
				Already have an account?{' '}
				<Anchor
					href={`/${slugDashboardLogin}`}
					fw={700}
				>
					Login
				</Anchor>
			</Text>
		</Paper>
	)
}
