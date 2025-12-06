import * as z from 'zod'

import { PayloadRegisterCandidateSchema } from '$schema/register'

const PayloadApplyVacancySchema = z.object({
	biography: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
	resume: z.file().optional(),
	documents: z.file().array().optional(),
})

const PayloadApplyVacancyRegisterSchema = z
	.object({
		...PayloadRegisterCandidateSchema.shape,
		resume: z.file(),
		documents: z.file().array().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Kata sandi tidak cocok',
		path: ['confirmPassword'],
	})

type PayloadApplyVacancy = z.infer<typeof PayloadApplyVacancySchema>
type PayloadApplyVacancyRegister = z.infer<typeof PayloadApplyVacancyRegisterSchema>

export { PayloadApplyVacancyRegisterSchema, PayloadApplyVacancySchema }
export type { PayloadApplyVacancy, PayloadApplyVacancyRegister }
