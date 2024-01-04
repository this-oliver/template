<script setup lang="ts">
definePageMeta({ middleware: ['auth'] });

const router = useRouter();
</script>

<template>
  <base-page>
    <product-form @created="router.push('/products')" />
  </base-page>
</template>