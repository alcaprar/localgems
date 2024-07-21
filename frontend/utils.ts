export default {
  formatAmountInMinor(amount: number): number {
    return amount / 100;
  },
  debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeoutID: number | undefined = undefined;

    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutID);
      timeoutID = window.setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    } as T;
  },
};
