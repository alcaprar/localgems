/**
 * order-item controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order-item.order-item', {
  async increment(ctx, next) {
    strapi.log.info('increment', ctx.params, ctx.request.body)
    const orderItemId = ctx.params.id
    if (!orderItemId) {
      return ctx.badRequest('Missing or invalid id', {
        order_item_id: orderItemId
      })
    }

    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const orderItemEntity = await strapi.db
        .query('api::order-item.order-item')
        .findOne({ where: { id: orderItemId }, populate: ['product_sale'] })
      strapi.log.info('orderItemEntity', orderItemEntity)

      if (orderItemEntity.product_sale.current_available == 0) {
        return ctx.badRequest('current_available is 0', {
          product_sale: orderItemEntity.product_sale
        })
      }

      const orderItem = await strapi.entityService.update(
        'api::order-item.order-item',
        orderItemId,
        {
          data: {
            quantity: orderItemEntity.quantity + 1
          }
        }
      )
      const productSale = await strapi.entityService.update(
        'api::product-sale.product-sale',
        orderItemEntity.product_sale.id,
        {
          data: {
            current_available: orderItemEntity.product_sale.current_available - 1
          }
        }
      )

      await commit()

      return {
        orderItem,
        productSale
      }
    })
  },

  async decrement(ctx, next) {
    strapi.log.info('decrement', ctx.params, ctx.request.body)
    const orderItemId = ctx.params.id
    if (!orderItemId) {
      return ctx.badRequest('Missing or invalid id', {
        order_item_id: orderItemId
      })
    }

    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const orderItemEntity = await strapi.db
        .query('api::order-item.order-item')
        .findOne({ where: { id: orderItemId }, populate: ['product_sale'] })
      strapi.log.info('orderItemEntity', orderItemEntity)

      if (orderItemEntity.quantity == 0) {
        return ctx.badRequest('quantity is already 0', {
          order_item: orderItemEntity
        })
      }

      const orderItem = await strapi.entityService.update(
        'api::order-item.order-item',
        orderItemId,
        {
          data: {
            quantity: orderItemEntity.quantity - 1
          }
        }
      )
      const productSale = await strapi.entityService.update(
        'api::product-sale.product-sale',
        orderItemEntity.product_sale.id,
        {
          data: {
            current_available: orderItemEntity.product_sale.current_available + 1
          }
        }
      )

      await commit()

      return {
        orderItem,
        productSale
      }
    })
  }
})
