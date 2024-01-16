import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const useNavigationStore = defineStore('navigation', () => {
	const authStore = useAuthStore();

	const options = computed<ActionItem[]>(() => {
		const base: ActionItem[] = [
			{
				label: 'products',
				to: '/products'
			}
		];

		const publicRoutes: ActionItem[] = [
			{
				label: 'login',
				color: 'primary',
				to: '/auth/login',
			}
		];

		return authStore.isAuthenticated 
			? [...base] 
			: [...base, ...publicRoutes];
	});

	return { options };
});

const useSidebarStore = defineStore('sidebar', {
	state: () => ({ visible: false }),
	actions: {
		toggle() {
			this.visible = !this.visible;
		}
	}
});


export { useNavigationStore, useSidebarStore };