import Datepicker from 'vue3-datepicker'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DatePicker', Datepicker)
})
