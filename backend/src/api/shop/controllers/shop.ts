/**
 * shop controller
 */

import { factories } from '@strapi/strapi'
import sale from '../../sale/controllers/sale'

export default factories.createCoreController('api::shop.shop', {
  async checkClient(ctx, next) {
    console.log('checkClient', ctx.params)
    const shopEntity = await strapi.db
      .query('api::shop.shop')
      .findOne({ where: { slug: ctx.params.shop } })
    strapi.log.info('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop: ctx.params.shop })
    }

    const clientEntity = await strapi.db
      .query('api::client.client')
      .findOne({ where: { shop: shopEntity.id, username: ctx.params.client } })
    console.log('clientEntity', clientEntity)

    if (!clientEntity) {
      return ctx.badRequest('Client not found', { client: ctx.params.client })
    }

    return clientEntity;
  },
  async lastOrder(ctx, next) {
    const shop = ctx.params.shop
    const client = ctx.params.client
    console.log({ shop, client })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { slug: shop } })
    console.log('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const clientEntity = await strapi.db
      .query('api::client.client')
      .findOne({ where: { shop: shopEntity.id, username: client } })
    console.log('clientEntity', clientEntity)

    if (!clientEntity) {
      return ctx.badRequest('Client not found', { client })
    }

    const sales = await strapi.db.query('api::sale.sale').findMany({
      where: { shop: shopEntity.id },
      limit: 1,
      orderBy: { endDate: 'desc' }
    })

    if (!sales || sales.length == 0) {
      return ctx.badRequest('No sale for this shop', { shop })
    }
    console.log('sales', sales)

    const lastSale = sales[0]

    const orderEntity = await strapi.db.query('api::order.order').findOne({
      where: { client: clientEntity.id, sale: lastSale.id },
      populate: [
        'sale',
        'order_items',
        'order_items.product_sale',
        'order_items.product_sale.product'
      ]
    })
    console.log('orderEntity', orderEntity)

    return orderEntity
  },
  async clients(ctx, next) {
    const shop = ctx.params.shop
    console.log({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    console.log('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const clientEntities = await strapi.db
      .query('api::client.client')
      .findMany({ where: { shop } })
    console.log('[controllers][shop][clients] clientEntities', clientEntities)

    return clientEntities
  },
  async products(ctx, next) {
    const shop = ctx.params.shop
    console.log({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    console.log('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const productEntities = await strapi.db
      .query('api::product.product')
      .findMany({ where: { shop } })
    console.log('productEntities', productEntities)

    return productEntities
  },
  async sales(ctx, next) {
    const shop = ctx.params.shop
    console.log({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    console.log('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const saleEntities = await strapi.db
      .query('api::sale.sale')
      .findMany({ where: { shop } })
    console.log('saleEntities', saleEntities)

    return saleEntities
  }
})
