'use client'
import { createTheme, Text } from '@mantine/core'

const theme = createTheme({
	breakpoints: {
		xs: '375px',
		sm: '600px',
		md: '901px',
		lg: '1200px',
		xl: '1600px',
	},
	fontFamily: 'var(--font-sans)',
	headings: {
		fontFamily: 'var(--font-title)',
		fontWeight: '700',
		sizes: {
			h1: {
				fontSize: 'var(--title-h1)',
				lineHeight: '1.1',
			},
			h2: {
				fontSize: 'var(--title-h2)',
				lineHeight: '1.2',
			},
			h3: {
				fontSize: 'var(--title-h3)',
				lineHeight: '1.2',
			},
			h4: {
				fontSize: 'var(--title-h4)',
				lineHeight: '1.2',
			},
			h5: {
				fontSize: 'var(--title-h5)',
				lineHeight: '1.3',
			},
			h6: {
				fontSize: 'var(--title-h6)',
				lineHeight: '1.3',
			},
		},
	},
	defaultRadius: 'md',
	radius: {
		xs: '2px',
		sm: '4px',
		md: '8px',
		lg: '16px',
		xl: '24px',
		'2xl': '32px',
		'3xl': '56px',
		'4xl': '64px',
		full: '99999px',
	},
	primaryColor: 'primary',
	black: '#000',
	colors: {
		primary: [
			'#f2f4f7',
			'#e4e5e8',
			'#c5c9d1',
			'#a4abbb',
			'#8892a8',
			'#76829d',
			'#6c7a99',
			'#5b6886',
			'#13171f',
			'#000',
		],
		secondary: [
			'#e1f8ff',
			'#cbedff',
			'#9ad7ff',
			'#64c1ff',
			'#3aaefe',
			'#20a2fe',
			'#099cff',
			'#0088e4',
			'#0079cd',
			'#0068b6',
		],
	},
	components: {
		Text: Text.extend({
			defaultProps: {
				lh: 'xl',
			},
		}),
	},
})

export default theme
