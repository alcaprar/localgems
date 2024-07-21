<template>
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Ordine #{{ order.id }} di {{ order.client.name }}</h1>
    </div>
    <div class="table-responsive small">
        <h3>Spesa totale: {{ formatAmountInMinor(total) }}€</h3>
        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th>Prodotto</th>
                    <th>Quantità</th>
                    <th>Prezzo unitario</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="orderItem in order.order_items" :key="orderItem.id">
                    <td> {{ orderItem.product_sale.product.name }}</td>
                    <td> {{ orderItem.quantity }}</td>
                    <td> {{ formatAmountInMinor(orderItem.product_sale.amount_in_minor) }}€</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        definePageMeta({ layout: "admin" });
    },

    data() {
        const orderId = this.$route.params.order as string;
        return {
            orderId,
            order: {
                id: -1,
                client: {
                    name: 'Client'
                },
                order_items: [] as OrderItemDto[]
            }
        };
    },
    computed: {
        total() {
            return this.order.order_items.reduce((sum, current, index) => {
                return sum + current.quantity * current.product_sale.amount_in_minor
            }, 0)
        }
    },
    async created() {
        this.$loader.startLoader();
        let result = await this.$backend.orders.get(Number(this.orderId));
        if (result.ok) {
            this.order = {
                id: result.val.id,
                client: result.val.client,
                order_items: result.val.order_items.filter((item) => {
                    return item.quantity > 0
                })
            }
        }
        this.$loader.stopLoader();
    },
    methods: {
        formatAmountInMinor(amount_in_minor: number): number {
            return this.$formatter.amountInMinor(amount_in_minor)
        },
    }
};
</script>