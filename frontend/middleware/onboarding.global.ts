import { useShopStore } from '~/stores/shop';

export default defineNuxtRouteMiddleware((to) => {
	const ONBOARDING_PAGE = '/onboarding';
	const shopStore = useShopStore();

	// do nothing if already in shop setup
	if(to.path === ONBOARDING_PAGE){
		return;
	}

	// do nothing in auth pages
	if(to.path.includes('/auth')){
		return;
	}

	// do nothing in shop onboarding
	if(to.path.includes('/shop/create')){
		return;
	}

	// redirect user if they don't have a shop yet
	if(!shopStore.shop){
		return navigateTo(ONBOARDING_PAGE);
	}
});