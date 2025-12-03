'use client'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import {
	Button,
	FieldLabel,
	TextareaInput,
	useAllFormFields,
	useField,
	useFormFields,
} from '@payloadcms/ui'
import { Loader } from 'lucide-react'
import type { ArrayFieldClientProps, TextFieldClientProps } from 'payload'
import { useCallback, useMemo, useTransition, type ComponentProps } from 'react'

import {
	klopAIExpectedAnswerChoices,
	klopAIExpectedAnswerEssay,
	klopAIExpectedAnswerOptions,
	klopAIQuestionComprehensive,
	klopAIQuestionEnhance,
	klopAIQuestionGenerate,
} from '$repo/klop-ai'

const QuestionComprehensiveCTA = ({
	parentPathField,
	...props
}: ComponentProps<typeof Button> & {
	parentPathField: string
}) => {
	const [isLoading, startTransition] = useTransition()

	const [fields, dispatchFields] = useAllFormFields()

	const titleValue = useFormFields(([fields]) => {
		return fields?.title?.value as string
	})

	const descriptionValue = useFormFields(([fields]) => {
		if (!fields?.description?.value) {
			return ''
		}

		return convertLexicalToPlaintext({
			// @ts-expect-error
			data: fields.description.value,
		})
	})

	const isAnswerOptionsValue = useFormFields(([fields]) => {
		if (`${parentPathField}isAnswerOptions` in fields) {
			return fields[`${parentPathField}isAnswerOptions`]?.value === true
		}

		return false
	})

	const ableGenerate = useMemo(() => {
		return !!titleValue && !!descriptionValue
	}, [titleValue, descriptionValue])

	const handlerAutoGenerate = useCallback(() => {
		startTransition(async () => {
			if (ableGenerate) {
				const questionComprehensive = await klopAIQuestionComprehensive({
					title: titleValue,
					description: descriptionValue,
					isAnswerOptions: isAnswerOptionsValue,
				})

				if (questionComprehensive) {
					dispatchFields({
						path: `${parentPathField}question`,
						type: 'UPDATE',
						value: questionComprehensive.question,
					})

					dispatchFields({
						path: `${parentPathField}expectedAnswer`,
						type: 'UPDATE',
						value: questionComprehensive.expectedAnswer,
					})

					if (questionComprehensive.isAnswerOptions) {
						dispatchFields({
							path: `${parentPathField}isAnswerOptions`,
							type: 'UPDATE',
							value: questionComprehensive.isAnswerOptions,
						})

						if (questionComprehensive.answerOptions?.length) {
							questionComprehensive.answerOptions.forEach((answerOption, index) => {
								if (
									`${parentPathField}answerOptions.${index}.answerOption` in
									fields
								) {
									dispatchFields({
										path: `${parentPathField}answerOptions.${index}.answerOption`,
										type: 'UPDATE',
										value: answerOption,
									})
								} else {
									dispatchFields({
										path: `${parentPathField}answerOptions`,
										type: 'ADD_ROW',
										subFieldState: {
											answerOption: {
												value: answerOption,
											},
										},
									})
								}
							})

							const answerOptionsValue =
								(fields[`${parentPathField}answerOptions`]?.value as number) || 0
							const offsetAnsweOptions =
								answerOptionsValue - questionComprehensive.answerOptions.length

							if (offsetAnsweOptions) {
								for (
									let index = answerOptionsValue;
									index > questionComprehensive.answerOptions.length;
									index--
								) {
									dispatchFields({
										path: `${parentPathField}answerOptions`,
										type: 'REMOVE_ROW',
										rowIndex: index - 1,
									})
								}
							}
						}
					}
				}
			}
		})
	}, [
		fields,
		parentPathField,
		ableGenerate,
		titleValue,
		descriptionValue,
		isAnswerOptionsValue,
		dispatchFields,
	])

	return (
		<Button
			{...props}
			buttonStyle={props.buttonStyle || 'secondary'}
			disabled={props.disabled || !ableGenerate}
			onClick={handlerAutoGenerate}
			iconPosition="left"
			icon={isLoading ? <Loader /> : <>✨</>}
		>
			AI Question Generate
		</Button>
	)
}

