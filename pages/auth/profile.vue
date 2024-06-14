<template>
  <div class="container mx-auto">
    <h1>Profile</h1>
    <p>{{user.id}}</p>
    <p>{{user.email}}</p>
    <h2>Items</h2>
      <ul class="flex flex-row w-full flex-wrap gap-0 md:gap-6 justify-evenly">
        <li v-for="item in items" :key="item.id" class="bg-white m-4 md:m-0 border border-slate-300 rounded-lg md:w-[182px] w-full p-4 flex flex-col ">
        {{item.id}}
        {{item.item_name}}
        {{item.item_status}}
        {{item.item_type}}
        <div class="flex flex-row mr-2">
          <button class="bg-amber-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2">
            <span>Edit</span>
          </button>
          <button class="bg-red-600 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2">
            <span>Delete</span>
          </button>
        </div>
        </li>
      </ul>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Items page"
})
definePageMeta({
  middleware: ["auth"]
})
const items = ref([]);
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter()

// GET ALL ITEMS
const getItems = async () => {
  return await $fetch('/api/items')
}

items.value = await getItems();
console.log("items", items);
</script>

<style scoped>

</style>