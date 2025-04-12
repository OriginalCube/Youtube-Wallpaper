export const formatSeconds = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)

	const formattedMinutes = String(minutes).padStart(2, '0')

	const formattedSeconds = String(remainingSeconds).padStart(2, '0')

	return `${formattedMinutes}:${formattedSeconds}`
}

export const removeString = (str: string): string => {
	return str.replace(/\s+/g, '')
}

export const getQueryParamValue = (url: string, param: string): string | null => {
	const urlObj = new URL(url)
	return urlObj.searchParams.get(param)
}
