import { Option, Some, None } from "./option";

/**
 * Represents a value that can be either a success or a failure.
 */
export interface Result<T, E = Error> {
    /**
     * Returns the contained `Ok` value.
     */
    unwrap(): T;
    /**
     * Returns the contained `Ok` value or a default.
     */
    unwrapOr(defaultValue: T): T;
    /**
     * Returns the contained `Err` value.
     */
    unwrapErr(): E;
    /**
     * Returns `true` if the result is `Ok`.
     */
    isOk(): this is OkResult<T>;
    /**
     * Returns `true` if the result is `Err`.
     */
    isErr(): this is ErrResult<E>;
    /**
     * Converts from `Result<T, E>` to `Option<T>`.
     */
    ok(): Option<T>;
    /**
     * Converts from `Result<T, E>` to `Option<E>`.
     */
    err(): Option<E>;
}

type OkResult<T> = Result<T, never>;
type ErrResult<E = Error> = Result<never, E>;

class ResultImpl<T, E = Error> implements Result<T, E> {
    private constructor(private value: T | E, private isError: boolean) {}

    public unwrap(): T {
        if (this.isOk()) return this.value as T;

        throw new Error(
            `called \`unwrap()\` on an \`Err\` value: ${this.value}`,
        );
    }

    public unwrapOr(defaultValue: T): T {
        return this.isOk() ? (this.value as T) : defaultValue;
    }

    public unwrapErr(): E {
        if (this.isErr()) return this.value as E;

        throw new Error(
            `called \`unwrapErr()\` on an \`Ok\` value: ${this.value}`,
        );
    }

    public isOk(): this is OkResult<T> {
        return !this.isError;
    }

    public isErr(): this is ErrResult<E> {
        return this.isError;
    }

    public ok(): Option<T> {
        return this.isOk() ? Some(this.value as T) : None;
    }

    public err(): Option<E> {
        return this.isErr() ? Some(this.value as E) : None;
    }

    /**
     * Creates a new `Ok` result.
     */
    public static ok<T>(value: T): OkResult<T> {
        return new ResultImpl<T, never>(value, false);
    }

    /**
     * Creates a new `Err` result.
     */
    public static err<E = Error>(error: E): ErrResult<E> {
        return new ResultImpl<never, E>(error, true);
    }
}

/**
 * Creates a new `Ok` result.
 */
export const Ok = ResultImpl.ok;
/**
 * Creates a new `Err` result.
 */
export const Err = ResultImpl.err;
