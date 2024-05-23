<script setup lang="ts">

useSeoSetup({ title: 'Localize', description: 'Support for multiple languages' });

</script>

<template>
  <base-page title="Localization">
    <div class="flex flex-col justify-center pt-5 gap-5">
      <language-btn class="w-fit" />
      <base-card
        :title="$t('example.title')"
        :subtitle="$t('example.message', { name: 'Alice', projectName: 'Nuxt Template' })"
      />
    </div>
  </base-page>
</template>