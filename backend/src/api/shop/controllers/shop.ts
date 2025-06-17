/**
 * shop controller
 */

import { factories } from '@strapi/strapi'
import sale from '../../sale/controllers/sale'

export default factories.createCoreController('api::shop.shop', {
  async client(ctx, next) {
    const shopSlug = ctx.params.shopSlug
    const clientUsername = ctx.params.clientUsername

    strapi.log.info('[shop][client]', { shopSlug, clientUsername })
    const shopEntity = await strapi.db
      .query('api::shop.shop')
      .findOne({ where: { slug: shopSlug } })
    strapi.log.info('[shop][client] shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shopSlug })
    }

    const clientEntity = await strapi.db
      .query('api::client.client')
      .findOne({ where: { shop: shopEntity.id, username: clientUsername } })
    strapi.log.info('[shop][client] clientEntity', clientEntity)

    if (!clientEntity) {
      return ctx.notFound('Client not found', { shop: shopSlug, client: clientUsername })
    }

    return clientEntity
  },
  async lastOrder(ctx, next) {
    const shop = ctx.params.shop
    const client = ctx.params.client
    strapi.log.info('[lastOrder]', { shop, client })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { slug: shop } })
    strapi.log.info('[lastOrder] shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const clientEntity = await strapi.db
      .query('api::client.client')
      .findOne({ where: { shop: shopEntity.id, username: client } })
    strapi.log.info('[lastOrder] clientEntity', clientEntity)

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
    strapi.log.info('[lastOrder] sales', sales)

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
    strapi.log.info('[lastOrder] orderEntity', orderEntity)

    return orderEntity
  },
  async clients(ctx, next) {
    const shop = ctx.params.shop
    strapi.log.info({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    strapi.log.info('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const clientEntities = await strapi.db.query('api::client.client').findMany({ where: { shop } })
    strapi.log.info('[controllers][shop][clients] clientEntities', clientEntities)

    return clientEntities
  },
  async products(ctx, next) {
    const shop = ctx.params.shop
    strapi.log.info({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    strapi.log.info('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const productEntities = await strapi.db
      .query('api::product.product')
      .findMany({ where: { shop } })
    strapi.log.info('productEntities', productEntities)

    return productEntities
  },
  async sales(ctx, next) {
    const shop = ctx.params.shop
    strapi.log.info({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    strapi.log.info('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const saleEntities = await strapi.db.query('api::sale.sale').findMany({ where: { shop } })
    strapi.log.info('saleEntities', saleEntities)

    return saleEntities
  },
  async addUnit(ctx, next) {
    const shop = ctx.params.shop
    const unitName = ctx.request.body.data.name || ''
    strapi.log.info({ shop, unitName })

    if (unitName == '') {
      return ctx.badRequest('Unit is empty', { shop })
    }

    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const unitEntity = await strapi.entityService.create('api::unit.unit', {
        data: {
          shop,
          name: unitName
        }
      })

      await commit()

      return unitEntity
    })
  },
  async units(ctx, next) {
    const shop = ctx.params.shop
    strapi.log.info({ shop })

    const shopEntity = await strapi.db.query('api::shop.shop').findOne({ where: { id: shop } })
    strapi.log.info('shopEntity', shopEntity)

    if (!shopEntity) {
      return ctx.badRequest('Shop not found', { shop })
    }

    const unitEntities = await strapi.db.query('api::unit.unit').findMany({ where: { shop } })
    strapi.log.info('unitEntities', unitEntities)

    return unitEntities
  }
})
