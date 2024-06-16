<template>
  <div class="mb-6">
    <label :for="name" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <select :id="name" v-model="localValue" class="w-[270px] flex mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option v-for="option in options" :key="option">{{ option }}</option>
    </select>
    <small class="text-red-700 mt-2">{{ message }}</small>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  message: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const localValue = ref(props.modelValue);

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
.mb-6 {
  margin-bottom: 1.5rem;
}
.block {
  display: block;
}
.text-sm {
  font-size: 0.875rem;
}
.font-medium {
  font-weight: 500;
}
.text-gray-700 {
  color: #4a5568;
}
.mt-1 {
  margin-top: 0.25rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.border {
  border-width: 1px;
}
.border-gray-300 {
  border-color: #d2d6dc;
}
.bg-white {
  background-color: #ffffff;
}
.rounded-md {
  border-radius: 0.375rem;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\:ring-indigo-500:focus {
  ring-color: #6366f1;
}
.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}
.sm\:text-sm {
  font-size: 0.875rem;
}
.text-red-700 {
  color: #c53030;
}
</style>
