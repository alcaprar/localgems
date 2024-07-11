<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Prodotti <NuxtLink :to="`/shop/products/new`"> <button type="button" class="btn btn-primary"><i
            class="bi-plus-circle-fill" /></button></NuxtLink>
    </h1>
  </div>
  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>Nome esposto</th>
          <th>Unità</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ formatUnitType(product.unit) }}</td>
          <td>
            <NuxtLink :to="`/shop/products/${product.id}`"><i class="bi-pencil-square" /></NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import utils from "~/utils";

export default {
  setup() {
    definePageMeta({ layout: "admin" });
  },

  data() {
    return {
      products: [] as Product[],
      shopId: "1", // hack because for the time being there will be just one shop
    };
  },
  async created() {
    this.$log().debug("created");

    this.$loader.startLoader();
    let result = await this.$backend.products.getAll();
    this.$loader.stopLoader();
    if (result.ok) {
      this.products = result.val.map((item) => {
        return {
          id: item.id || -1,
          name: item.name,
          unit: UnitTypefromString(item.unit),
        };
      });
    }
  },
  methods: {
    formatUnitType(unit: UnitType): string {
      this.$log().debug(unit);
      return utils.formatUnitType(unit);
    },
  },
};
</script>
