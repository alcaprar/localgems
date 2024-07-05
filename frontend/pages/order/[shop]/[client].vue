<template>
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
          <th>Prodotto</th>
          <th>Prezzo</th>
          <th>Quantità scelta</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.items" :key="item.id">
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
      order,
      timeout: -1,
    };
  },
  async created() {
    this.$log().debug("created");
    const shop = this.$route.params.shop as string;
    const clientUsername = this.$route.params.client as string;
    this.$log().debug("[create] params", { shop, clientUsername });
    if (!(await this.clientExist(shop, clientUsername))) {
      this.$log().info("client does not exist");
      navigateTo("/client-not-found");
    }
    let order = await this.getOrder(shop, clientUsername);
    this.order = order;
  },
  methods: {
    async clientExist(shop: string, clientUsername: string): Promise<boolean> {
      const url = `${this.$config.public.apiBaseUrl}/api/shops/${shop}/${clientUsername}`;
      try {
        let response = await fetch(url);
        this.$log().debug("clientExist", response);
        if (response.status !== 200) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        this.$log().error("Error when calling API", error);
        return false;
      }
    },
    async getOrder(shop: string, clientUsername: string): Promise<Order> {
      const url = `${this.$config.public.apiBaseUrl}/api/shops/${shop}/${clientUsername}/last-order`;
      let response = await fetch(url);
      let order_response: OrderDto = await response.json();
      this.$log().debug("getOrder", order_response);

      return {
        id: order_response.id,
        notes: order_response.notes,
        sale: {
          id: order_response.sale.id.toString(),
          startDate: new Date(order_response.sale.startDate),
          endDate: new Date(order_response.sale.endDate),
        },
        items: order_response.order_items.map(
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
    },
    onNotesChanges() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = window.setTimeout(async () => {
        this.$log().debug("onNotesChanges", this.order.notes);
        const url = `${this.$config.public.apiBaseUrl}/api/orders/${this.order.id}/notes`;
        let response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            notes: this.order.notes,
          }),
        });
        this.$log().debug("onNotesChanges POST response", response);
      }, 1000);
    },
    async increment(orderItemId: number) {
      this.$log().debug("increment", orderItemId);

      const url = `${this.$config.public.apiBaseUrl}/api/order-items/${orderItemId}/increment`;
      let response = await fetch(url, {
        method: "POST",
      });
      this.$log().debug("increment POST response", response);
      if (response.ok) {
        const shop = this.$route.params.shop as string;
        const clientUsername = this.$route.params.client as string;
        let order = await this.getOrder(shop, clientUsername);
        this.order = order;
      }
    },
    async decrement(orderItemId: number) {
      this.$log().debug("decrement", orderItemId);

      const url = `${this.$config.public.apiBaseUrl}/api/order-items/${orderItemId}/decrement`;
      let response = await fetch(url, {
        method: "POST",
      });
      this.$log().debug("decrement POST response", response);
      if (response.ok) {
        const shop = this.$route.params.shop as string;
        const clientUsername = this.$route.params.client as string;
        let order = await this.getOrder(shop, clientUsername);
        this.order = order;
      }
    },
    formatUnitType(unit: UnitType): string {
      this.$log().debug(unit);
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
