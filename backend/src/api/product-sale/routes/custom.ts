export default {
  routes: [
    {
      method: 'PUT',
      path: '/product-sales/:id/amount',
      handler: 'product-sale.updateAmount',
      config: {
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/product-sales/:id/totalAvailable',
      handler: 'product-sale.updateTotalAvailable',
      config: {
        auth: false
      }
    }
  ]
}
