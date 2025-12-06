'use client'
import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Container,
	Group,
	Loader,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	TextInput,
	Title,
	type ContainerProps,
} from '@mantine/core'
import { ArrowRight, Building2, MapPin, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { slugCompanies } from '$modules/vars'
import type { Company } from '$payload-types'

type Props = {
	companies: Company[]
} & ContainerProps

export function BrowseCompanies({ companies, ...props }: Props) {
	const [isQuerying, setQuerying] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setQuerying(false)
	}, [companies])

	const handlerQueryCompanies = useCallback(
		(search: string | undefined) => {
			if (searchParams.get('search') === search) return

			setQuerying(true)
			if (search) {
				router.push(`/${slugCompanies}?search=${search}`)
			} else {
				router.push(`/${slugCompanies}`)
			}
		},
		[router, searchParams],
	)

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			<Stack
				align="center"
				mb={60}
				gap="md"
				ta="center"
			>
				<Badge
					variant="light"
					size="lg"
					color="blue"
				>
					Discover
				</Badge>
				<Title
					order={1}
					size={48}
					fw={900}
					style={{ letterSpacing: -1 }}
				>
					Temukan Perusahaan Impian
				</Title>
				<Text
					c="dimmed"
					size="lg"
					maw={600}
				>
					Jelajahi perusahaan teknologi terbaik yang menggunakan Klop! untuk mencari
					talenta seperti Anda.
				</Text>

				<TextInput
					placeholder="Cari nama perusahaan..."
					size="xl"
					radius="xl"
					readOnly={isQuerying}
					defaultValue={searchParams.get('search') || undefined}
					leftSection={<Search size={20} />}
					onBlur={(e) => {
						if (!isQuerying) {
							handlerQueryCompanies(e.target.value)
						}
					}}
					onKeyUp={(e) => {
						if (
							!isQuerying &&
							e.key === 'Enter' &&
							'value' in e.target &&
							(typeof e.target.value === 'undefined' ||
								typeof e.target.value === 'string')
						) {
							handlerQueryCompanies(e.target.value)
						}
					}}
					rightSection={
						<ActionIcon
							size="xl"
							radius="xl"
							color="blue"
						>
							{isQuerying ? (
								<Loader
									size="xs"
									color="white"
								/>
							) : (
								<Search />
							)}
						</ActionIcon>
					}
					rightSectionWidth={80}
					w="100%"
					maw={600}
					mt="lg"
					classNames={{
						input: '!h-16 !min-h-16 rounded-full',
					}}
				/>
			</Stack>

			<SimpleGrid
				cols={{ base: 1, sm: 2, lg: 3 }}
				spacing="xl"
			>
				{isQuerying
					? Array.from({ length: 6 }, (_, index) => (
							<Skeleton
								key={`loading-${index}`}
								h={290}
								radius="lg"
							/>
						))
					: companies.map((company, index) => (
							<Card
								key={`${company.id}-${index}`}
								padding="lg"
								radius="lg"
								withBorder
								bg="white"
							>
								<Group
									justify="space-between"
									mb="lg"
								>
									<Image
										src={company.logo || company.favicon}
										width={100}
										height={100}
										className="max-w-28 h-16 object-contain! object-left!"
									/>
									<Badge
										variant="light"
										color="gray"
									>
										{company.totalEmployees} Pegawai
									</Badge>
								</Group>

								<Title
									order={3}
									size="h6"
									mb="lg"
								>
									{company.title}
								</Title>

								<Stack
									gap="xs"
									pb="lg"
								>
									{company.businessCategory ? (
										<Group gap={6}>
											<Building2
												size={16}
												color="gray"
											/>
											<Text
												size="sm"
												c="dimmed"
											>
												{company.businessCategory}
											</Text>
										</Group>
									) : null}
									{company.location ? (
										<Group gap={6}>
											<MapPin
												size={16}
												color="gray"
											/>
											<Text
												size="sm"
												c="dimmed"
											>
												{company.location}
											</Text>
										</Group>
									) : null}
								</Stack>

								<Button
									component={Link}
									href={`/${company.slug}`}
									variant="light"
									color="blue"
									fullWidth
									radius="md"
									mt="auto"
									rightSection={<ArrowRight size={16} />}
								>
									Lihat Lowongan
								</Button>
							</Card>
						))}
			</SimpleGrid>
		</Container>
	)
}
