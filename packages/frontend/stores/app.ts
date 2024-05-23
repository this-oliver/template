import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import type { ActionItem } from '~/types';

const useNavigationStore = defineStore('navigation', () => {
	const authStore = useAuthStore();

	const options = computed<ActionItem[]>(() => {
		const base: ActionItem[] = [
			{
				label: 'products',
				to: '/products'
			}
		];

		const protectedRoutes: ActionItem[] = [
			{
				label: 'orders',
				to: '/orders',
			}
		];

		return authStore.isAuthenticated 
			? [...base, ...protectedRoutes] 
			: [...base];
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