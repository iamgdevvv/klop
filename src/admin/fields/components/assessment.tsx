'use client'
import { Button, FieldLabel, TextareaInput, useField, useFormFields } from '@payloadcms/ui'
import { Loader } from 'lucide-react'
import type { TextFieldClientProps } from 'payload'
import { useCallback, useMemo, useTransition } from 'react'

export const QuestionField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const [isLoading, startTransition] = useTransition()
	const { value, setValue } = useField<string>({ path: path || field.name })

	const handlerAutoGenerate = useCallback(() => {
		startTransition(async () => {
			setValue('ai-' + value)
		})
	}, [value, setValue])

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
				>
					{isLoading ? (
						<Loader
							size={18}
							className="animate-spin"
						/>
					) : value ? (
						'✨ AI Enhance'
					) : (
						'✨ AI Generate'
					)}
				</Button>
			</div>
			<TextareaInput
				{...field}
				{...props}
				label={undefined}
				value={value}
				onChange={setValue}
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

export const ExpectedAnswerField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const [isLoading, startTransition] = useTransition()
	const pathField = useMemo(() => path || field.name, [path, field.name])
	const { value, setValue } = useField<string>({ path: pathField })

	const parentPathField = useMemo(() => {
		const partPaths = pathField.split('.')
		const resultPath = partPaths.slice(0, -1).join('.') + '.'
		return resultPath
	}, [pathField])

	const question = useFormFields(([fields]) => {
		if (`${parentPathField}question` in fields) {
			return fields[`${parentPathField}question`].value as string
		}

		return null
	})

	const isAnswerOptions = useFormFields(([fields]) => {
		if (`${parentPathField}isAnswerOptions` in fields) {
			return fields[`${parentPathField}isAnswerOptions`].value as boolean
		}

		return false
	})

	const answerOptions = useFormFields(([fields]) => {
		if (`${parentPathField}answerOptions` in fields) {
			const totalAnswerOptions = fields[`${parentPathField}answerOptions`].value as number

			const options: string[] = []

			for (let i = 0; i < totalAnswerOptions; i++) {
				options.push(
					fields[`${parentPathField}answerOptions.${i}.answerOption`].value as string,
				)
			}

			return options
		}

		return []
	})

	const handlerAutoGenerate = useCallback(() => {
		console.log({ answerOptions })
		startTransition(async () => {
			if (question) {
				if (isAnswerOptions) {
					if (answerOptions.length) {
						setValue('ai-' + answerOptions[0])
					}
				} else {
					setValue('ai-' + value)
				}
			}
		})
	}, [answerOptions, question, isAnswerOptions, setValue, value])

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
				>
					{isLoading ? (
						<Loader
							size={18}
							className="animate-spin"
						/>
					) : value ? (
						'✨ AI Enhance'
					) : (
						'✨ AI Generate'
					)}
				</Button>
			</div>
			<TextareaInput
				{...field}
				{...props}
				label={undefined}
				value={value}
				onChange={setValue}
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
