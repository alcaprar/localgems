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
      handler: 'shop.products'
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
      path: '/shops/:shop/units',
      handler: 'shop.units'
    },
    {
      method: 'POST',
      path: '/shops/:shop/units',
      handler: 'shop.addUnit'
    },
    {
      method: 'GET',
      path: '/shops/:shopSlug/:clientUsername',
      handler: 'shop.client',
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
