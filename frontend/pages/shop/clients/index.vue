<template>
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Clienti <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#addClient"><i class="bi-plus-circle-fill" /></button></h1>
    </div>
    <div class="table-responsive small">
        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Nome e cognome</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in clients" :key="client.id">
                    <td> {{ client.id }}</td>
                    <td> {{ client.username }}</td>
                    <td> {{ client.name }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="modal fade" id="addClient" tabindex="-1" aria-labelledby="addClientlLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addClientLabel">Aggiungi cliente</h1>
                    <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="col-12">
                        <label for="name" class="form-label">Username</label>
                        <input type="text" id="username" class="form-control" placeholder="fede123" required
                            v-model="client.username" />
                    </div>
                    <div class="col-12">
                        <label for="name" class="form-label">Nome</label>
                        <input type="text" id="name" class="form-control" placeholder="Federico Toderi" required
                            v-model="client.name" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="addClient">Crea</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    setup() {
        definePageMeta({
            layout: "admin",
            middleware: "auth"
        });
    },

    data() {
        return {
            clients: [] as Client[],
            client: {
                username: "",
                name: ""
            }
        };
    },
    async created() {
        this.$loader.startLoader();
        await this.refreshClients();
        this.$loader.stopLoader();

    },
    methods: {
        async refreshClients() {
            let result = await this.$backend.clients.getAll();
            if (result.ok) {
                this.clients = result.val.map((item) => {
                    return {
                        id: item.id || -1,
                        username: item.username,
                        name: item.name,
                    };
                });
            } else {
                this.$toast.error("Error nel recuperare la lista dei clienti.")
            }
        },
        async addClient() {
            this.$loader.startLoader();
            this.$log().info("[pages][clients][addClient]");
            let result = await this.$backend.clients.create({
                name: this.client.name,
                username: this.client.username
            });
            if (result.ok) {
                this.$toast.info("Cliente creato con successo.");
                await this.refreshClients();
                document.getElementById('close-modal')?.click();
            } else {
                this.$toast.error("Errore nel creare il nuovo cliente.")
            }
            this.$loader.stopLoader();
        }
    }
};
</script>