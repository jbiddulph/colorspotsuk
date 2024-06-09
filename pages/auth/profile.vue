<template>
  <div class="container">
    <h1>Profile</h1>
    <p>{{user.id}}</p>
    <p>{{user.email}}</p>
    <button type="button" @click="logout" class="bg-red-800 rounded text-white px-6 py-2">
      Logout
    </button>

    <!-- form -->

    <!-- end form -->

    <h2>Users</h2>
    <table>
      <thead>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border">
          <td>{{user.id}}</td>
          <td>{{user.name}}</td>
          <td>{{user.email}}</td>
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
  title: "Users page"
})
definePageMeta({
  middleware: ["auth"]
})
const users = ref([]);
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

// GET ALL USERS
const getUsers = async () => {
  return await $fetch('/api/users')
}

users.value = await getUsers();
console.log("users", users);
</script>

<style scoped>

</style>