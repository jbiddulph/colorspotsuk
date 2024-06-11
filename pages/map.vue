<template>
  <div class="w-full">
      <div id="layout" class="flex flex-col">
        <div class="flex flex-row">
          <div class="filter-controls flex flex-row justify-evenly w-full">
            <div>
              <label class="md:text-2xl">
                <input type="radio" name="filter" value="" v-model="selectedFilter" />
                All
              </label>
            </div>
            <div>
              <label class="md:text-2xl">
                <input type="radio" name="filter" value="Lost" v-model="selectedFilter" />
                Lost
              </label>
            </div>
            <div>
              <label class="md:text-2xl">
                <input type="radio" name="filter" value="Found" v-model="selectedFilter" />
                Found
              </label>
            </div>
            <div>
              <label class="md:text-2xl">
                <input type="radio" name="filter" value="Report" v-model="selectedFilter" />
                Reported
              </label>
            </div>
          </div>
        </div>
        <div>
          <Map :height="500" :width="1280" :showSidebar="false" :data="items" :filter="selectedFilter" />
          <!-- <Map :height="460" :width="1280" :data="items.data" :filter="selectedFilter" /> -->
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
useHead({
  title: "Map Items page"
})
definePageMeta({
  middleware: ["auth"]
})
const items = ref([]);

const getItems = async () => {
  return await $fetch('/api/items')
}

items.value = await getItems();
console.log('Items: ', items);
const selectedFilter = ref('');
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
