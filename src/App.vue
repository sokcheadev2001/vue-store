<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/layout/NavBarComponent.vue'
import Footer from './components/layout/FooterComponent.vue'
</script>

<template>
  <NavBar />
  <RouterView />
  <Footer />
</template>
