import {
	Badge,
	Box,
	Button,
	Card,
	Container,
	Divider,
	Group,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
	type ContainerProps,
} from '@mantine/core'
import dayjs from 'dayjs'
import {
	Building,
	Check,
	Facebook,
	Globe,
	Instagram,
	Linkedin,
	MapPin,
	Music,
	Twitter,
	Users,
	Youtube,
} from 'lucide-react'

import Image from '$components/Image'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { vacancyEducation, vacancyLevel, vacancyType } from '$payload-libs/enum'
import type { Company, Vacancy } from '$payload-types'
import { formatCompactNumber } from '$utils/common'

type Props = {
	data: Company
	vacancies?: Vacancy[]
} & ContainerProps

export function Company({ data, vacancies, ...props }: Props) {
	const socials = data.socials ? Object.entries(data.socials).filter(([_, v]) => !!v) : []

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			<Card
				withBorder
				padding="xl"
				radius="lg"
				bg="white"
				mb="xl"
			>
				<Group
					align="flex-start"
					wrap="nowrap"
				>
					{/* Logo */}
					<Image
						src={data.logo || data.favicon || data.featuredImage}
						width={100}
						height={100}
						className="size-[100px] object-contain"
					/>

					{/* Info */}
					<Box flex={1}>
						<Group
							align="center"
							gap="xs"
							mb={4}
						>
							<Title
								order={2}
								size="h2"
								fw={700}
							>
								{data.title}
							</Title>
							<ThemeIcon
								size="xs"
								radius="xl"
								color="blue"
								variant="filled"
							>
								<Check size={10} />
							</ThemeIcon>
						</Group>
						{data.excerpt ? (
							<Text
								c="dimmed"
								size="md"
								mb="lg"
							>
								{data.excerpt}
							</Text>
						) : null}

						<Group
							gap="xl"
							mt="md"
						>
							{data.location ? (
								<Group gap="xs">
									<MapPin
										size={18}
										color="gray"
									/>
									<Text c="dimmed">{data.location}</Text>
								</Group>
							) : null}
							{data.totalEmployees ? (
								<Group gap="xs">
									<Users
										size={18}
										color="gray"
									/>
									<Text
										size="sm"
										c="dimmed"
									>
										{data.totalEmployees}
									</Text>
								</Group>
							) : null}
							{data.businessCategory ? (
								<Group gap="xs">
									<Building
										size={18}
										color="gray"
									/>
									<Text
										size="sm"
										c="dimmed"
									>
										{data.businessCategory}
									</Text>
								</Group>
							) : null}
						</Group>
					</Box>
				</Group>
			</Card>

			<Stack gap="xl">
				{vacancies?.length ? (
					<Card
						withBorder
						radius="lg"
						p="xl"
					>
						<Title
							order={3}
							mb="lg"
						>
							Lowongan di {data.title}
						</Title>
						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
							spacing="md"
						>
							{vacancies.map((vacancy, index) => (
								<Card
									key={`${vacancy.id}-${index}`}
									shadow="sm"
									padding="md"
									radius="lg"
									withBorder
									bg="white"
								>
									<Text
										fw={600}
										mb={2}
										lineClamp={2}
									>
										{vacancy.title}
									</Text>
									{vacancy.expiresAt ? (
										<Text
											size="sm"
											c="dimmed"
											mb="md"
										>
											Tutup pada{' '}
											{dayjs(vacancy.expiresAt).format('DD MMMM YYYY')}
										</Text>
									) : null}

									<Group
										gap="xs"
										pb="lg"
									>
										{vacancy.type ? (
											<Badge
												variant="light"
												color="gray"
												radius="sm"
												size="sm"
											>
												{vacancyType.find(
													(type) => type.value === vacancy.type,
												)?.label || vacancy.type}
											</Badge>
										) : null}
										{vacancy.level ? (
											<Badge
												variant="light"
												color="gray"
												radius="sm"
												size="sm"
											>
												{vacancyLevel.find(
													(level) => level.value === vacancy.level,
												)?.label || vacancy.level}
											</Badge>
										) : null}
										{vacancy.education ? (
											<Badge
												variant="light"
												color="gray"
												radius="sm"
												size="sm"
											>
												{vacancyEducation.find(
													(type) => type.value === vacancy.education,
												)?.label || vacancy.education}
											</Badge>
										) : null}
									</Group>

									<Divider
										mt="auto"
										mb="xs"
									/>

									<Group
										justify="space-between"
										align="center"
									>
										<Text
											fw={700}
											size="sm"
											c="blue"
										>
											{[vacancy.fromExpectedSalary, vacancy.toExpectedSalary]
												.filter(Boolean)
												.map((value) => formatCompactNumber(value!))
												.join(' - ')}
										</Text>
										<Button
											component={Link}
											href={`/${data.slug}/${vacancy.slug}`}
											variant="subtle"
											size="sm"
											color="gray"
										>
											Detail
										</Button>
									</Group>
								</Card>
							))}
						</SimpleGrid>
					</Card>
				) : null}

				{data.description ? (
					<Card
						withBorder
						radius="lg"
						p="xl"
					>
						<Title
							order={3}
							mb="lg"
						>
							Tentang Perusahaan
						</Title>
						<Richtext data={data.description} />
					</Card>
				) : null}

				{data.gallery && data.gallery.length ? (
					<Card
						withBorder
						radius="lg"
						p="xl"
					>
						<Title
							order={3}
							mb="lg"
						>
							Galeri
						</Title>
						<SimpleGrid
							cols={{ base: 2, md: 4 }}
							spacing="md"
						>
							{data.gallery.map((img, idx) => (
								<Image
									key={idx}
									src={img}
									className="rounded-md h-[180px]"
								/>
							))}
						</SimpleGrid>
					</Card>
				) : null}

				{socials.length ? (
					<Card
						withBorder
						radius="lg"
						p="xl"
					>
						<Title
							order={3}
							mb="lg"
						>
							Hubungi Kami
						</Title>
						<Group gap="xl">
							{socials.map(([social, link], index) => (
								<Group
									component={Link}
									// @ts-expect-error
									href={link!}
									target="_blank"
									key={`${link}-${index}`}
									gap={6}
								>
									{social === 'website' ? (
										<Globe size={20} />
									) : social === 'facebook' ? (
										<Facebook size={20} />
									) : social === 'instagram' ? (
										<Instagram size={20} />
									) : social === 'linkedin' ? (
										<Linkedin size={20} />
									) : social === 'twitter' ? (
										<Twitter size={20} />
									) : social === 'youtube' ? (
										<Youtube size={20} />
									) : social === 'tiktok' ? (
										<Music size={20} />
									) : null}

									<Text
										component="span"
										tt="capitalize"
									>
										{social}
									</Text>
								</Group>
							))}
						</Group>
					</Card>
				) : null}
			</Stack>
		</Container>
	)
}
