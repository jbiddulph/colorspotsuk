<template>
  <div class="container mx-auto">
    <h1 class="text-4xl py-10 px-4">My Items</h1>
    <!-- <p>{{user.id}}</p>
    <p>{{user.email}}</p> -->
    <!-- <h2>Items</h2> -->
    <div v-if="totalPages.value > 1" class="flex mx-auto w-100 justify-center mb-10">
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <ul class="flex flex-row w-full flex-wrap gap-0 md:gap-6 justify-evenly">
      <li v-for="item in items" :key="item.id" class="bg-white m-4 md:m-0 border border-slate-300 rounded-lg md:w-[182px] w-full p-4 flex flex-col">
        <img :src="`${config.public.supabase.url}/storage/v1/object/public/images/${item.item_pic ? item.item_pic : 'public/images/public/items/default.jpg'}`" alt="Avatar" class="m-0 pr-2 h-auto md:h-32">
        <!-- {{item.id}} -->
        {{item.item_name}}
        {{item.item_status}}
        {{item.item_type}}
        <div class="flex flex-row mr-2">
          <NuxtLink :href="`/items/update?id=${item.id}&user_id=${item.user_id}`" class="bg-amber-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2">
            <span>Edit</span>
          </NuxtLink>
          <button @click="deleteItem(item.id, item.item_pic)" class="bg-red-600 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2">
            <span>Delete</span>
          </button>
        </div>
      </li>
    </ul>
    <div v-if="totalPages.value > 1" class="flex mx-auto w-100 justify-center mt-10">
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button class="bg-green-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Items page"
})
definePageMeta({
  middleware: ["auth"]
})
const config = useRuntimeConfig();
const items = ref([]);
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(30);

const getItems = async (page = 1, limit = 30) => {
  const response = await $fetch(`/api/items/user/${user.value.id}`, {
    params: {
      page,
      limit,
    },
  });

  return response;
};

const fetchItems = async (page = 1) => {
  const { items: fetchedItems, totalItems: fetchedTotalItems, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = await getItems(page, limit.value);
  items.value = fetchedItems;
  totalItems.value = fetchedTotalItems;
  totalPages.value = fetchedTotalPages;
  currentPage.value = fetchedCurrentPage;
  console.log("items: ", items.value);
  console.log("total Items: ", totalItems.value);
  console.log("total Pages: ", totalPages.value);
  console.log("current page: ", currentPage.value);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchItems(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchItems(currentPage.value - 1);
  }
};

onMounted(() => {
  fetchItems(currentPage.value);
  console.log("userID: ", user.value.id);
});

const deleteItem = async (id: string, image: string) => {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const imagePath = `${image}`;
      console.log("ImagePath: ", imagePath);
      const { error: storageError } = await client.storage.from('images').remove([imagePath]);
      if (storageError) {
        console.error('Error removing image from storage:', storageError);
        return createError({ statusCode: 500, statusMessage: "Error deleting image from storage" });
      }
      await $fetch(`/api/items`, {
        method: 'DELETE',
        body: { id }
      });
      // Refresh the item list after deletion
      await fetchItems(currentPage.value);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
};
</script>

<style scoped>

</style>