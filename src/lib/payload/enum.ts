export const vacancyType: {
	label: string
	value: 'fullTime' | 'partTime' | 'contract' | 'internship'
}[] = [
	{
		label: 'Penuh Waktu',
		value: 'fullTime',
	},
	{
		label: 'Paruh Waktu',
		value: 'partTime',
	},
	{
		label: 'Kontrak',
		value: 'contract',
	},
	{
		label: 'Magang',
		value: 'internship',
	},
]

export const vacancyLevel: { label: string; value: 'senior' | 'medior' | 'junior' }[] = [
	{
		label: 'Senior',
		value: 'senior',
	},
	{
		label: 'Medior',
		value: 'medior',
	},
	{
		label: 'Junior',
		value: 'junior',
	},
]

export const vacancyEducation: {
	label: string
	value: 'bachelor' | 'master' | 'diploma' | 'highSchool' | 'middleSchool' | 'elementarySchool'
}[] = [
	{
		label: 'Sarjana',
		value: 'bachelor',
	},
	{
		label: 'Magister',
		value: 'master',
	},
	{
		label: 'Diploma',
		value: 'diploma',
	},
	{
		label: 'Sekolah Menengah Atas',
		value: 'highSchool',
	},
	{
		label: 'Sekolah Menengah Pertama',
		value: 'middleSchool',
	},
	{
		label: 'Sekolah Dasar',
		value: 'elementarySchool',
	},
]

export const candidateGender: { label: string; value: 'male' | 'female' }[] = [
	{
		label: 'Laki-laki',
		value: 'male',
	},
	{
		label: 'Perempuan',
		value: 'female',
	},
]
