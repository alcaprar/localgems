/**
 * client controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::client.client', {
    async create(ctx) {
        const { data } = ctx.request.body
        const shopId = data.shop;

        const clientEntity = await strapi.entityService.create('api::client.client', {
            data: data
        })

        // If there is already a sale open we should create the order for this new client
        const now = new Date();
        const saleOpenNow = await strapi.db.query('api::sale.sale').findOne({
            where: { shop: shopId, startDate: { $lt: now }, endDate: { $gt: now } },
            orderBy: { endDate: 'desc' }
        });

        if (saleOpenNow != null) {
            let orderEntity = await strapi.entityService.create('api::order.order', {
                data: {
                    sale: saleOpenNow.id,
                    client: clientEntity.id
                }
            })

            let productsSaleEntity = await strapi.db.query('api::product-sale.product-sale').findMany({
                where: { sale: saleOpenNow.id }
            });
            for (let productSale of productsSaleEntity) {
                await strapi.entityService.create('api::order-item.order-item', {
                    data: {
                        product_sale: productSale.id,
                        quantity: 0,
                        order: orderEntity.id
                    }
                })
            }
        }

        return { data: clientEntity }
    }
})
