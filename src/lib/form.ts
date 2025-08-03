import type { ZodError } from 'zod';

type BaseActionState<T> = {
	values: T;
};

type Errors = Record<string, { message: string }>;

type ActionStateError<T> = { success: false; errors: Errors } & BaseActionState<T>;

type ActionStateSuccess<T> = { success: true } & BaseActionState<T>;

export type ActionState<T> = ActionStateError<T> | ActionStateSuccess<T>;

export function errors(error: ZodError | null) {
	const list: Errors = {};

	for (const { message, path } of error?.issues || []) {
		list[path.join('.')] = { message };
	}

	return list;
}

export function rootError<T>({ error, values }: { error: string; values: T }): ActionStateError<T> {
	return { success: false, errors: { root: { message: error } }, values };
}