export const QuestionField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const [isLoading, startTransition] = useTransition()
	const pathField = useMemo(() => path || field.name, [path, field.name])
	const { value, setValue } = useField<string>({ path: pathField })

	const parentPathField = useMemo(() => {
		const partPaths = pathField.split('.')
		const resultPath = partPaths.slice(0, -1).join('.') + '.'
		return resultPath
	}, [pathField])

	const titleValue = useFormFields(([fields]) => {
		return fields?.title?.value as string
	})

	const descriptionValue = useFormFields(([fields]) => {
		if (!fields?.description?.value) {
			return ''
		}

		return convertLexicalToPlaintext({
			// @ts-expect-error
			data: fields.description.value,
		})
	})

	const ableGenerate = useMemo(() => {
		return !!titleValue && !!descriptionValue
	}, [titleValue, descriptionValue])

	const handlerAutoGenerate = useCallback(() => {
		startTransition(async () => {
			if (ableGenerate) {
				if (value) {
					const questionEnhance = await klopAIQuestionEnhance({
						title: titleValue,
						description: descriptionValue,
						question: value,
					})

					if (questionEnhance) {
						setValue(questionEnhance.question)
					}
				} else {
					const questionGenerate = await klopAIQuestionGenerate({
						title: titleValue,
						description: descriptionValue,
					})

					if (questionGenerate) {
						setValue(questionGenerate.question)
					}
				}
			}
		})
	}, [ableGenerate, value, titleValue, descriptionValue, setValue])

	return (
		<>
			<QuestionComprehensiveCTA parentPathField={parentPathField} />
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 4,
				}}
			>
				<FieldLabel {...field} />
				<Button
					buttonStyle="secondary"
					size="small"
					className="cta-autogen"
					disabled={!ableGenerate}
					onClick={handlerAutoGenerate}
					iconPosition="left"
					icon={isLoading ? <Loader /> : <>✨</>}
				>
					{value ? 'AI Enhance' : 'AI Generate'}
				</Button>
			</div>
			<TextareaInput
				{...field}
				{...props}
				label={undefined}
				value={value}
				onChange={setValue}
				readOnly={props.readOnly || isLoading}
				path={path || field.name}
			/>
			<style>{`
                .cta-autogen {
                    margin: 0
                }
            `}</style>
		</>
	)
}

export const AnswerOptionsCTA = ({
	field,
	path,
	...props
}: ComponentProps<typeof Button> & ArrayFieldClientProps) => {
	const [isLoading, startTransition] = useTransition()
	const pathField = useMemo(() => path || field.name, [path, field.name])

	const parentPathField = useMemo(() => {
		const partPaths = pathField.split('.')
		const resultPath = partPaths.slice(0, -1).join('.') + '.'
		return resultPath
	}, [pathField])

	const [fields, dispatchFields] = useAllFormFields()

	const question = useFormFields(([fields]) => {
		if (`${parentPathField}question` in fields) {
			return fields[`${parentPathField}question`]?.value as string
		}

		return ''
	})

	const titleValue = useFormFields(([fields]) => {
		return fields?.title?.value as string
	})

	const descriptionValue = useFormFields(([fields]) => {
		if (!fields?.description?.value) {
			return ''
		}

		return convertLexicalToPlaintext({
			// @ts-expect-error
			data: fields.description.value,
		})
	})

	const ableGenerate = useMemo(() => {
		return !!titleValue && !!descriptionValue
	}, [titleValue, descriptionValue])

	const handlerAutoGenerate = useCallback(() => {
		startTransition(async () => {
			if (ableGenerate) {
				const expectedAnswerOptions = await klopAIExpectedAnswerOptions({
					title: titleValue,
					description: descriptionValue,
					question,
				})

				if (expectedAnswerOptions) {
					dispatchFields({
						path: `${parentPathField}expectedAnswer`,
						type: 'UPDATE',
						value: expectedAnswerOptions.expectedAnswer,
					})

					if (expectedAnswerOptions.answerOptions?.length) {
						expectedAnswerOptions.answerOptions.forEach((answerOption, index) => {
							if (`${parentPathField}answerOptions.${index}.answerOption` in fields) {
								dispatchFields({
									path: `${parentPathField}answerOptions.${index}.answerOption`,
									type: 'UPDATE',
									value: answerOption,
								})
							} else {
								dispatchFields({
									path: `${parentPathField}answerOptions`,
									type: 'ADD_ROW',
									subFieldState: {
										answerOption: {
											value: answerOption,
										},
									},
								})
							}
						})

						const answerOptionsValue =
							(fields[`${parentPathField}answerOptions`]?.value as number) || 0
						const offsetAnsweOptions =
							answerOptionsValue - expectedAnswerOptions.answerOptions.length

						if (offsetAnsweOptions) {
							for (
								let index = answerOptionsValue;
								index > expectedAnswerOptions.answerOptions.length;
								index--
							) {
								dispatchFields({
									path: `${parentPathField}answerOptions`,
									type: 'REMOVE_ROW',
									rowIndex: index - 1,
								})
							}
						}
					}
				}
			}
		})
	}, [
		ableGenerate,
		titleValue,
		descriptionValue,
		question,
		dispatchFields,
		parentPathField,
		fields,
	])

	return (
		<div>
			<Button
				{...props}
				buttonStyle={props.buttonStyle || 'secondary'}
				disabled={props.disabled || !ableGenerate}
				onClick={handlerAutoGenerate}
				iconPosition="left"
				icon={isLoading ? <Loader /> : <>✨</>}
			>
				AI Answer Options Generate
			</Button>
		</div>
	)
}

