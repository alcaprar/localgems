<template>
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <main role="main" class="inner cover">
            <h1 class="cover-heading">Fai la spesa da {{ shopName }}.</h1>
            <p class="lead">Inserisci il nome utente che ti è stato dato e premi invio. Se è corretto si aprirà la
                pagina dell'ordine.</p>
            <p class="lead">
                <input class="mb-3" style="width: 100%;" type="text" v-model="username">
                <button class="btn btn-lg btn-secondary" @click="goToOrderClicked">Vai all'ordine</button>
            </p>
        </main>

    </div>
</template>

<script lang="ts">
export default {
    data() {
        const shop = this.$route.params.shop as string;
        return {
            shopSlug: shop,
            shopName: "Anime Contadine",
            username: ""
        }
    },
    created() {
        this.$loader.startLoader();
        // load shop info
        this.$loader.stopLoader();
    },
    methods: {
        async goToOrderClicked() {
            if (await this.clientExist(this.username)) {
                navigateTo(`/order/${this.shopSlug}/${this.username}`)
            } else {
                this.$toast.error("Il nome utente non è corretto, riprova. Se l'errore persiste contattaci.")
            }
        },
        async clientExist(clientUsername: string): Promise<boolean> {
            const url = `${this.$config.public.apiBaseUrl}/api/shops/${this.shopSlug}/${clientUsername}`;
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
    }
}
</script>

<style>
/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
    color: #fff;
    text-shadow: none;
    /* Prevent inheritance from `body` */
    background-color: #333;
    border: .05rem solid #333;
}


.cover-container {
    max-width: 42em;
    color: #333;
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-pack: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 100%;
    /* background-color: #333; */
}


/*
 * Cover
 */
.cover {
    padding: 0 1.5rem;
}

.cover .btn-lg {
    padding: .75rem 1.25rem;
    font-weight: 700;
}
</style>