/**
 * product-sale router
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::product-sale.product-sale', {
    config: {
        findOne: {
            auth: false
        },
        find: {
            auth: false
        }
    }
})
