/**
 * sale controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::sale.sale', {
    async findOne(ctx) {
        const saleId = ctx.params.id;
        strapi.log.info('[controllers][sales][findOne] saleId', saleId)
        const saleEntity = await strapi.db.query('api::sale.sale').findOne({
            where: { id: saleId },
            populate: [
                'product_sales',
                'product_sales.product'
            ]
        })
        strapi.log.info('[controllers][sales][findOne] saleEntity', saleEntity)
        return saleEntity;
    },
    async create(ctx) {
        const { data } = ctx.request.body
        const shopId = data.shop;
        const now = new Date();

        const salesOpenNow = await strapi.db.query('api::sale.sale').findMany({
            where: { shop: shopId, startDate: { $lt: now }, endDate: { $gt: now } },
            limit: 1,
            orderBy: { endDate: 'desc' }
        });
        strapi.log.info('[controllers][sales] salesOpenNow', salesOpenNow)
        if (salesOpenNow.length > 0) {
            return ctx.badRequest('There is already another sale open')
        }

        const sale = await strapi.entityService.create('api::sale.sale', {
            data: data
        })

        const clients = await strapi.db.query('api::client.client').findMany({
            where: { shop: shopId },
        });
        strapi.log.info('[controllers][sales] clients', clients)

        for (let client of clients) {
            await strapi.entityService.create('api::order.order', {
                data: {
                    sale: sale.id,
                    client: client.id
                }
            })
        }

        return { data: sale }
    },
    async addProduct(ctx) {
        let saleId = ctx.params.id;
        const { data } = ctx.request.body;
        const productId = data.productId;

        const productSaleEntity = await strapi.entityService.create('api::product-sale.product-sale', {
            data: {
                product: productId,
                sale: saleId,
                total_available: 0,
                current_available: 0,
                amount_in_minor: 0
            }
        })

        const orders = await strapi.db.query('api::order.order').findMany({
            where: { sale: saleId },
        });

        for (let order of orders) {
            await strapi.entityService.create('api::order-item.order-item', {
                data: {
                    product_sale: productSaleEntity.id,
                    order: order.id,
                    quantity: 0
                }
            })
        }

        return productSaleEntity
    },
    async getOrders(ctx) {
        let saleId = ctx.params.id;
        strapi.log.info('[controllers][getOrders] saleId', saleId)

        const orders = await strapi.db.query('api::order.order').findMany({
            where: { sale: saleId },
            populate: [
                'client',
                'order_items'
            ]
        });
        strapi.log.info('[controllers][getOrders] orders', orders)

        let ordersWithOneItem = orders.filter((order) => {
            // returning only the orders that have at least one item
            let order_items = order.order_items.filter((order_item) => {
                // checking if there is at least one order item with quantity > 0
                return order_item.quantity > 0
            });

            strapi.log.info('[controllers][getOrders] order_items', order_items)
            return order_items.length > 0
        });


        strapi.log.info('[controllers][getOrders] ordersWithOneItem', ordersWithOneItem)

        return ordersWithOneItem;
    }
})
