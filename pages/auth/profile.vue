<template>
  <div>
    <h1>Profile</h1>
    <p>{{user.id}}</p>
    <p>{{user.email}}</p>
    <button type="button" @click="logout" class="bg-red-800 rounded text-white px-6 py-2">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})
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
</script>

<style scoped>

</style>