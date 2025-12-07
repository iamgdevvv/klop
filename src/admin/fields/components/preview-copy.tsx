'use client'
import { Button, useFormFields } from '@payloadcms/ui'
import { Copy, CopyCheck, Loader } from 'lucide-react'

import { slugAssessment, slugShortVacancy } from '$modules/vars'

export const PreviewAssessmentCopy = () => {
	const { copy, isCopied, isCopying } = useCopy()

	const slugValue = useFormFields(([fields]) => {
		return fields?.slug?.value as string
	})

	if (!slugValue) {
		return null
	}

	return (
		<Button
			buttonStyle="subtle"
			onClick={() =>
				copy(`${process.env.NEXT_PUBLIC_SITE_URL}/${slugAssessment}/${slugValue}`)
			}
		>
			{isCopying ? <Loader /> : isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
		</Button>
	)
}

export const PreviewVacancyCopy = () => {
	const { copy, isCopied, isCopying } = useCopy()

	const companyId = useFormFields(([fields]) => {
		return fields?.company?.value
	})

	const slugValue = useFormFields(([fields]) => {
		return fields?.slug?.value as string
	})

	if (!slugValue || !companyId) {
		return null
	}

	return (
		<Button
			buttonStyle="subtle"
			onClick={() =>
				copy(
					`${process.env.NEXT_PUBLIC_SITE_URL}/${slugShortVacancy}/${companyId}/${slugValue}`,
				)
			}
		>
			{isCopying ? <Loader /> : isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
		</Button>
	)
}

export const PreviewCompanyCopy = () => {
	const { copy, isCopied, isCopying } = useCopy()

	const slugValue = useFormFields(([fields]) => {
		return fields?.slug?.value as string
	})

	if (!slugValue) {
		return null
	}

	return (
		<Button
			buttonStyle="secondary"
			onClick={() => copy(`${process.env.NEXT_PUBLIC_SITE_URL}/${slugValue}`)}
		>
			{isCopying ? <Loader /> : isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
		</Button>
	)
}

import { useCallback, useEffect, useRef, useState } from 'react'

type UseCopyOptions = {
	resetAfterMs?: number
}

export function useCopy(options: UseCopyOptions = {}) {
	const { resetAfterMs = 2000 } = options
	const [isCopied, setIsCopied] = useState(false)
	const [isCopying, setIsCopying] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const resetTimer = useRef<number | null>(null)

	useEffect(() => {
		return () => {
			if (resetTimer.current) {
				window.clearTimeout(resetTimer.current)
			}
		}
	}, [])

	const clearResetTimer = useCallback(() => {
		if (resetTimer.current) {
			window.clearTimeout(resetTimer.current)
			resetTimer.current = null
		}
	}, [])

	const scheduleReset = useCallback(() => {
		clearResetTimer()
		if (resetAfterMs > 0) {
			// window.setTimeout returns number in browser
			resetTimer.current = window.setTimeout(() => {
				setIsCopied(false)
				setIsCopying(false)
				setError(null)
				resetTimer.current = null
			}, resetAfterMs)
		}
	}, [clearResetTimer, resetAfterMs])

	const copy = useCallback(
		async (text: string) => {
			setIsCopying(true)
			setError(null)

			try {
				if (!text) throw new Error('No text provided to copy.')

				// Try Clipboard API first
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(text)
				} else {
					// Fallback: create a hidden textarea and execCommand
					const ta = document.createElement('textarea')
					ta.value = text
					// Keep it off-screen and avoid scrolling
					ta.setAttribute('readonly', '')
					ta.style.position = 'absolute'
					ta.style.left = '-9999px'
					document.body.appendChild(ta)
					const selection = document.getSelection()
					const previousRange =
						selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

					ta.select()
					ta.setSelectionRange(0, ta.value.length)

					const successful = document.execCommand('copy')
					document.body.removeChild(ta)

					// restore previous selection
					if (previousRange && selection) {
						selection.removeAllRanges()
						selection.addRange(previousRange)
					}

					if (!successful) throw new Error('Copy command was unsuccessful.')
				}

				setIsCopied(true)
				setIsCopying(false)
				scheduleReset()
				return true
			} catch {
				setError('Failed to copy.')
				setIsCopying(false)
				setIsCopied(false)
				scheduleReset()
				return false
			}
		},
		[scheduleReset],
	)

	const reset = useCallback(() => {
		clearResetTimer()
		setIsCopying(false)
		setIsCopied(false)
		setError(null)
	}, [clearResetTimer])

	return {
		copy,
		isCopied,
		isCopying,
		error,
		reset,
	} as const
}
