import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'

import { richTextEditor } from '$payload-libs/richtext'

import { Assessments } from '$payload-collections/Assessment'
import { AssessmentSubmissions } from '$payload-collections/AssessmentSubmission'
import { Asset } from '$payload-collections/Asset'
import { Companies } from '$payload-collections/Company'
import { Users } from '$payload-collections/Users'
import { Vacancies } from '$payload-collections/Vacancy'

import { slugDashboard } from '$modules/vars'
import { VacancySubmissions } from '$payload-collections/VacancySubmission'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	indexSortableFields: false,
	telemetry: false,
	routes: {
		admin: `/${slugDashboard}`,
	},
	admin: {
		theme: 'light',
		user: Users.slug,
		importMap: {
			baseDir: '@',
		},
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 768,
				},
			],
		},
		meta: {
			titleSuffix: ' | Klop! Dashboard',
			icons: '/favicon.jpg',
		},
		components: {
			graphics: {
				Icon: '$payload-fields/components/branding#Icon',
				Logo: '$payload-fields/components/branding#Logo',
			},
		},
	},
	debug: process.env.NODE_ENV === 'development',
	defaultDepth: 5,
	collections: [
		Asset,
		Users,
		Companies,
		Vacancies,
		Assessments,
		AssessmentSubmissions,
		VacancySubmissions,
	],
	cors: [process.env.NEXT_PUBLIC_SITE_URL],
	editor: richTextEditor(),
	secret: process.env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	graphQL: {
		disable: true,
	},
	db: postgresAdapter({
		blocksAsJSON: true,
		pool: {
			connectionString: process.env.DATABASE_URI,
			ssl: {
				rejectUnauthorized: false,
			},
		},
	}),
	sharp,
	email: nodemailerAdapter({
		defaultFromAddress: 'example@klop.ai',
		defaultFromName: 'Example Klop',
		transportOptions: {
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		},
	}),
	plugins: [
		seoPlugin({
			collections: ['companies', 'vacancies'],
			uploadsCollection: 'asset',
			tabbedUI: true,
		}),
		s3Storage({
			collections: {
				asset: {
					prefix: 'asset',
				},
			},
			bucket: process.env.SUPABASE_S3_BUCKET,
			config: {
				forcePathStyle: true,
				credentials: {
					accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
					secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
				},
				region: process.env.SUPABASE_S3_REGION,
				endpoint: process.env.SUPABASE_S3_ENDPOINT,
			},
		}),
	],
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				if (req.user) return true

				const authHeader = req.headers.get('authorization')
				return authHeader === `Bearer ${process.env.CRON_SECRET}`
			},
		},
		tasks: [],
	},
})
