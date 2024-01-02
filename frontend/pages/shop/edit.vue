<script setup lang="ts">
import { useShopStore } from '~/stores/shop';

definePageMeta({ middleware: ['auth'] });

const router = useRouter();
const shopStore = useShopStore();
</script>


<template>
  <base-page>
    <shop-form
      :shop="shopStore.shop"
      @updated="router.push('/')"
    />
  </base-page>
</template>