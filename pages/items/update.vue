<template>
  <div class="container mx-auto flex items-center justify-center">
    <ItemsForm :isEditMode="true" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})
</script>

<style scoped>

</style>