<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#348feb" height="5" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>