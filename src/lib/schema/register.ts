import * as z from 'zod'

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

type PayloadRegister = z.infer<typeof PayloadRegisterSchema>

export { PayloadRegisterSchema }

export type { PayloadRegister }