export const ExpectedAnswerField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const [isLoading, startTransition] = useTransition()
	const pathField = useMemo(() => path || field.name, [path, field.name])
	const { value, setValue } = useField<string>({ path: pathField })

	const parentPathField = useMemo(() => {
		const partPaths = pathField.split('.')
		const resultPath = partPaths.slice(0, -1).join('.') + '.'
		return resultPath
	}, [pathField])

	const titleValue = useFormFields(([fields]) => {
		return fields?.title?.value as string
	})

	const descriptionValue = useFormFields(([fields]) => {
		if (!fields?.description?.value) {
			return ''
		}

		return convertLexicalToPlaintext({
			// @ts-expect-error
			data: fields.description.value,
		})
	})

	const question = useFormFields(([fields]) => {
		if (`${parentPathField}question` in fields) {
			return fields[`${parentPathField}question`]?.value as string
		}

		return ''
	})

	const ableGenerate = useMemo(() => {
		return !!titleValue && !!descriptionValue && !!question
	}, [titleValue, descriptionValue, question])

	const isAnswerOptions = useFormFields(([fields]) => {
		if (`${parentPathField}isAnswerOptions` in fields) {
			return fields[`${parentPathField}isAnswerOptions`]?.value === true
		}

		return false
	})

	const answerOptions = useFormFields(([fields]) => {
		if (`${parentPathField}answerOptions` in fields) {
			const options: string[] = []
			const totalAnswerOptions =
				(fields[`${parentPathField}answerOptions`]?.value as number) || 0

			if (totalAnswerOptions) {
				for (let i = 0; i < totalAnswerOptions; i++) {
					const answerOption = fields[`${parentPathField}answerOptions.${i}.answerOption`]
						?.value as string | undefined

					if (answerOption) {
						options.push(answerOption)
					}
				}
			}

			return options
		}

		return []
	})

	const handlerAutoGenerate = useCallback(async () => {
		startTransition(async () => {
			if (ableGenerate) {
				if (isAnswerOptions) {
					if (answerOptions.length) {
						const expectedAnswerChoices = await klopAIExpectedAnswerChoices({
							title: titleValue,
							description: descriptionValue,
							question: question,
							answerOptions,
						})

						if (expectedAnswerChoices) {
							setValue(expectedAnswerChoices.expectedAnswer)
						}
					}
				} else {
					const expectedAnswerEssay = await klopAIExpectedAnswerEssay({
						title: titleValue,
						description: descriptionValue,
						question: question,
					})

					if (expectedAnswerEssay) {
						setValue(expectedAnswerEssay.expectedAnswer)
					}
				}
			}
		})
	}, [
		ableGenerate,
		isAnswerOptions,
		answerOptions,
		titleValue,
		descriptionValue,
		question,
		setValue,
	])

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 4,
				}}
			>
				<FieldLabel {...field} />
				<Button
					buttonStyle="secondary"
					size="small"
					className="cta-autogen"
					onClick={handlerAutoGenerate}
					iconPosition="left"
					icon={isLoading ? <Loader /> : <>✨</>}
				>
					AI Generate
				</Button>
			</div>
			<TextareaInput
				{...field}
				{...props}
				label={undefined}
				value={value}
				onChange={setValue}
				readOnly={props.readOnly || isLoading}
				path={path || field.name}
			/>
			<style>{`
                .cta-autogen {
                    margin: 0
                }
            `}</style>
		</>
	)
}
