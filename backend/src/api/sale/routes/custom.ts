export default {
  routes: [
    {
      method: 'POST',
      path: '/sales/:id/products',
      handler: 'sale.addProduct',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/sales/:id/orders',
      handler: 'sale.getOrders',
      config: {
        auth: false
      }
    }
  ]
}
