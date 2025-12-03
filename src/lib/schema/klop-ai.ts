import * as z from 'zod'

const PayloadQuestionGenerateSchema = z.object({
	title: z.string(),
	description: z.string(),
})

const PayloadQuestionEnhanceSchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	question: z.string(),
})

const PayloadQuestionComprehensiveSchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	isAnswerOptions: z.boolean(),
})

const PayloadExpectedAnswerEssaySchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	question: z.string(),
})

const PayloadExpectedAnswerChoicesSchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	question: z.string(),
	answerOptions: z.string().array(),
})

const PayloadExpectedAnswerOptionsSchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	question: z.string(),
})

const PayloadAssessmentScoringSchema = z.object({
	...PayloadQuestionGenerateSchema.shape,
	question: z
		.object({
			question: z.string(),
			answer: z.string(),
			expectedAnswer: z.string(),
		})
		.array(),
})

const QuestionGenerateSchema = z.object({
	question: z.string(),
})

const QuestionEnhanceSchema = QuestionGenerateSchema

const QuestionComprehensiveSchema = z.object({
	question: z.string(),
	isAnswerOptions: z.boolean().optional(),
	answerOptions: z.string().array().optional(),
	expectedAnswer: z.string(),
})

const ExpectedAnswerEssaySchema = z.object({
	expectedAnswer: z.string(),
})

const ExpectedAnswerChoicesSchema = z.object({
	expectedAnswer: z.string(),
})

const ExpectedAnswerOptionsSchema = z.object({
	answerOptions: z.string().array(),
	expectedAnswer: z.string(),
})

const AssessmentScoringSchema = z.object({
	summary: z.string(),
	questions: z.object({
		question: z.string(),
		answer: z.string(),
		isAnswerCorrect: z.boolean(),
	}),
})

type PayloadQuestionGenerate = z.infer<typeof PayloadQuestionGenerateSchema>
type PayloadQuestionEnhance = z.infer<typeof PayloadQuestionEnhanceSchema>
type PayloadQuestionComprehensive = z.infer<typeof PayloadQuestionComprehensiveSchema>
type PayloadExpectedAnswerEssay = z.infer<typeof PayloadExpectedAnswerEssaySchema>
type PayloadExpectedAnswerChoices = z.infer<typeof PayloadExpectedAnswerChoicesSchema>
type PayloadExpectedAnswerOptions = z.infer<typeof PayloadExpectedAnswerOptionsSchema>
type PayloadAssessmentScoring = z.infer<typeof PayloadAssessmentScoringSchema>
type QuestionGenerate = z.infer<typeof QuestionGenerateSchema>
type QuestionEnhance = z.infer<typeof QuestionEnhanceSchema>
type QuestionComprehensive = z.infer<typeof QuestionComprehensiveSchema>
type ExpectedAnswerEssay = z.infer<typeof ExpectedAnswerEssaySchema>
type ExpectedAnswerChoices = z.infer<typeof ExpectedAnswerChoicesSchema>
type ExpectedAnswerOptions = z.infer<typeof ExpectedAnswerOptionsSchema>
type AssessmentScoring = z.infer<typeof AssessmentScoringSchema>

export {
	AssessmentScoringSchema,
	ExpectedAnswerChoicesSchema,
	ExpectedAnswerEssaySchema,
	ExpectedAnswerOptionsSchema,
	PayloadAssessmentScoringSchema,
	PayloadExpectedAnswerChoicesSchema,
	PayloadExpectedAnswerEssaySchema,
	PayloadExpectedAnswerOptionsSchema,
	PayloadQuestionComprehensiveSchema,
	PayloadQuestionEnhanceSchema,
	PayloadQuestionGenerateSchema,
	QuestionComprehensiveSchema,
	QuestionEnhanceSchema,
	QuestionGenerateSchema,
}
export type {
	AssessmentScoring,
	ExpectedAnswerChoices,
	ExpectedAnswerEssay,
	ExpectedAnswerOptions,
	PayloadAssessmentScoring,
	PayloadExpectedAnswerChoices,
	PayloadExpectedAnswerEssay,
	PayloadExpectedAnswerOptions,
	PayloadQuestionComprehensive,
	PayloadQuestionEnhance,
	PayloadQuestionGenerate,
	QuestionComprehensive,
	QuestionEnhance,
	QuestionGenerate,
}
