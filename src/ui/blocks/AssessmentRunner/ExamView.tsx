'use client'

import {
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Paper,
	Progress,
	Radio,
	Stack,
	Text,
	Textarea,
	Title,
	type ContainerProps,
} from '@mantine/core'
import { useForm, type TransformedValues } from '@mantine/form'
import { Clock } from 'lucide-react'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as z from 'zod'

import Image from '$components/Image'
import { candidateGender } from '$payload-libs/enum'
import type { Assessment } from '$payload-types'
import { cx } from '$root/lib/utils/styles'
import {
	PayloadExamAssessmentSchema,
	type PayloadCandidateAssessment,
	type PayloadExamAssessment,
} from '$schema/assesment'
import { useListState, usePageLeave } from '@mantine/hooks'

type Props = {
	data: Assessment
	candidate: PayloadCandidateAssessment
	onSubmit: (
		payload: (PayloadExamAssessment & {
			expectedAnswer: string
		})[],
	) => void
} & Omit<ContainerProps, 'onSubmit'>

const formatTime = (seconds: number) => {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${m}:${s < 10 ? '0' : ''}${s}`
}

export function ExamView({ data, candidate, onSubmit, ...props }: Props) {
	const [leftsCount, setLeftsCount] = useState(0)
	usePageLeave(() => setLeftsCount((p) => p + 1))

	const questions = useMemo(() => {
		const _questions: (Omit<
			NonNullable<Assessment['questions']>[number],
			'question' | 'expectedAnswer'
		> & {
			question: string
			expectedAnswer: string
		})[] = []

		data.questions?.forEach((item) => {
			if (item.question && item.expectedAnswer) {
				_questions.push({
					...item,
					question: item.question,
					expectedAnswer: item.expectedAnswer,
				})
			}
		})

		return _questions
	}, [data.questions])

	const intialResultExams = useMemo(
		() =>
			questions.map((item) => ({
				question: item.question,
				answer: '',
				expectedAnswer: item.expectedAnswer,
			})),
		[questions],
	)

	const [currentIndexQuestion, setCurrentIndexQuestion] = useState(0)
	const [resultExams, handlerResultExams] = useListState(intialResultExams)
	const [timeLeft, setTimeLeft] = useState<number>((data.duration || 20) * 60)

	const totalQuestions = useMemo(() => questions.length, [questions])

	const progress = useMemo(
		() => ((currentIndexQuestion + 1) / totalQuestions) * 100,
		[currentIndexQuestion, totalQuestions],
	)

	const candidateMetadata = useMemo(() => {
		return [
			candidate.name,
			candidateGender.find((gender) => gender.value === candidate.gender)?.label,
		]
			.filter(Boolean)
			.join(' • ')
	}, [candidate])

	const form = useForm<PayloadExamAssessment>({
		mode: 'uncontrolled',
		validate: zod4Resolver(
			z.object({
				...PayloadExamAssessmentSchema.shape,
				answer: z
					.string('Silahkan jawab pertanyaan terlebih dahulu')
					.nonempty('Silahkan jawab pertanyaan terlebih dahulu'),
			}),
		),
		validateInputOnBlur: true,
		initialValues: {
			question: questions[0].question,
			answer: '',
		},
	})

	const handlerSubmitAmswer = useCallback(
		(payload: TransformedValues<typeof form>) => {
			const isLastQuestion = currentIndexQuestion === totalQuestions - 1

			if (isLastQuestion) {
				onSubmit([
					...resultExams.slice(0, -1),
					{
						...payload,
						expectedAnswer: questions[currentIndexQuestion].expectedAnswer,
					},
				])
			} else {
				handlerResultExams.setItem(currentIndexQuestion, {
					...payload,
					expectedAnswer: questions[currentIndexQuestion].expectedAnswer,
				})
				setCurrentIndexQuestion(currentIndexQuestion + 1)
				form.setFieldValue('question', resultExams[currentIndexQuestion + 1].question)
				form.setFieldValue('answer', resultExams[currentIndexQuestion + 1].answer)
			}
		},
		[
			currentIndexQuestion,
			totalQuestions,
			onSubmit,
			resultExams,
			handlerResultExams,
			form,
			questions,
		],
	)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer)

					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(timer)
	}, [onSubmit, resultExams])

	useEffect(() => {
		if (timeLeft <= 0) {
			onSubmit(resultExams)
		}
	}, [onSubmit, resultExams, timeLeft])

	useEffect(() => {
		if (leftsCount > 2) {
			onSubmit(resultExams.map((item) => ({ ...item, answer: '' })))
		}
	}, [leftsCount, onSubmit, resultExams])

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			<Card
				withBorder
				shadow="sm"
				radius="xl"
				p="xl"
				mb="xl"
			>
				<Group
					align="flex-start"
					justify="space-between"
				>
					<Stack gap={4}>
						<Text
							fw={700}
							size="xl"
						>
							JavaScript Developer Assessment
						</Text>
						<Text c="dimmed">{candidateMetadata}</Text>
					</Stack>

					<Paper
						bg="dark"
						c={timeLeft > 120 ? 'white' : 'red'}
						px="lg"
						py="xs"
						radius="md"
					>
						<Group
							gap="xs"
							className={cx(timeLeft < 120 && 'animate-pulse')}
						>
							<Clock size={18} />
							<Text fw={700}>{formatTime(timeLeft)}</Text>
						</Group>
					</Paper>
				</Group>
				<Progress
					value={progress}
					size="sm"
					mt="md"
					animated
				/>
			</Card>

			<Card
				withBorder
				shadow="sm"
				radius="xl"
				p="xl"
				mb="lg"
				hiddenFrom="lg"
			>
				<Text
					fw={700}
					mb="md"
				>
					Questions Navigator
				</Text>
				<Group gap={8}>
					{questions.map((q, index) => {
						const isAnswered = !!resultExams[index].answer
						const isCurrent = currentIndexQuestion === index

						return (
							<Button
								key={q.id}
								w={36}
								h={36}
								p={0}
								radius="md"
								variant={isCurrent ? 'filled' : isAnswered ? 'light' : 'default'}
								color={isAnswered ? 'green' : 'blue'}
								onClick={() => setCurrentIndexQuestion(index)}
							>
								{index + 1}
							</Button>
						)
					})}
				</Group>

				<Box mt="xl">
					<Group
						gap="xs"
						mb={5}
					>
						<Paper
							w={10}
							h={10}
							bg="blue.6"
							radius={4}
						/>
						<Text size="xs">Current</Text>
					</Group>
					<Group
						gap="xs"
						mb={5}
					>
						<Paper
							w={10}
							h={10}
							bg="green.1"
							radius={4}
						/>
						<Text size="xs">Answered</Text>
					</Group>
					<Group gap="xs">
						<Paper
							w={10}
							h={10}
							bg="gray.3"
							radius={4}
						/>
						<Text size="xs">Unanswered</Text>
					</Group>
				</Box>
			</Card>

			<Grid>
				<Grid.Col span={{ base: 12, lg: 9 }}>
					<Card
						withBorder
						shadow="sm"
						radius="xl"
						p="xl"
						h="100%"
					>
						<Text
							c="blue"
							fw={700}
							mb="md"
						>
							Question {currentIndexQuestion + 1} of {totalQuestions}
						</Text>
						<Title
							order={3}
							mb={30}
						>
							{questions[currentIndexQuestion].question}
						</Title>
						{questions[currentIndexQuestion].questionMedia ? (
							<Image
								src={questions[currentIndexQuestion].questionMedia}
								className="w-auto max-w-full max-h-xl mt-md"
							/>
						) : null}

						<form onSubmit={form.onSubmit(handlerSubmitAmswer)}>
							{questions[currentIndexQuestion].isAnswerOptions &&
							questions[currentIndexQuestion].answerOptions?.length ? (
								<Radio.Group
									key={form.key('answer')}
									errorProps={{
										fz: 'sm',
										mt: 'sm',
									}}
									{...form.getInputProps('answer')}
								>
									<Stack gap="md">
										{questions[currentIndexQuestion].answerOptions.map(
											(item, index) => {
												if (!item.answerOption) {
													return null
												}

												return (
													<Radio.Card
														p="md"
														radius="md"
														value={item.answerOption}
														key={`${item.id}-${index}`}
													>
														<Group
															wrap="nowrap"
															align="flex-start"
														>
															<Radio.Indicator mt={2} />
															<Text>{item.answerOption}</Text>
														</Group>
													</Radio.Card>
												)
											},
										)}
									</Stack>
								</Radio.Group>
							) : (
								<Textarea
									key={form.key('answer')}
									defaultValue={resultExams[currentIndexQuestion].answer}
									errorProps={{
										fz: 'sm',
										mt: 'sm',
									}}
									{...form.getInputProps('answer')}
								/>
							)}

							<Group
								mt={40}
								justify="space-between"
							>
								<Button
									type="button"
									variant="default"
									disabled={currentIndexQuestion === 0}
									onClick={() => {
										const newIndex = currentIndexQuestion - 1

										form.setFieldValue(
											'question',
											resultExams[newIndex].question,
										)
										form.setFieldValue('answer', resultExams[newIndex].answer)

										setCurrentIndexQuestion(newIndex)
									}}
								>
									Previous
								</Button>
								<Button
									type="submit"
									color="blue"
								>
									{currentIndexQuestion === totalQuestions - 1
										? 'Finish Assessment'
										: 'Next Question'}
								</Button>
							</Group>
						</form>
					</Card>
				</Grid.Col>

				<Grid.Col
					span={{ base: 12, lg: 3 }}
					visibleFrom="lg"
				>
					<Card
						withBorder
						shadow="sm"
						radius="xl"
						p="xl"
					>
						<Text
							fw={700}
							mb="md"
						>
							Questions Navigator
						</Text>
						<Group gap={8}>
							{questions.map((q, index) => {
								const isAnswered = !!resultExams[index].answer
								const isCurrent = currentIndexQuestion === index

								return (
									<Button
										key={q.id}
										w={36}
										h={36}
										p={0}
										radius="md"
										variant={
											isCurrent ? 'filled' : isAnswered ? 'light' : 'default'
										}
										color={isAnswered ? 'green' : 'blue'}
										onClick={() => setCurrentIndexQuestion(index)}
									>
										{index + 1}
									</Button>
								)
							})}
						</Group>

						<Box mt="xl">
							<Group
								gap="xs"
								mb={5}
							>
								<Paper
									w={10}
									h={10}
									bg="blue.6"
									radius={4}
								/>
								<Text size="xs">Current</Text>
							</Group>
							<Group
								gap="xs"
								mb={5}
							>
								<Paper
									w={10}
									h={10}
									bg="green.1"
									radius={4}
								/>
								<Text size="xs">Answered</Text>
							</Group>
							<Group gap="xs">
								<Paper
									w={10}
									h={10}
									bg="gray.3"
									radius={4}
								/>
								<Text size="xs">Unanswered</Text>
							</Group>
						</Box>
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	)
}
