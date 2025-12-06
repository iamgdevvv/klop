import type { CollectionConfig } from 'payload'

import { authenticatedAdmin, authenticatedAdminOrAuthor } from '$payload-libs/access-rules'
import { candidateGender, vacancyEducation } from '$payload-libs/enum'

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		hideAPIURL: true,
		useAsTitle: 'email',
		hidden: ({ user }) => {
			return user?.role !== 'admin'
		},
	},
	auth: true,
	access: {
		create: authenticatedAdmin,
		read: authenticatedAdminOrAuthor,
		update: authenticatedAdminOrAuthor,
		delete: authenticatedAdmin,
	},
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
					admin: {
						width: '50%',
					},
				},
				{
					name: 'role',
					type: 'select',
					defaultValue: 'candidate',
					required: true,
					options: [
						{
							label: 'Admin',
							value: 'admin',
						},
						{
							label: 'Company',
							value: 'company',
						},
						{
							label: 'Candidate',
							value: 'candidate',
						},
					],
					admin: {
						width: '50%',
						condition: (data, _, { user }) => {
							return (
								!data?.createdAt || data.role === 'admin' || user?.role === 'admin'
							)
						},
					},
				},
			],
		},
		{
			type: 'row',
			admin: {
				condition: (data, _, { user }) => {
					return data.role === 'candidate' || user?.role === 'candidate'
				},
			},
			fields: [
				{
					name: 'avatar',
					type: 'upload',
					relationTo: 'asset',
					admin: {
						width: '100%',
					},
					filterOptions({ user }) {
						if (user) {
							if (user.role === 'admin') {
								return true
							}

							return {
								author: {
									equals: user.id,
								},
							}
						}

						return false
					},
				},
				{
					name: 'phone',
					type: 'text',
					unique: true,
					admin: {
						width: '33.333%',
					},
				},
				{
					name: 'gender',
					type: 'select',
					enumName: 'usrgnd',
					options: candidateGender,
					admin: {
						width: '33.333%',
					},
				},
				{
					type: 'select',
					name: 'education',
					enumName: 'usredu',
					options: vacancyEducation,
					admin: {
						width: '33.333%',
					},
				},
				{
					name: 'biography',
					type: 'textarea',
					admin: {
						width: '100%',
					},
				},
				{
					type: 'upload',
					name: 'resume',
					relationTo: 'asset',
					admin: {
						width: '100%',
					},
					filterOptions({ user }) {
						if (user) {
							if (user.role === 'admin') {
								return true
							}

							return {
								author: {
									equals: user.id,
								},
							}
						}

						return false
					},
				},
				{
					type: 'upload',
					name: 'documents',
					relationTo: 'asset',
					hasMany: true,
					admin: {
						width: '100%',
					},
					filterOptions({ user }) {
						if (user) {
							if (user.role === 'admin') {
								return true
							}

							return {
								author: {
									equals: user.id,
								},
							}
						}

						return false
					},
				},
			],
		},
		{
			type: 'group',
			name: 'socials',
			admin: {
				condition: (data, _, { user }) => {
					return data.role === 'candidate' || user?.role === 'candidate'
				},
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							type: 'text',
							name: 'website',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'facebook',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'instagram',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'linkedin',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'twitter',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'youtube',
							admin: {
								width: '33.3333%',
							},
						},
						{
							type: 'text',
							name: 'tiktok',
							admin: {
								width: '33.3333%',
							},
						},
					],
				},
			],
		},
	],
}
