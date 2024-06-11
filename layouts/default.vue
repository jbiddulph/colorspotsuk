<!-- layouts/default.vue -->
<template>
  <div>
    <header class="bg-gray-800 text-white">
      <div class="container mx-auto flex justify-between items-center p-4">
        <div class="flex items-center">
          <img src="/public/colorspots-logo.png" alt="Logo" class="w-10 h-10 mr-4" />
          <h1 class="text-xl font-bold">ColorSpots.uk</h1>
        </div>
        <nav>
          <button @click="toggleMenu" class="block md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <ul :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:flex md:items-center md:space-x-4">
            <li v-for="link in links" :key="link.text">
              <NuxtLink :href="link.href" :class="['block py-2 px-4 rounded', { 'bg-gray-700': isActive(link.href) }]">
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="flex mx-auto">
      <nuxt-page />
    </main>
    <footer class="bg-gray-800 text-white text-center p-4">
      <p class="text-xs">&copy; copyright 2024 </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const user = useSupabaseUser();
const isMenuOpen = ref(false)
const route = useRoute()
const links = ref([]);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function isActive(path) {
  return route.path === path
}

watchEffect(() => {
  if (user.value) {
    links.value = [
      { text: 'Home', href: '/' },
      { text: 'Map', href: '/map' },
      { text: 'Profile', href: '/auth/profile' },
      { text: 'Add Item', href: '/items/create' }
    ];
  } else {
    links.value = [
      { text: 'Home', href: '/' },
      { text: 'Login', href: '/auth/login' },
      { text: 'Register', href: '/auth/register' },
    ];
  }
});
</script>

<style>
/* Add your theme styles here */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

header {
  background-color: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
}

footer {
  background-color: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
}

main {
  min-height: calc(100vh - 100px); /* Adjust this value according to your header and footer height */
}
</style>
