import { type Result, Ok, Err } from "./result";

function wrapper<T, E = any>(
    callback: () => T | Promise<T>,
): Result<T, E> | Promise<Result<T, E>> {
    try {
        const result = callback();

        if (result instanceof Promise)
            return result
                .then((value) => Ok<T>(value))
                .catch((error) => Err<E>(error as E));

        return Ok<T>(result);
    } catch (error) {
        return Err<E>(error as E);
    }
}

type WrapExceptionResult<T, E = any> = T extends Promise<infer U>
    ? Promise<Result<U, E>>
    : Result<T, E>;

/**
 * Executes a function and captures any exceptions that are thrown.
 *
 * Returns a `Result` with the function's return value or the thrown error.
 */
export default function wrapException<T, E = any>(
    callback: () => T,
): WrapExceptionResult<T, E> {
    return wrapper(callback) as WrapExceptionResult<T, E>;
}
