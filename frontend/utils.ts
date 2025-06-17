export default {
  formatAmountInMinor(amount: number): number {
    return amount / 100
  },
  debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
    let timeoutID: number | undefined = undefined

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timeoutID)
      timeoutID = window.setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    } as T
  }
}
