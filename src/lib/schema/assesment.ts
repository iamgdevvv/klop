import * as z from 'zod'

import { candidateGender } from '$payload-libs/enum'

const PayloadCandidateAssessmentSchema = z.object({
	name: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
	email: z.email('Harus berupa alamat email yang valid').nonempty('Tidak boleh kosong'),
	phone: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
	gender: z.enum(
		candidateGender.map((item) => item.value),
		'Pilih jenis kelamin',
	),
})

const PayloadExamAssessmentSchema = z.object({
	question: z.string(),
	answer: z.string(),
})

type PayloadCandidateAssessment = z.infer<typeof PayloadCandidateAssessmentSchema>
type PayloadExamAssessment = z.infer<typeof PayloadExamAssessmentSchema>

export { PayloadCandidateAssessmentSchema, PayloadExamAssessmentSchema }

export type { PayloadCandidateAssessment, PayloadExamAssessment }
