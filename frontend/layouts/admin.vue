<template>
  <div class="preloader" v-if="loading">
    🍅🥕🍆🍆🥜🥜🐝🌻
  </div>
  <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">Local Gems</a>

    <ul class="navbar-nav flex-row d-md-none">
      <li class="nav-item text-nowrap">
        <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi-list"></i>
        </button>
      </li>
    </ul>
  </header>
  <div class="container-fluid">
    <div class="row">
      <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
        <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu"
          aria-labelledby="sidebarMenuLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="sidebarMenuLabel">Local Gems</h5>
            <button type="button" id="close-sidebar" class="btn-close" data-bs-dismiss="offcanvas"
              data-bs-target="#sidebarMenu" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
            <ul class="nav flex-column">
              <li v-for="item in sidebarItems" :key="item.icon" class="nav-item">
                <NuxtLink :to="item.to" v-on:click.native="closeSidebar"
                  class="nav-link d-flex align-items-center gap-2"><i :class="item.icon"></i> {{ item.text }}</NuxtLink>
              </li>
            </ul>
            <hr class="my-3" />
          </div>
        </div>
      </div>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      sidebarItems: [{
        to: "/shop/products",
        icon: "bi-house-fill",
        text: "Prodotti"
      }, {
        to: "/shop/sales",
        icon: "bi-cart-fill",
        text: "Finestre di vendita"
      }, {
        to: "/shop/clients",
        icon: "bi-people-fill",
        text: "Clienti"
      }, {
        to: "/shop/units",
        icon: "bi-people-fill",
        text: "Unità"
      }, {
        to: "/shop/changelog",
        icon: "bi-journal-arrow-up",
        text: "Lista Aggiornamenti"
      }]
    }
  },
  computed: {
    loading: () => {

      let app = useNuxtApp();
      return app.$loader.isLoading()
    }
  },
  methods: {
    closeSidebar() {
      document.getElementById('close-sidebar')?.click();
    }
  }
}
</script>

<style>
.preloader {
  align-items: center;
  background: #dddddd;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  transition: opacity 0.2s linear;
  width: 100%;
  z-index: 9999;
  opacity: 1;
  transform: opacity 1s linear;
}

.bi {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}

/*
 * Sidebar
 */

@media (min-width: 768px) {
  .sidebar .offcanvas-lg {
    position: -webkit-sticky;
    position: sticky;
    top: 48px;
  }

  .navbar-search {
    display: block;
  }
}

.sidebar .nav-link {
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar .nav-link.active {
  color: #2470dc;
}

.sidebar-heading {
  font-size: 0.75rem;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}

.navbar .form-control {
  padding: 0.75rem 1rem;
}
</style>
