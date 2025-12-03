import {
	Box,
	Button,
	Card,
	Container,
	Divider,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
	rem,
} from '@mantine/core'
import { ArrowRight, Check, RefreshCw, Sparkles, X } from 'lucide-react'

interface AssessmentResultProps {
	candidateName?: string
	score?: number
	passingScore?: number
	correctAnswers?: number
	totalQuestions?: number
	assessmentTitle?: string
	aiFeedback?: string
}

export function AssessmentResult({
	candidateName = 'Peserta',
	score = 80,
	passingScore = 70,
	correctAnswers = 12,
	totalQuestions = 15,
	assessmentTitle = 'Senior JavaScript Assessment',
	aiFeedback,
}: AssessmentResultProps) {
	const isPassed = score >= passingScore
	const statusColor = isPassed ? 'green' : 'red'
	const StatusIcon = isPassed ? Check : X

	return (
		<Container
			size="sm"
			py={60}
		>
			<Card
				padding={0}
				radius="lg"
				shadow="md"
				withBorder
				bg="white"
			>
				<Stack
					align="center"
					gap="xs"
					p={{ base: 30, md: 50 }}
				>
					<Text
						c="dimmed"
						size="sm"
						fw={700}
						tt="uppercase"
					>
						Assessment Result
					</Text>
					<Text
						size="lg"
						fw={500}
					>
						Hi {candidateName},
					</Text>

					<Text
						fw={900}
						size={rem(100)}
						lh={1}
						c={statusColor}
						variant="gradient"
						gradient={
							isPassed
								? { from: 'green.6', to: 'teal.6', deg: 45 }
								: { from: 'red.6', to: 'orange.6', deg: 45 }
						}
					>
						{score}%
					</Text>

					<Title
						order={2}
						ta="center"
						c="dark.9"
						mt="sm"
					>
						{isPassed ? 'Congratulations! You Passed!' : 'Sorry, You Failed.'}
					</Title>
					<Text
						c="dimmed"
						ta="center"
					>
						You answered{' '}
						<Text
							span
							fw={700}
							c="dark.9"
						>
							{correctAnswers}
						</Text>{' '}
						out of {totalQuestions} questions correctly
					</Text>

					<Divider
						my="md"
						w="100%"
					/>

					<Group
						w="100%"
						justify="space-around"
						align="center"
					>
						<Box ta="center">
							<Text
								size="sm"
								c="dimmed"
								mb={5}
							>
								Your Score
							</Text>
							<Text
								fw={900}
								size="xl"
								c={statusColor}
							>
								{score}%
							</Text>
						</Box>
						<Divider
							orientation="vertical"
							h={40}
						/>
						<Box ta="center">
							<Text
								size="sm"
								c="dimmed"
								mb={5}
							>
								Passing Score
							</Text>
							<Text
								fw={900}
								size="xl"
								c="gray.7"
							>
								{passingScore}%
							</Text>
						</Box>
					</Group>

					<Box
						w="100%"
						mt="xl"
					>
						<Group
							mb="xs"
							gap={6}
							justify="center"
						>
							<Sparkles
								size={16}
								color="var(--mantine-color-blue-6)"
							/>
							<Text
								size="sm"
								fw={700}
								c="blue.6"
								tt="uppercase"
							>
								AI Performance Analysis
							</Text>
						</Group>

						<Paper
							withBorder
							p="md"
							radius="md"
							bg="gray.0"
							style={{
								borderLeft: `4px solid var(--mantine-color-${statusColor}-5)`,
							}}
						>
							<Text
								size="sm"
								c="dark.8"
								lh={1.6}
								ta="justify"
							>
								{aiFeedback ||
									'AI sedang menganalisis pola jawaban Anda. Hasil ini menunjukkan pemahaman yang kuat pada konsep dasar, namun perlu peningkatan pada studi kasus kompleks.'}
							</Text>
						</Paper>
					</Box>
				</Stack>

				<Box
					bg={isPassed ? 'green.6' : 'red.6'}
					p="lg"
				>
					<Stack
						gap={4}
						align="center"
					>
						<Group gap="xs">
							<ThemeIcon
								color="white"
								variant="white"
								size="sm"
								radius="xl"
								style={{
									color: isPassed
										? 'var(--mantine-color-green-6)'
										: 'var(--mantine-color-red-6)',
								}}
							>
								<StatusIcon size={14} />
							</ThemeIcon>
							<Text
								fw={800}
								tt="uppercase"
								c="white"
							>
								{isPassed ? 'PASSED' : 'NOT PASSED'}
							</Text>
						</Group>

						<Text
							size="sm"
							c="white"
							style={{ opacity: 0.9 }}
						>
							Assessment: {assessmentTitle}
						</Text>
					</Stack>
				</Box>
			</Card>

			<Group
				mt="xl"
				justify="center"
			>
				<Button
					variant="default"
					leftSection={<RefreshCw size={16} />}
					onClick={() => window.location.reload()}
				>
					Retake Assessment
				</Button>
				<Button
					color="dark"
					rightSection={<ArrowRight size={16} />}
					component="a"
					href="/"
				>
					Back to Dashboard
				</Button>
			</Group>
		</Container>
	)
}
