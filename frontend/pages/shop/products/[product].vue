<template>
  <div class="row g-3">
    <form class="">
      <div class="col-12">
        <label for="unit" class="form-label">Unità</label>
        <select id="unit" class="form-select" v-model="product.unit">
          <option v-for="unit in units" :value="unit.name" :key="unit.id">{{ unit.name }}</option>
        </select>
      </div>
      <div class="col-12">
        <label for="name" class="form-label">Nome esposto</label>
        <input type="text" id="name" class="form-control" placeholder="Pomodori" required v-model="product.name" />
      </div>

      <hr class="my-4" />

      <button @click.prevent="onSave" class="w-100 btn btn-primary btn-lg">
        Salva
      </button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: "admin" });
  },
  data() {
    return {
      product: {
        unit: "",
        name: "",
      } as Product,
      units: [] as Unit[]
    };
  },
  async created() {
    this.$loader.startLoader();
    await this.refreshUnits()
    const productId = this.$route.params.product as string;

    if (productId.toLowerCase() != "new") {
      this.$loader.startLoader();
      let result = await this.$backend.products.get(Number(productId));
      this.$loader.stopLoader();
      if (result.ok) {
        console.log(result.val)
        if (result.val.id != null) {
          this.product = {
            id: result.val.id,
            name: result.val.name,
            unit: result.val.unit
          };
        }
      }
    }
    this.$loader.stopLoader()
  },
  methods: {
    async refreshUnits() {
      let result = await this.$backend.units.getAll();
      if (result.ok) {
        this.units = result.val.map((item) => {
          return {
            id: item.id || -1,
            name: item.name,
          };
        });
      } else {
        this.$toast.error("Errore nel recuperare la lista delle unità.")
      }
    },
    isNew(): boolean {
      const productId = this.$route.params.product as string;
      return productId.toLowerCase() == "new";
    },
    async onSave() {
      if (this.isNew()) {
        this.$loader.startLoader();
        let result = await this.$backend.products.create({
          name: this.product.name,
          unit: this.product.unit
        });
        this.$loader.stopLoader();
        if (result.ok) {
          this.$toast.success("Prodotto creato con successo.")
          navigateTo(`/shop/products`)
        }
      } else {
        const productId = this.$route.params.product as string;
        this.$loader.startLoader();
        let result = await this.$backend.products.update({
          id: Number(productId),
          name: this.product.name,
          unit: this.product.unit
        })
        this.$loader.stopLoader();
      }
    }
  },
};
</script>
