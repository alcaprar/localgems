<template>
    <div class="row">
        <div v-if="!edit">{{ formatAmountInMinor(currentAmount) }}€</div>
        <div v-if="edit"><input type="number" v-model="currentAmount" @keyup.enter="onEnterClicked"></div>
        <div v-if="!edit" @click.prevent="onEditClicked"><i class="bi-pencil-square" /></div>
        <div v-if="edit" @click.prevent="onSaveClicked"><i class="bi-check-circle-fill" />
        </div>
        <div v-if="edit" @click.prevent="onCancelClicked"><i class="bi-x-circle-fill" /></div>
    </div>
</template>
<script lang="ts">
export default {
    props: {
        productSaleId: {

        },
        amount: {

        }
    },
    data() {
        return {
            edit: false,
            initialAmount: Number(this.amount),
            currentAmount: Number(this.amount)
        }
    },
    methods: {
        formatAmountInMinor(amount: number): number {
            return this.$formatter.amountInMinor(amount)
        },
        onEditClicked() {
            this.$log().debug("[ProductSaleAmount] onEditClicked")
            this.edit = true
        },
        onCancelClicked() {
            this.$log().debug("[ProductSaleAmount] onCancelClicked")
            this.edit = false
            this.currentAmount = this.initialAmount
        },
        async onSaveClicked() {
            this.$log().debug("[ProductSaleAmount] onSaveClicked")
            await this.updateAmount()
        },
        async onEnterClicked() {
            this.$log().debug("[ProductSaleAmount] onEnterClicked")
            await this.updateAmount()
        },
        async updateAmount() {
            this.$loader.startLoader()
            this.edit = false
            let result = await this.$backend.sales.updateProductAmount(Number(this.productSaleId), this.currentAmount);
            if (result.ok) {
                this.$toast.success("Prezzo aggiornato con successo.")
                this.initialAmount = this.currentAmount
            } else {
                this.$toast.error("C'è stato un errore nel salvare il prezzo.");
                this.currentAmount = this.initialAmount
            }
            this.$loader.stopLoader()
        }
    }
}
</script>