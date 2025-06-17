export default defineNuxtRouteMiddleware((to) => {
  const authenticated = useState('authenticated', () => false)
  const token = useCookie('token') // get token from cookies
  if (token.value) {
    // check if value exists
    authenticated.value = true // update the state to authenticated
  }
  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    return navigateTo('/shop')
  }
  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'shop/login') {
    abortNavigation()
    return navigateTo('/shop/login')
  }
})
