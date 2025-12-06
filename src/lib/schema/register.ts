import * as z from 'zod'

import { candidateGender, vacancyEducation } from '$payload-libs/enum'

const PayloadRegisterSchema = z
	.object({
		name: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
		email: z.email('Harus berupa alamat email yang valid').nonempty('Tidak boleh kosong'),
		password: z
			.string('Isi kolom ini')
			.nonempty('Tidak boleh kosong')
			.min(6, 'Kata sandi harus terdiri dari minimal 6 karakter.'),
		confirmPassword: z
			.string('Isi kolom ini')
			.nonempty('Tidak boleh kosong')
			.min(6, 'Kata sandi harus terdiri dari minimal 6 karakter.'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Kata sandi tidak cocok',
		path: ['confirmPassword'],
	})

const PayloadRegisterCandidateSchema = z
	.object({
		...PayloadRegisterSchema.shape,
		phone: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
		biography: z.string('Isi kolom ini').nonempty('Tidak boleh kosong'),
		gender: z.enum(
			candidateGender.map((item) => item.value),
			'Pilih jenis kelamin',
		),
		education: z.enum(
			vacancyEducation.map((item) => item.value),
			'Pilih pendidikan',
		),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Kata sandi tidak cocok',
		path: ['confirmPassword'],
	})

type PayloadRegister = z.infer<typeof PayloadRegisterSchema>
type PayloadRegisterCandidate = z.infer<typeof PayloadRegisterCandidateSchema>

export { PayloadRegisterCandidateSchema, PayloadRegisterSchema }

export type { PayloadRegister, PayloadRegisterCandidate }
