/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product', {
  async create(ctx) {
    const { data } = ctx.request.body


    return await strapi.db.transaction(async ({ trx, rollback, commit, onCommit, onRollback }) => {
      const response = await strapi.entityService.create('api::product.product', {
        data: data
      })

      await commit();

      return { response }
    })

  }
})
