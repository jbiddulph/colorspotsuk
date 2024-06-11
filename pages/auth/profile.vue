<template>
  <div class="container mx-auto">
    <h1>Profile</h1>
    <p>{{user.id}}</p>
    <p>{{user.email}}</p>
    <button type="button" @click="logout" class="bg-red-800 rounded text-white px-6 py-2">
      Logout
    </button>

    <!-- form -->

    <!-- end form -->

    <h2>Items</h2>
    <table>
      <thead>
        <th>ID</th>
        <th>Name</th>
        <th>Status</th>
        <th>Type</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border">
          <td>{{item.id}}</td>
          <td>{{item.item_name}}</td>
          <td>{{item.item_status}}</td>
          <td>{{item.item_type}}</td>
          <td>
            <button class="bg-amber-500 hover:bg-gray-400 text-gray-200 font-bold py-2 px-4 rounded inline-flex items-center mr-2">
              <span>Edit</span>
            </button>
            <button class="bg-red-600 hover:bg-gray-400 text-gray-200 font-bold py-2 px-4 rounded inline-flex items-center mr-2">
              <span>Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
const logout = async () => {
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error;
    router.push("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

// GET ALL ITEMS
const getItems = async () => {
  return await $fetch('/api/items')
}

items.value = await getItems();
console.log("items", items);
</script>

<style scoped>

</style>