'use server'

import {
	AssessmentScoringSchema,
	ExpectedAnswerChoicesSchema,
	ExpectedAnswerEssaySchema,
	ExpectedAnswerOptionsSchema,
	QuestionComprehensiveSchema,
	QuestionEnhanceSchema,
	QuestionGenerateSchema,
	type AssessmentScoring,
	type ExpectedAnswerChoices,
	type ExpectedAnswerEssay,
	type ExpectedAnswerOptions,
	type PayloadAssessmentScoring,
	type PayloadExpectedAnswerChoices,
	type PayloadExpectedAnswerEssay,
	type PayloadExpectedAnswerOptions,
	type PayloadQuestionComprehensive,
	type PayloadQuestionEnhance,
	type PayloadQuestionGenerate,
	type QuestionComprehensive,
	type QuestionEnhance,
	type QuestionGenerate,
} from '$schema/klop-ai'

type RequestBackend = RequestInit & {
	token?: string
}

const klopAIQuery = async <T = undefined>(
	endpoint: string,
	options?: RequestBackend,
): Promise<T> => {
	const headers = new Headers(options?.headers ?? {})

	headers.set('Authorization', `Bearer ${process.env.KLOP_AI_TOKEN}`)

	if (!options?.headers && options?.body && options?.body instanceof FormData === false) {
		headers.set('Content-Type', 'application/json')
	}

	const response = await fetch(process.env.KLOP_AI_API + endpoint, {
		...options,
		headers,
		cache: 'no-cache',
	})

	return await response.json()
}

const klopAIMutation = async <B, T = undefined>(
	endpoint: string,
	options: Omit<RequestBackend, 'body'> & {
		body: B
	},
) => {
	return await klopAIQuery<T>(endpoint, {
		...options,
		method: options?.method ?? 'POST',
		body: options?.body instanceof FormData ? options.body : JSON.stringify(options?.body),
	})
}

const klopAIQuestionGenerate = async (
	payload: PayloadQuestionGenerate,
): Promise<QuestionGenerate | null> => {
	try {
		const response = await klopAIMutation('/api/v1/question/generate', {
			body: payload,
		})

		return QuestionGenerateSchema.parse(response)
	} catch (error) {
		console.log('klopAIQuestionGenerate', error)
		return null
	}
}

const klopAIQuestionEnhance = async (
	payload: PayloadQuestionEnhance,
): Promise<QuestionEnhance | null> => {
	try {
		const response = await klopAIMutation('/api/v1/question/enhance', {
			body: payload,
		})

		return QuestionEnhanceSchema.parse(response)
	} catch (error) {
		console.log('klopAIQuestionEnhance', error)
		return null
	}
}

const klopAIQuestionComprehensive = async (
	payload: PayloadQuestionComprehensive,
): Promise<QuestionComprehensive | null> => {
	try {
		const response = await klopAIMutation('/api/v1/question/comprehensive', {
			body: payload,
		})

		return QuestionComprehensiveSchema.parse(response)
	} catch (error) {
		console.log('klopAIQuestionComprehensive', error)
		return null
	}
}

const klopAIExpectedAnswerEssay = async (
	payload: PayloadExpectedAnswerEssay,
): Promise<ExpectedAnswerEssay | null> => {
	try {
		const response = await klopAIMutation('/api/v1/answer/expected/essay', {
			body: payload,
		})

		return ExpectedAnswerEssaySchema.parse(response)
	} catch (error) {
		console.log('klopAIExpectedAnswerEssay', error)
		return null
	}
}

const klopAIExpectedAnswerChoices = async (
	payload: PayloadExpectedAnswerChoices,
): Promise<ExpectedAnswerChoices | null> => {
	try {
		const response = await klopAIMutation('/api/v1/answer/expected/choices', {
			body: payload,
		})

		return ExpectedAnswerChoicesSchema.parse(response)
	} catch (error) {
		console.log('klopAIExpectedAnswerChoices', error)
		return null
	}
}

const klopAIExpectedAnswerOptions = async (
	payload: PayloadExpectedAnswerOptions,
): Promise<ExpectedAnswerOptions | null> => {
	try {
		const response = await klopAIMutation('/api/v1/answer/options', {
			body: payload,
		})

		return ExpectedAnswerOptionsSchema.parse(response)
	} catch (error) {
		console.log('klopAIExpectedAnswerOptions', error)
		return null
	}
}

const klopAIAssessmentScoring = async (
	payload: PayloadAssessmentScoring,
): Promise<AssessmentScoring | null> => {
	try {
		const response = await klopAIMutation('/api/v1/assessment/scoring', {
			body: payload,
		})

		return AssessmentScoringSchema.parse(response)
	} catch (error) {
		console.log('klopAIExpectedAnswerOptions', error)
		return null
	}
}

export {
	klopAIAssessmentScoring,
	klopAIExpectedAnswerChoices,
	klopAIExpectedAnswerEssay,
	klopAIExpectedAnswerOptions,
	klopAIQuestionComprehensive,
	klopAIQuestionEnhance,
	klopAIQuestionGenerate,
}
