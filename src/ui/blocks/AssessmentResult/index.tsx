import type { Assessment, AssessmentSubmission } from '$root/payload-types'
import {
	Box,
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
	type ContainerProps,
} from '@mantine/core'
import { Check, Sparkles, X } from 'lucide-react'

type Props = {
	data: AssessmentSubmission
	assessment: Assessment
} & ContainerProps

export function AssessmentResult({ data, assessment, ...props }: Props) {
	const isPassed = data.score >= (assessment.passingGrade || 70)
	const statusColor = isPassed ? 'green' : 'red'
	const totalCorrectAnswers = data.assessmentResults?.filter(
		(result) => result.isAnswerCorrect === true,
	).length

	return (
		<Container
			{...props}
			size={props.size || 'sm'}
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
						Hi {data.candidateName},
					</Text>

					<Text
						fw={900}
						size={rem(100)}
						lh={1}
						c={statusColor}
					>
						{data.score}%
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
							{totalCorrectAnswers}
						</Text>{' '}
						out of {assessment.questions?.length} questions correctly
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
								{data.score}%
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
								{assessment?.passingGrade || 70}%
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

						{data.summary ? (
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
									{data.summary}
								</Text>
							</Paper>
						) : null}
					</Box>
				</Stack>

				<Box
					bg={statusColor}
					p="lg"
				>
					<Stack
						gap={4}
						align="center"
					>
						<Group gap="xs">
							<ThemeIcon
								color={statusColor}
								variant="white"
								size="sm"
								radius="xl"
							>
								{isPassed ? <Check size={14} /> : <X size={14} />}
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
							opacity={0.9}
						>
							Assessment: {assessment?.title}
						</Text>
					</Stack>
				</Box>
			</Card>
		</Container>
	)
}
