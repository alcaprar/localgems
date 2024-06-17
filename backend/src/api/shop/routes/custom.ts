export default {
  routes: [
    {
      method: 'GET',
      path: '/shops/:shop/clients',
      handler: 'shop.clients',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/shops/:shop/products',
      handler: 'shop.products',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/shops/:shop/sales',
      handler: 'shop.sales',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/shops/:shop/:client',
      handler: 'shop.checkClient',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/shops/:shop/:client/last-order',
      handler: 'shop.lastOrder',
      config: {
        auth: false
      }
    }
  ]
}
