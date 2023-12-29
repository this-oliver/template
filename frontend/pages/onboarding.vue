<script setup>
import BaseBtn from '~/components/base/BaseBtn.vue';
import { useShopStore } from '~/stores/shop';

const router = useRouter();
const shopStore = useShopStore();

onMounted(() => {
	if(shopStore.shop){
		router.push('/');
	}
});

</script>

<template>
  <base-page>
    <base-btn
      id="start-btn"
      size="large"
      to="/shops/create"
    >
      Create a shop
    </base-btn>
  </base-page>
</template>

<style scoped>
#start-btn {
  top: 45%;
  left: 45%;
}
</style>