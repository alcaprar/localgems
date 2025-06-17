import * as vueTastification from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vueTastification.default)
  return {
    provide: {
      toast: vueTastification.useToast()
    }
  }
})
