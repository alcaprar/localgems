/**
 * product-sale controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product-sale.product-sale', {
    async updateAmount(ctx) {
        let productSaleId = ctx.params.id;
        const { data } = ctx.request.body;
        const amountInMinor = data.amount_in_minor;

        let productSale = await strapi.entityService.update('api::product-sale.product-sale', productSaleId, {
            data: {
                amount_in_minor: amountInMinor
            }
        })

        return productSale
    },
    async updateTotalAvailable(ctx) {
        let productSaleId = ctx.params.id;
        const { data } = ctx.request.body;
        const newTotalAvailable = data.total_available;

        console.log(`[controllers][product-sale][updateTotalAvailability] productSaleId '${productSaleId}' newTotalAvailable: '${newTotalAvailable}'`);
        let productSaleEntity = await strapi.db.query('api::product-sale.product-sale').findOne({
            where: { id: productSaleId }
        });
        console.log('[controllers][product-sale][updateTotalAvailability] productSaleEntity', productSaleEntity);

        const delta = productSaleEntity.total_available - newTotalAvailable;
        if (newTotalAvailable < productSaleEntity.total_available && (delta) < productSaleEntity.current_available) {
            return ctx.badRequest('The product will get to a negative available_quantity')
        }

        const productSaleEntityUpdated = await strapi.entityService.update('api::product-sale.product-sale', productSaleId, {
            data: {
                total_available: newTotalAvailable,
                current_available: productSaleEntity.current_available - delta
            }
        })

        return productSaleEntityUpdated
    }
})
