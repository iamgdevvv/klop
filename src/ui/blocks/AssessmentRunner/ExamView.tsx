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
	Title,
} from '@mantine/core'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

const MOCK_QUESTIONS = [
	{
		id: 1,
		text: 'Manakah method yang digunakan untuk menghapus elemen terakhir dari array?',
		options: ['shift()', 'pop()', 'splice()', 'slice()'],
	},
	{
		id: 2,
		text: 'Apa output dari console.log(typeof null)?',
		options: ['null', 'undefined', 'object', 'number'],
	},
	{
		id: 3,
		text: 'Keyword apa yang digunakan untuk membuat variabel constant?',
		options: ['var', 'let', 'const', 'final'],
	},
	// ... bisa ditambah
]

interface ExamViewProps {
	candidate: { name: string; phone: string }
	onFinish: () => void
}

export function ExamView({ candidate, onFinish }: ExamViewProps) {
	const [activeQ, setActiveQ] = useState(0)
	const [answers, setAnswers] = useState<Record<number, string>>({})
	const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 Menit dalam detik

	// Logic Timer Mundur
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer)
					onFinish() // Waktu habis
					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(timer)
	}, [onFinish])

	// Format Menit:Detik
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${s < 10 ? '0' : ''}${s}`
	}

	const handleAnswer = (val: string) => {
		setAnswers({ ...answers, [activeQ]: val })
	}

	const totalQuestions = MOCK_QUESTIONS.length
	const progress = ((activeQ + 1) / totalQuestions) * 100

	return (
		<Box py="md">
			<Container size="xl">
				<Paper
					shadow="xs"
					p="md"
					radius="md"
					mb="xl"
				>
					<Group justify="space-between">
						<Box>
							<Text
								fw={700}
								size="lg"
							>
								JavaScript Developer Assessment
							</Text>
							<Text
								size="sm"
								c="dimmed"
							>
								Peserta: {candidate.name}
							</Text>
						</Box>

						<Card
							bg="dark.8"
							c="white"
							px="lg"
							py="xs"
							radius="md"
						>
							<Group gap="xs">
								<Clock size={18} />
								<Text
									fw={700}
									variant="gradient"
									gradient={{ from: 'green.3', to: 'lime.3' }}
								>
									{formatTime(timeLeft)}
								</Text>
							</Group>
						</Card>
					</Group>
					<Progress
						value={progress}
						size="sm"
						mt="md"
						animated
					/>
				</Paper>

				<Grid>
					<Grid.Col span={{ base: 12, md: 9 }}>
						<Card
							shadow="sm"
							radius="md"
							p={30}
							h="100%"
						>
							<Text
								c="blue"
								fw={700}
								mb="md"
							>
								Question {activeQ + 1} of {totalQuestions}
							</Text>
							<Title
								order={3}
								mb={30}
								style={{ lineHeight: 1.4 }}
							>
								{MOCK_QUESTIONS[activeQ].text}
							</Title>

							<Radio.Group
								value={answers[activeQ] || ''}
								onChange={handleAnswer}
								name="examOption"
							>
								<Stack gap="md">
									{MOCK_QUESTIONS[activeQ].options.map((opt) => (
										<Radio.Card
											radius="md"
											value={opt}
											key={opt}
											style={{ padding: '15px' }}
										>
											<Group
												wrap="nowrap"
												align="flex-start"
											>
												<Radio.Indicator />
												<Text>{opt}</Text>
											</Group>
										</Radio.Card>
									))}
								</Stack>
							</Radio.Group>

							<Group
								mt={40}
								justify="space-between"
							>
								<Button
									variant="default"
									disabled={activeQ === 0}
									onClick={() => setActiveQ((prev) => prev - 1)}
								>
									Previous
								</Button>
								<Button
									color="blue"
									onClick={() => {
										if (activeQ < totalQuestions - 1)
											setActiveQ((prev) => prev + 1)
										else onFinish() // Submit jika soal terakhir
									}}
								>
									{activeQ === totalQuestions - 1
										? 'Finish Assessment'
										: 'Next Question'}
								</Button>
							</Group>
						</Card>
					</Grid.Col>

					<Grid.Col span={{ base: 12, md: 3 }}>
						<Card
							shadow="sm"
							radius="md"
							p="md"
						>
							<Text
								fw={700}
								mb="md"
							>
								Questions Navigator
							</Text>
							<Group gap={8}>
								{MOCK_QUESTIONS.map((q, index) => {
									const isAnswered = answers[index] !== undefined
									const isCurrent = activeQ === index

									return (
										<Button
											key={q.id}
											w={36}
											h={36}
											p={0}
											radius="md"
											variant={
												isCurrent
													? 'filled'
													: isAnswered
														? 'light'
														: 'default'
											}
											color={isAnswered ? 'green' : 'blue'}
											onClick={() => setActiveQ(index)}
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
									<Box
										w={10}
										h={10}
										bg="blue.6"
										style={{ borderRadius: 4 }}
									/>
									<Text size="xs">Current</Text>
								</Group>
								<Group
									gap="xs"
									mb={5}
								>
									<Box
										w={10}
										h={10}
										bg="green.1"
										style={{ borderRadius: 4 }}
									/>
									<Text size="xs">Answered</Text>
								</Group>
								<Group gap="xs">
									<Box
										w={10}
										h={10}
										bg="gray.3"
										style={{ borderRadius: 4 }}
									/>
									<Text size="xs">Unanswered</Text>
								</Group>
							</Box>
						</Card>
					</Grid.Col>
				</Grid>
			</Container>
		</Box>
	)
}
