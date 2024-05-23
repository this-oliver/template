export function useScreen() {
	const isSmallScreen = computed<boolean>(() => window.innerWidth <= 640);
	const isMediumScreen = computed<boolean>(() => window.innerWidth <= 768);
	const isLargeScreen = computed<boolean>(() => window.innerWidth <= 1024);
	const isExtraLargeScreen = computed<boolean>(() => window.innerWidth > 1024);

	return {
		isSmallScreen,
		isMediumScreen,
		isLargeScreen,
		isExtraLargeScreen
	};
}
