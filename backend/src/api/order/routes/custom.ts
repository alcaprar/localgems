export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/:id/notes',
      handler: 'order.updateNotes',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/orders/:id/confirm',
      handler: 'order.confirm',
      config: {
        auth: false
      }
    }
  ]
}
