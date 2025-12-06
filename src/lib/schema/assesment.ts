import * as z from 'zod'
import { PayloadRegisterCandidateSchema } from './register'

const PayloadCandidateAssessmentSchema = z
	.object({
		...PayloadRegisterCandidateSchema.pick({
			name: true,
			email: true,
			phone: true,
		}).shape,
		password: z
			.string('Isi kolom ini')
			.nonempty('Tidak boleh kosong')
			.min(6, 'Kata sandi harus terdiri dari minimal 6 karakter.'),
		confirmPassword: z
			.string('Isi kolom ini')
			.nonempty('Tidak boleh kosong')
			.min(6, 'Kata sandi harus terdiri dari minimal 6 karakter.'),
		agreeToc: z.literal(true, 'Wajib dicentang'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Kata sandi tidak cocok',
		path: ['confirmPassword'],
	})

const PayloadExamAssessmentSchema = z.object({
	question: z.string(),
	answer: z.string(),
})

type PayloadCandidateAssessment = z.infer<typeof PayloadCandidateAssessmentSchema>
type PayloadExamAssessment = z.infer<typeof PayloadExamAssessmentSchema>

export { PayloadCandidateAssessmentSchema, PayloadExamAssessmentSchema }

export type { PayloadCandidateAssessment, PayloadExamAssessment }
