'use client'

import { Alert, Center, Container, Loader, type ContainerProps } from '@mantine/core'
import { useFullscreen, useSetState } from '@mantine/hooks'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { useRouter } from '$hooks/use-router'
import { slugAssessment } from '$modules/vars'
import type { Assessment, AssessmentSubmission, User } from '$payload-types'
import type { PayloadExamAssessment } from '$schema/assesment'
import { actionAssessmentSubmission } from '$server-functions/assessmentSubmission'
import { ExamView } from './ExamView'
import { IntroView } from './IntroView'

type Props = {
	data: Assessment
	authUser: User | null
	userAssessmentSubmission: AssessmentSubmission | null
} & ContainerProps

export function AssessmentRunner({ data, authUser, userAssessmentSubmission, ...props }: Props) {
	const [fullscreenOffCount, setFullscreenOffCount] = useState(0)
	const { toggle: toggleFullscreen, fullscreen } = useFullscreen()
	const router = useRouter()
	const [isLoadingActionAssessmentSubmission, startActionAssessmentSubmission] = useTransition()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [step, setStep] = useState<'INTRO' | 'EXAM' | null>('INTRO')
	const [payload, setPayload] = useSetState<{
		candidate: User | null
		exams: (PayloadExamAssessment & {
			expectedAnswer: string
		})[]
	}>({
		candidate: null,
		exams: [],
	})

	const handlerAsessmentSubmission = useCallback(
		(formData: typeof payload) => {
			if (fullscreen) {
				toggleFullscreen()
			}

			setStep(null)

			startActionAssessmentSubmission(async () => {
				setErrorMessage(null)

				const vacancy = typeof data.vacancy === 'object' ? data.vacancy : null
				const company = typeof vacancy?.company === 'object' ? vacancy.company : null
				const companyUserId =
					typeof company?.author === 'number' ? company.author : company?.author?.id

				if (company && formData.candidate && companyUserId) {
					try {
						const assessmentSubmission = await actionAssessmentSubmission({
							companyUserId,
							candidateUserId: formData.candidate.id,
							assessment: {
								id: data.id,
								title: data.title,
								description: data.description
									? convertLexicalToPlaintext({
											data: data.description,
										})
									: '',
							},
							exams: formData.exams,
						})

						if (assessmentSubmission.success) {
							router.replace(
								`/${slugAssessment}/${data.slug}/${assessmentSubmission.data.id}`,
							)
						} else {
							setErrorMessage(assessmentSubmission.error)
						}
					} catch {
						setErrorMessage('Something went wrong')
					}
				} else {
					setErrorMessage('Something went wrong')
				}
			})
		},
		[
			data.description,
			data.id,
			data.slug,
			data.title,
			data.vacancy,
			fullscreen,
			router,
			toggleFullscreen,
		],
	)

	useEffect(() => {
		if (!fullscreen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setFullscreenOffCount((p) => p + 1)
		}
	}, [fullscreen])

	useEffect(() => {
		if (fullscreenOffCount > 1 && !isLoadingActionAssessmentSubmission) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			handlerAsessmentSubmission({
				...payload,
				exams: payload.exams.map((exam) => ({
					...exam,
					answer: '',
				})),
			})
		}
	}, [
		fullscreenOffCount,
		handlerAsessmentSubmission,
		isLoadingActionAssessmentSubmission,
		payload,
	])

	if (step === 'INTRO') {
		return (
			<IntroView
				{...props}
				data={data}
				authUser={authUser}
				userAssessmentSubmission={userAssessmentSubmission}
				onSubmit={(candidate) => {
					setPayload({
						candidate,
					})
					setStep('EXAM')
					toggleFullscreen()
				}}
			/>
		)
	}

	if (step === 'EXAM' && payload.candidate) {
		return (
			<ExamView
				{...props}
				candidate={payload.candidate}
				data={data}
				onSubmit={(submitData) => {
					setPayload({
						exams: submitData,
					})
					handlerAsessmentSubmission({
						...payload,
						exams: submitData,
					})
				}}
			/>
		)
	}

	return (
		<Container
			{...props}
			size={props.size || 'xl'}
		>
			{errorMessage ? (
				<Center>
					<Alert
						variant="light"
						color="red"
					>
						{errorMessage}
					</Alert>
				</Center>
			) : isLoadingActionAssessmentSubmission ? (
				<Center>
					<Loader />
				</Center>
			) : null}
		</Container>
	)
}
