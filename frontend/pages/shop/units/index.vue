<template>
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Unità di misura <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#addUnit"><i class="bi-plus-circle-fill" /></button></h1>
    </div>
    <div class="table-responsive small">
        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Unità</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="unit in units" :key="unit.id">
                    <td> {{ unit.id }}</td>
                    <td> {{ unit.name }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="modal fade" id="addUnit" tabindex="-1" aria-labelledby="addUnitLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addUnitLabel">Aggiungi unità</h1>
                    <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="col-12">
                        <label for="name" class="form-label">Nome</label>
                        <input type="text" id="name" class="form-control" required v-model="unit.name" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="addUnit">Crea</button>
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
            units: [] as Unit[],
            unit: {
                name: ""
            }
        };
    },
    async created() {
        this.$loader.startLoader();
        await this.refreshUnits();
        this.$loader.stopLoader();

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
        async addUnit() {
            this.$log().info("[pages][units][addUnit]");
            let result = await this.$backend.units.create({
                name: this.unit.name,
            });
            if (result.ok) {
                this.$toast.info("Unità creato con successo.");
                await this.refreshUnits();
                document.getElementById('close-modal')?.click();
            } else {
                this.$toast.error("Errore nel creare la nuova unità.")
            }
            this.$loader.stopLoader();
        }
    }
};
</script>