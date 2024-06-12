<template>
  <div class="w-full">
      <div id="layout" class="flex flex-col">
        <div class="my-4 flex flex-row">
          <div class="filter-controls flex flex-row justify-evenly w-full">
            <div class="flex flex-row w-full ml-6">
              <RadioButton
                v-for="option in filterOptions"
                :key="option.id"
                :id="option.id"
                :value="option.value"
                v-model="selectedFilter"
                :selectedColor="option.selectedColor"
                :defaultColor="option.defaultColor"
              />
            </div>
          </div>
          
        </div>
        <p v-if="selectedFilter" class="text-center mb-2">You are viewing {{ selectedFilter.toLowerCase() }} spots!</p>
        <p v-if="!selectedFilter" class="text-center mb-2">You are viewing all spots!</p>
        <div>
          <Map :height="500" :width="1280" :showSidebar="false" :data="items" :filter="selectedFilter" />
          <!-- <Map :height="460" :width="1280" :data="items.data" :filter="selectedFilter" /> -->
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import RadioButton from "../components/ui/RadioButton.vue"
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
useHead({
  title: "Map Items page"
})
definePageMeta({
  middleware: ["auth"]
})
const items = ref([]);
const filterOptions = [
  { id: 'option1', value: '', selectedColor: '#ff9900', defaultColor: '#ffc281' },
  { id: 'option2', value: 'Lost', selectedColor: '#e40000', defaultColor: '#ff8181' },
  { id: 'option3', value: 'Found', selectedColor: '#33cc33', defaultColor: '#88eb88' },
  { id: 'option4', value: 'Report', selectedColor: '#2fc5e0', defaultColor: '#87e5fc' },
];
const selectedFilter = ref('');
const getItems = async () => {
  return await $fetch('/api/items')
}

items.value = await getItems();

</script>

<style scoped>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
.filter-controls {
  margin-bottom: 10px;
}
</style>
