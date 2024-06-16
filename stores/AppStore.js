// stores/useAppStore.js
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app-store', () => {
  const hasLoaded = ref(false)

  return {
    hasLoaded
  }
});
