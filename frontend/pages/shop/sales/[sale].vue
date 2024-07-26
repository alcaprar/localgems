<template>
  <ul class="nav nav-tabs" id="sale" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#general" type="button"
        role="tab" aria-controls="general" aria-selected="true">Generale</button>
    </li>
    <li class="nav-item" role="presentation" v-if="!isNew()">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab"
        aria-controls="products" aria-selected="false">Prodotti</button>
    </li>
    <li class="nav-item" role="presentation" v-if="!isNew()">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab"
        aria-controls="products" aria-selected="false">Ordini</button>
    </li>
  </ul>
  <div class="tab-content">
    <div id="general" class="tab-pane pane show active" role="tabpanel">
      <div class="row g-3">
        <form class="">
          <div class="col-xs-6">
            <label for="startDate" class="form-label">Data inizio</label>
            <DatePicker id="startDate" v-model="sale.startDate" minimumView="time" inputFormat="yyyy-MM-dd HH:mm">
            </DatePicker>
          </div>
          <div class="col-xs-6">
            <label for="endDate" class="form-label">Data fine</label>
            <DatePicker id="startDate" v-model="sale.endDate" minimumView="time" inputFormat="yyyy-MM-dd HH:mm">
            </DatePicker>
          </div>

          <hr class="my-4" />

          <button @click.prevent="onSave" class="w-100 btn btn-primary btn-lg">
            Salva
          </button>
        </form>
      </div>
    </div>
    <div id="products" class="tab-pane fade" role="tabpanel">
      <div class="table-responsive small">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Prezzo unitario</th>
              <th>Quantità disponibile</th>
              <th>Quantità ordinata</th>
              <th>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProduct"><i
                    class="bi-plus-circle-fill" /></button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in saleProducts" :key="product.id">
              <td>{{ product.product.name }}</td>
              <td>
                <ProductSaleAmount :product-sale-id="product.id" :amount="product.amount_in_minor"></ProductSaleAmount>
              </td>
              <td>
                <ProductSaleAvailability :product-sale-id="product.id" :availability="product.total_available">
                </ProductSaleAvailability>
              </td>
              <td>{{ product.total_available - product.current_available }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="orders" class="tab-pane fade" role="tabpanel">
      <div class="table-responsive small">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Cliente</th>
              <th>Confermato?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" @click="openOrderDetail(order.id)">
              <td>{{ order.id }}</td>
              <td>{{ order.client.name }}</td>
              <td>{{ order.last_confirmed_at ? "🟢 SI" : "🔴 NO" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="modal fade" id="addProduct" tabindex="-1" aria-labelledby="addProductlLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addProductLabel">Aggiungi prodotto</h1>
          <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row" v-for="product in productsNotAddedYet">
            <span @click="addProduct(product.id || -1)">+ {{ product.name }} +</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  setup() {
    definePageMeta({ layout: "admin" });
  },

  data() {
    return {
      saleId: this.$route.params.sale as string,
      sale: {
        startDate: new Date(),
        endDate: new Date(),
        id: "NEW",
      } as Sale,
      shopId: "1", // hack because for the time being there will be just one shop,
      saleProducts: [] as ProductSale[],
      shopProducts: [] as ProductDto[],
      orders: []
    };
  },
  computed: {
    productsNotAddedYet() {
      const productsAlreadyInSale: number[] = this.saleProducts.map(item => item.product.id);
      return this.shopProducts.filter((item) => {
        const id = item.id || -1;
        return !productsAlreadyInSale.includes(id)
      })
    }
  },
  async created() {
    this.sale.id = this.saleId;

    if (this.saleId.toLowerCase() != "new") {

      this.$loader.startLoader();
      await this.refreshSaleData();
      let shopProductsResult = await this.$backend.products.getAll();
      let ordersResult = await this.$backend.sales.getOrders(Number(this.saleId));
      this.$loader.stopLoader();

      if (shopProductsResult.ok) {
        this.shopProducts = shopProductsResult.val
      }
      if (ordersResult.ok) {
        this.orders = ordersResult.val.map((order) => {
          return {
            id: order.id,
            notes: order.notes,
            client: {
              id: order.client.id,
              name: order.client.name
            },
            items: [],
            last_confirmed_at: order.last_confirmed_at
          }
        })
      }
    }
  },
  methods: {
    isNew(): boolean {
      const saleId = this.$route.params.sale as string;
      return saleId.toLowerCase() == "new";
    },
    async refreshSaleData() {
      this.$loader.startLoader();
      let saleResult = await this.$backend.sales.get(Number(this.saleId));
      if (saleResult.ok) {
        if (saleResult.val.id != null) {
          this.sale = {
            id: saleResult.val.id.toString(),
            startDate: new Date(saleResult.val.startDate),
            endDate: new Date(saleResult.val.endDate),
          };
          if (saleResult.val.product_sales != null) {
            this.saleProducts = saleResult.val.product_sales.map((item) => {
              return {
                id: item.id,
                amount_in_minor: item.amount_in_minor,
                current_available: item.current_available,
                total_available: item.total_available,
                product: {
                  id: item.product.id || -1,
                  name: item.product.name,
                  unit: item.product.unit
                }
              }
            })
          };
        }
      }
      this.$loader.stopLoader();
    },
    formatAmountInMinor(amount_in_minor: number): number {
      return this.$formatter.amountInMinor(amount_in_minor)
    },
    async addProduct(productId: number) {
      this.$log().info("[sale] addProduct", productId);
      this.$loader.startLoader();
      let result = await this.$backend.sales.addProduct(Number(this.sale.id), productId);
      this.$loader.stopLoader();
      if (result.ok) {
        this.$log().info("[sale][addProduct] result", result);
        document.getElementById('close-modal')?.click();
        await this.refreshSaleData();
      } else {
        this.$toast.error("C'è stato un errore nell'inserimento del prodotto.")
      }
    },
    async onSave() {
      if (this.isNew()) {
        this.$log().debug("Creating new sale");
        this.$loader.startLoader();
        let result = await this.$backend.sales.create({
          startDate: this.sale.startDate.toISOString(),
          endDate: this.sale.endDate.toISOString(),
        });
        this.$loader.stopLoader();
        if (result.ok) {
          this.$log().debug("Sale created, redirecting to the right url.")
          this.$toast.success("Vendita creata con successo. Puoi aggiungere i prodotti ora.")
          navigateTo(`/shop/sales/${result.val}`)
        } else {
          this.$toast.error("Errore nel creare la vendita.")
        }

      } else {
        this.$loader.startLoader();
        await this.$backend.sales.update({
          id: Number(this.sale.id),
          startDate: this.sale.startDate.toISOString(),
          endDate: this.sale.endDate.toISOString(),
        });
        this.$loader.stopLoader();
      }
    },
    openOrderDetail(orderId: number) {
      navigateTo(`/shop/orders/${orderId}`)
    }
  },
};
</script>
