<script setup lang="ts">
import BaseBtn from '~/components/base/BaseBtn.vue';
import { useAuthStore } from '~/stores/auth';
import { useShopStore } from '~/stores/shop';

const router = useRouter();
const authStore = useAuthStore();
const shopStore = useShopStore();

/**
 * If no shop is available and the user is not logged in (as admin) then
 * prompt the user to sign up.
 * 
 * If the user is logged in (as admin) then redirect to the shop creation page.
 */
interface Redirect {
  path: string;
  message: string;
}
const prompt = computed<Redirect>(() => {
	if (!shopStore.shop && !authStore.user) {
		return {
			path: '/auth/register',
			message: 'Sign Up'
		};
	} else {
		return {
			path: '/shop/create',
			message: 'Create a shop'
		};
	}
});

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
      :to="prompt.path"
    >
      {{ prompt.message }}
    </base-btn>
  </base-page>
</template>

<style scoped>
#start-btn {
  top: 45%;
  left: 45%;
}
</style>