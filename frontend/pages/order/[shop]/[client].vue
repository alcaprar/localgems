<template>
  <div class="preloader" v-if="saleClosed">
    La finestra per ordinare non è aperta.
    <br>
    Se pensi che sia un errore contatta il venditore.
  </div>
  <div class="py-5 text-center">
    <h2>Pagina ordine #{{ order.id }}</h2>
    <p class="mt-2 text-lg text-gray-600">
      Apertura: {{ order.sale.startDate.toLocaleString() }}. Chiusura:
      {{ order.sale.endDate.toLocaleString() }}
    </p>
    <p class="mt-2 text-lg text-gray-600">
      Scegli quello che ti serve. Salva automaticamente.
    </p>
  </div>
  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th style="width: 20%">Prodotto</th>
          <th style="width: 20%">Prezzo</th>
          <th style="width: 40%">Quantità scelta</th>
          <th style="width: 10%">Quantità disponibile</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.items" :key="item.id" :class="{
          'sold-out': item.available_quantity == 0 &&
            item.quantity == 0
        }">
          <td>{{ item.name }}</td>
          <td>
            {{ formatAmountInMinor(item.price_per_unit_in_minor) }}€/{{
              formatUnitType(item.unit)
            }}
          </td>
          <td>
            <button class="btn btn-primary" :disabled="item.quantity == 0" @click="decrement(item.id)">
              -
            </button>
            {{ item.quantity }} {{ formatUnitType(item.unit) }}
            <button class="btn btn-primary" :disabled="item.available_quantity == 0" @click="increment(item.id)">
              +
            </button>
          </td>
          <td>
            {{ item.available_quantity == 0 ? "Terminato" : item.available_quantity }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <hr />
  <div class="row mr-20">
    <div class="d-flex flex-row-reverse">
      Totale: {{ formatAmountInMinor(calculateTotalInMinor()) }}€
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <textarea v-model="order.notes" placeholder="Lascia qui qualsiasi nota" rows="4" class="form-control"
        @keyup="onNotesChanges" />
    </div>
  </div>
</template>

<script lang="ts">
import { UnitType, type Order, type OrderItem } from "../../../types/models";
import { UnitTypefromString } from "../../../types/models";

import type { OrderDto, OrderItemDto } from "../../../types/api";

import utils from "../../../utils";

export default {
  data() {
    const shopSlug = this.$route.params.shop as string;
    const clientUsername = this.$route.params.client as string;
    let order: Order = {
      id: -1,
      sale: {
        id: "-1",
        endDate: new Date(),
        startDate: new Date(),
      },
      notes: "",
      items: [],
    };
    return {
      shopSlug,
      clientUsername,
      saleClosed: true,
      order,
      timeout: -1,
    };
  },
  async created() {
    this.$loader.startLoader();

    let result = await this.$backend.clients.get(this.shopSlug, this.clientUsername);
    this.$loader.stopLoader();
    if (result.ok) {
      if (result.ok) {
        await this.refreshOrderData()
      } else {
        this.$toast.error("Il cliente non esiste.");
        navigateTo("/client-not-found");
      }
    }
  },
  methods: {
    async refreshOrderData() {
      this.$loader.startLoader();
      let result = await this.$backend.orders.lastOrder(this.shopSlug, this.clientUsername);
      if (result.ok) {
        let order = result.val;
        const startDate = new Date(order.sale.startDate);
        const endDate = new Date(order.sale.endDate);

        this.order = {
          id: order.id,
          notes: order.notes,
          sale: {
            id: order.sale.id.toString(),
            startDate,
            endDate,
          },
          items: order.order_items.map(
            (item: OrderItemDto): OrderItem => ({
              id: item.id,
              name: item.product_sale.product.name,
              price_per_unit_in_minor: item.product_sale.amount_in_minor,
              quantity: item.quantity,
              available_quantity: item.product_sale.current_available,
              unit: UnitTypefromString(item.product_sale.product.unit),
            })
          ),
        };
        const now = new Date();
        this.saleClosed = now > this.order.sale.endDate || now < this.order.sale.startDate;
      } else {
        this.$toast.error("Impossibile recuperare i dettagli dell'ordine.")
      }
      this.$loader.stopLoader();
    },
    onNotesChanges() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = window.setTimeout(async () => {
        this.$loader.startLoader();
        await this.$backend.orders.updateNotes(this.order.id, this.order.notes);
        this.$loader.stopLoader();
      }, 1000);
    },
    async increment(orderItemId: number) {
      this.$loader.startLoader();
      await this.$backend.orders.increment(orderItemId);
      await this.refreshOrderData();
      this.$loader.stopLoader();
    },
    async decrement(orderItemId: number) {
      this.$loader.startLoader();
      await this.$backend.orders.decrement(orderItemId);
      await this.refreshOrderData();
      this.$loader.stopLoader();
    },
    formatUnitType(unit: UnitType): string {
      return utils.formatUnitType(unit);
    },
    formatAmountInMinor(amount: number): number {
      return utils.formatAmountInMinor(amount);
    },
    calculateTotalInMinor(): number {
      return this.order.items.reduce(
        (sum, current) =>
          sum + current.quantity * current.price_per_unit_in_minor,
        0
      );
    },
  },
};
</script>

<style>
.preloader {
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: large;
  background: #dddddd;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
  opacity: 0.9;
}

.sold-out {
  text-decoration: line-through;
}
</style>