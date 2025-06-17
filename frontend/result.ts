export function Ok<T>(ok: T): Result<T, NoErrors> {
  return new Result<T, NoErrors>(ok, null)
}

export function Err<E extends ResultError>(err: E): Result<null, E> {
  return new Result<null, E>(null, err)
}

export interface ResultError {
  description(): string
}

export class NoErrors implements ResultError {
  description(): string {
    return 'This is NOT an error'
  }
}

export class Result<T, E extends ResultError> {
  private ok!: T | null
  private err!: E | null

  constructor(ok: T | null, err: E | null) {
    if (!ok && !err) {
      throw new Error('Result must have a value or an error')
    }
    if (ok && err) {
      throw new Error('Result cannot have both a value and and error')
    }

    if (ok !== null) {
      this.ok = ok
    } else {
      this.err = err as E
    }
  }

  unwrap(): T {
    if (this.isOk()) {
      return this.ok as T
    }

    if (this.isErr()) {
      throw this.err as E
    }

    throw new Error('Unknown error')
  }

  expect(msg: string): T {
    if (this.isOk()) {
      return this.ok as T
    }

    if (this.isErr()) {
      throw new Error(this.err?.description())
    }

    throw new Error(msg)
  }

  isOk(): this is Result<T, never> {
    return this.ok !== null
  }

  isErr(): this is Result<never, E> {
    return this.err !== null
  }

  getErr(): this extends Result<never, E> ? E : E | null {
    return this.err as E
  }
}
