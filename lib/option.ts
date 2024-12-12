/**
 * Represents an optional value.
 */
export interface Option<T> {
    /**
     * Returns the contained `Some` value.
     */
    unwrap(): T;
    /**
     * Returns the contained `Some` value or a default.
     */
    unwrapOr(defaultValue: T): T;
    /**
     * Returns `true` if the option is a `Some` value.
     */
    isSome(): this is SomeOption<T>;
    /**
     * Returns `true` if the option is a `None` value.
     */
    isNone(): this is NoneOption;
}

type SomeOption<T> = Option<T>;
type NoneOption = Option<never>;

class OptionImpl<T> implements Option<T> {
    private constructor(private value?: T) {}

    public unwrap(): T {
        if (this.isSome()) return this.value as T;

        throw new Error(`called \`unwrap()\` on a \`None\` value`);
    }

    public unwrapOr(defaultValue: T): T {
        return this.isSome() ? (this.value as T) : defaultValue;
    }

    public isSome(): this is SomeOption<T> {
        return this.value !== undefined;
    }

    public isNone(): this is NoneOption {
        return this.value === undefined;
    }

    /**
     * Creates a new `Some` option.
     */
    public static some<T>(value: T): SomeOption<T> {
        return new OptionImpl(value);
    }

    /**
     * Creates a new `None` option.
     */
    public static none(): NoneOption {
        return new OptionImpl();
    }
}

/**
 * Creates a new `Some` option.
 */
export const Some = OptionImpl.some;
/**
 * Creates a new `None` option.
 */
export const None = OptionImpl.none();
