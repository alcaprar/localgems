/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', {
  async findOne(ctx) {
    const orderId = ctx.params.id
    strapi.log.info('[controllers][orders][findOne] saleId', orderId)
    const orderEntity = await strapi.db.query('api::order.order').findOne({
      where: { id: orderId },
      populate: [
        'sale',
        'order_items',
        'order_items.product_sale',
        'order_items.product_sale.product',
        'client'
      ]
    })
    strapi.log.info('[controllers][orders][findOne] orderEntity', orderEntity)
    return orderEntity
  },
  async updateNotes(ctx, next) {
    strapi.log.info('updateNotes', ctx.params, ctx.request.body)
    const order_id = ctx.params.id
    if (!order_id) {
      return ctx.badRequest('Missing or invalid id', { order_id })
    }
    const notes = JSON.parse(ctx.request.body).notes || ''

    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const order = await strapi.entityService.update('api::order.order', order_id, {
        data: {
          notes
        }
      })

      await commit()

      return order
    })
  },
  async confirm(ctx, next) {
    strapi.log.info('confirm', ctx.params)
    const orderId = ctx.params.id
    if (!orderId) {
      return ctx.badRequest('Missing or invalid id', { orderId })
    }

    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const order = await strapi.entityService.update('api::order.order', orderId, {
        data: {
          last_confirmed_at: new Date()
        }
      })

      await commit()

      return order
    })
  }
})
