<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div v-if="activeError" class="alert alert-warning" role="alert">
      {{ errorMessage }}
    </div>
    <main class="container flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/layout/Footer.vue';
import Navbar from './components/layout/Navbar.vue';
import { useLoginStore } from './stores/loginStore';
import { storeToRefs } from 'pinia';

const loginStore = useLoginStore()
const { errorMessage, activeError } = storeToRefs(loginStore)

</script>


<style scoped></style>
