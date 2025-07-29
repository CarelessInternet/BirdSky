import { ServerValidateError } from '@tanstack/react-form/nextjs';

export function showServerErrorInForm(error: string) {
	return new ServerValidateError({
		// @ts-expect-error: onServer is not typed correctly.
		formState: { errorMap: { onServer: { form: { content: [{ message: error }] } } } },
	}).formState;
}

// What an abomination but it works. Great API design @tanstack/react-form. No helper functions included?
export function flattenFormErrors(errors: unknown): string[] {
	if (!errors || typeof errors !== 'object') return [];
	const result: string[] = [];
	for (const key in errors as Record<string, unknown>) {
		const fieldErrors = (errors as Record<string, unknown>)[key];
		if (Array.isArray(fieldErrors)) {
			for (const err of fieldErrors) {
				if (typeof err === 'string') result.push(err);
				else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string')
					result.push(err.message);
				else if (err) result.push(String(err));
			}
		} else if (fieldErrors && typeof fieldErrors === 'object') {
			result.push(...flattenFormErrors(fieldErrors));
		}
	}
	return result;
}
