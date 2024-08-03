<template>
    <main class="form-signin">
        <form>
            <h1 class="h3 mb-3 fw-normal">Fai il login per entrare nell'area riservata</h1>
            <div class="form-floating">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
                    v-model="username">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                    v-model="password">
                <label for="floatingPassword">Password</label>
            </div>

            <button class="w-100 btn btn-lg btn-primary" @click.prevent="login">Sign in</button>
        </form>
    </main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        async login() {
            const authenticated = useState('authenticated', () => false);
            const token = useCookie('token');
            const user = useCookie('user');
            const shop = useCookie('shop');

            let response = await this.$backend.auth.login(this.username, this.password);
            if (response.ok) {
                token.value = response.val.jwt;
                user.value = response.val.user;
                authenticated.value = true

                let me = await this.$backend.auth.me();
                if (me.ok && me.val.shop) {
                    shop.value = me.val.shop;
                } else {
                    this.$toast.error("C'è stato un errore nel login")
                }

                navigateTo("/shop")
            } else {
                this.$toast.error("C'è stato un errore nel login")
            }
        }
    }
}</script>

<style>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>