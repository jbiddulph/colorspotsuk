<!-- layouts/default.vue -->
<template>
  <div>
    <div v-if="hasLoaded">
      <Loaded />
    </div>
    <header class="bg-gray-800 text-white">
      <div class="container mx-auto flex justify-between items-center p-4 flex-col md:flex-row">
        <div class="flex flex-row justify-between w-full">
          <div class="flex items-center">
            <img src="/public/colorspots-logo.png" alt="Logo" class="w-10 h-10 mr-4" />
            <h1 class="text-xl font-bold">pinspots.co.uk</h1>
          </div>
          <button @click="toggleMenu" class="block md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <nav>
          <ul :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:flex md:items-center md:space-x-4 mt-4 md:mt-0 w-full">
            <li v-for="link in links" :key="link.text" class="flex-none mb-6 md:mb-0">
              <NuxtLink :href="link.href" :class="['block py-2 px-4 rounded', { 'bg-gray-700': isActive(link.href) }]" @click="closeMenuOnLinkClick">
                {{ link.text }}
              </NuxtLink>
            </li>
            <li v-if="user">
              <button type="button" @click="logout" class="bg-red-800 rounded text-white px-6 py-2">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="flex mx-auto bg-slate-200">
      <nuxt-page />
    </main>
    <footer class="bg-gray-800 text-white text-center p-4">
      <p class="text-xs">&copy; copyright 2024 </p>
    </footer>
  </div>
</template>

<script setup>
const appStore = useAppStore();
const { hasLoaded } = storeToRefs(appStore);

import { useRoute } from 'vue-router';
const client = useSupabaseClient();
const user = useSupabaseUser();
const isMenuOpen = ref(false);
const route = useRoute();
const links = ref([]);
const router = useRouter()
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenuOnLinkClick() {
  if (window.innerWidth < 768) {
    isMenuOpen.value = false;
  }
}
const logout = async () => {
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error;
    router.push("/auth/login");
  } catch (error) {
    console.log(error);
  }
}
function isActive(path) {
  return route.path === path;
}

watchEffect(() => {
  if (user.value) {
    links.value = [
      // { text: 'Home', href: '/' },
      { text: 'Map', href: '/map' },
      { text: 'Items', href: '/auth/profile' },
      { text: 'Add Item', href: '/items/create' },
    ];
  } else {
    links.value = [
      // { text: 'Home', href: '/' },
      { text: 'Map', href: '/map' },
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
  min-height: calc(100vh - 156px); /* Adjust this value according to your header and footer height */
}
</style>
