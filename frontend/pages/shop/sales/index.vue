<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Finestre di vendita <NuxtLink :to="`/shop/sales/new`"> <button type="button"
          class="btn btn-primary"><i class="bi-plus-circle-fill" /></button></NuxtLink>
    </h1>
  </div>
  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Data inizio</th>
          <th>Data fine</th>
          <th>Stato</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id" @click="rowClicked(sale.id)">
          <td>{{ sale.id }}</td>
          <td>{{ sale.startDate.toLocaleString() }}</td>
          <td>{{ sale.endDate.toLocaleString() }}</td>
          <td>
            {{ isSaleActive(sale) ? "🟢 In corso" : "🔴 Conclusa" }}
          </td>
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
    return {
      sales: [] as Sale[],
      shopId: "1", // hack because for the time being there will be just one shop
    };
  },
  async created() {
    this.$loader.startLoader();
    await this.refreshSales();
    this.$loader.stopLoader();
  },
  methods: {
    rowClicked(saleId: string) {
      navigateTo(`/shop/sales/${saleId}`)
    },
    isSaleActive(sale: Sale): boolean {
      const now = new Date();
      return now >= sale.startDate && now <= sale.endDate
    },
    async refreshSales() {
      let result = await this.$backend.sales.getAll();
      if (result.ok) {
        this.sales = result.val.map((item) => {
          return {
            id: item.id?.toString(),
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
          } as Sale;
        }).reverse();
      } else {
        this.$toast.error("Error nel recuperare le vendite. Riprovare.")
      }
    },
  },
};
</script>
