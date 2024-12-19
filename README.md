# PoC TypeScript Option and Result type

This project implements basic versions of the `Option` and `Result` type, inspired by their counterparts in the Rust programming language, to demonstrate their benefits in TypeScript.

## Motivation

In Rust, the [`Option`](https://doc.rust-lang.org/stable/core/option/index.html) type is used to represent the presence or absence of a value. The [`Result`](https://doc.rust-lang.org/stable/core/result/index.html) type, on the other hand, is designed for error handling, avoiding exceptions by encouraging explicit handling of both success and failure.

While TypeScript supports [truthiness narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing) to determine if a value is null or undefined, making the `Option` type less crucial, the `Result` type is particularly valuable. It allows developers to represent errors directly in the return type, promoting safer and more predictable error handling by leveraging TypeScript's type system to enforce explicit handling of both success and failure cases, rather than depending on unchecked exceptions.

## Overview

-   [Option](#optiont)
-   [Result](#resultt-e)
-   [wrapException](#handling-exceptions-with-wrapexception)
-   [Typed wrapException](#typed-variant-of-wrapexception)

### [`Option<T>`](./lib/option.ts)

The `Option` type represent an optional value, either `Some` (a value is present) or `None` (no value). It removes ambiguity and is safer than relying on `null` or `undefined`.

**Example:**

```ts
import { type Option, Some, None } from "./option";

interface User {
    id: number;
    name: string;
    address?: string;
}

const users: User[] = [
    { id: 1, name: "Alice", address: "123 Main St" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie", address: "456 Oak St" },
];

function getUserAddress(userId: number): Option<string> {
    const user = users.find((u) => u.id === userId);
    return user && user.address ? Some(user.address) : None;
}

const opt = getUserAddress(1);
// const opt = getUserAddress(2);
// const opt = getUserAddress(4);

if (opt.isSome()) {
    // infered string
    console.log(opt.unwrap());
} else {
    // infered never
    console.log("No value");
}
```

### [`Result<T, E>`](./lib/result.ts)

The `Result` type represents the outcome of an operation that can succeed or fail, either `Ok` (success with a value) or `Err` (failure with an error). It avoids throwing exceptions and provides a functional approach to error handling.

**Example:**

```ts
import { type Result, Ok, Err } from "./result";

function divide(dividend: number, divisor: number): Result<number, Error> {
    if (divisor === 0) {
        return Err(new Error("Cannot divide by zero"));
    } else {
        return Ok(dividend / divisor);
    }
}

const res = divide(10, 2);
// const res = divide(10, 0);

if (res.isOk()) {
    // infered number
    console.log(res.unwrap());
} else if (res.isErr()) {
    // infered Error
    console.error(res.unwrapErr().message);
}
```

### Handling exceptions with [`wrapException`](./lib/wrapException.ts)

The `wrapException` utility helps integrate `Result` with functions that throw exceptions. This works for both synchronous and asynchronous operations.

**Synchronous Example:**

```ts
import { type Result } from "./result";
import wrapException from "./wrapException";

const thisThrows = () => {
    throw new Error("Something went wrong");
    return 42;
};

const res = wrapException(() => thisThrows());

if (res.isOk()) {
    // infered number
    console.log(res.unwrap());
} else if (res.isErr()) {
    // infered any
    console.error(res.unwrapErr().message);
}
```

**Asynchronous Example:**

```ts
import { type Result } from "./result";
import wrapException from "./wrapException";

const thisThrowsAsync = async () => {
    throw new Error("Async failure");

    return await Promise.resolve(1);
};

const res = await wrapException(async () => thisThrowsAsync());

if (res.isOk()) {
    // infered number
    console.log(res.unwrap());
} else if (res.isErr()) {
    // infered any
    console.error(res.unwrapErr().message);
}
```

### Typed variant of [`wrapException`](./lib/wrapException.ts)

You can explicitly specify types for the success and error cases.

**Synchronous Example:**

```ts
import { type Result } from "./result";
import wrapException from "./wrapException";

const thisThrows = () => {
    throw new Error("Something went wrong");

    return 1;
};

const res = wrapException<number, Error>(() => thisThrows());

if (res.isOk()) {
    // infered number
    console.log(res.unwrap());
} else if (res.isErr()) {
    // infered Error
    console.error(res.unwrapErr().message);
}
```

**Asynchronous Example:**

```ts
import { type Result } from "./result";
import wrapException from "./wrapException";

const thisThrowsAsync = async () => {
    throw new Error("throwing async");

    return await Promise.resolve(1);
};

const res = await wrapException<ReturnType<typeof thisThrowsAsync>, Error>(
    async () => thisThrowsAsync(),
);

if (res.isOk()) {
    // infered number
    console.log(res.unwrap());
} else if (res.isErr()) {
    // infered Error
    console.error(res.unwrapErr().message);
}
```

## License

See the [LICENSE](./LICENSE).
