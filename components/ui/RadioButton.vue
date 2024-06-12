<template>
  <div class="custom-radio w-full flex-row">
    <input
      type="radio"
      :id="id"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <label class="ml-6" :for="id" :style="{ backgroundColor: modelValue === value ? selectedColor : defaultColor }">
      <span class="ml-8" v-if="value === ''">All</span>
      <span class="ml-8" v-else>{{ value }}</span>
    </label>
    
  </div>
</template>

<script setup>
// import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  selectedColor: {
    type: String,
    default: '#4caf50',
  },
  defaultColor: {
    type: String,
    default: '#ddd',
  },
  id: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.custom-radio {
  display: inline-block;
  position: relative;
}

.custom-radio input[type="radio"] {
  display: none;
}

.custom-radio label {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.custom-radio label::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: background-color 0.2s, transform 0.2s;
}

.custom-radio input[type="radio"]:checked + label::before {
  transform: translate(-50%, -50%) scale(1);
}

.custom-radio input[type="radio"]:not(:checked) + label::before {
  transform: translate(-50%, -50%) scale(0);
}
</style>
