export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      formatter: {
        amountInMinor(amount_in_minor: number) {
          return amount_in_minor / 100
        }
      }
    }
  }
})
