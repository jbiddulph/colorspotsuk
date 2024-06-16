<template>
  <div class="relative w-28 h-28 rounded-full overflow-hidden border border-slate-300">
    <label for="file_input" class="absolute inset-0 grid content-end cursor-pointer">
      <span class="bg-white/70 pb-2 text-center">{{ label }}</span>
    </label>
    <input type="file" @change="onFileChange" id="file_input" hidden>
    <img class="object-cover w-28 h-28" :src="preview" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, File],
    required: true
  },
  preview: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    emit('update:modelValue', input.files[0]);
  }
};
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.grid {
  display: grid;
}
.cursor-pointer {
  cursor: pointer;
}
.bg-white\/70 {
  background-color: rgba(255, 255, 255, 0.7);
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.text-center {
  text-align: center;
}
.object-cover {
  object-fit: cover;
}
</style>
