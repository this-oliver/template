<script setup lang="ts">

definePageMeta({ middleware: ['auth'] });

const router = useRouter();
</script>


<template>
  <base-page>
    <shop-form @created="router.push('/')" />
  </base-page>
</template>