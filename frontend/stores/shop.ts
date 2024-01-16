import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useRequest } from '~/composables/useRequest';
import type { Shop, Product, Order, NewImage, CartItem } from '~/types';

/**
 * Returns a FormData object with two lists for the files `files-${index}` and
 * the meta data `files-meta-${index}` (i.e. alt text). The first list contains
 * the files and the second list contains the meta data as JSON strings.
 */
function createForm(object: Record<string, unknown>, newImages: NewImage[]): FormData {
	const formData = new FormData();

	for(const [key, value] of Object.entries(object)){
		formData.append(key, value as string);
	}

	newImages.forEach((image, index) => {
		formData.append(`files-${index}`, image.file);
		formData.append(`files-meta-${index}`, JSON.stringify({ alt: image.alt }));
	});

	return formData;
}

const useShopStore = defineStore('shop', () => {
	const { post, get, patch, remove } = useRequest();
	const authStore = useAuthStore();

	const shop = ref<Shop>();

	const getShopName = computed(() => shop.value?.name ?? '');
	const getShopDescription = computed(() => shop.value?.description ?? '');

	async function createShop(newShop: Partial<Shop>): Promise<Shop> {
		shop.value = await post('/shops', newShop, { authorization: authStore.accessToken }) as Shop;
		return shop.value;
	}

	async function indexShops(): Promise<Shop[]> {
		return await get('/shops') as Shop[];
	}

	async function updateShop(id:string, patchedShop: Partial<Shop>): Promise<Shop> {
		shop.value = await patch(`/shops/${id}`, patchedShop, { authorization: authStore.accessToken }) as Shop;
		return shop.value;
	}

	async function deleteShop(id:string): Promise<Shop> {
		return await remove(`/shops/${id}`) as Shop;
	}

	async function init(): Promise<void> {
		// return shop if it exists
		if(shop.value){
			return;
		}
    
		const shops = await indexShops();

		// return undefined if no shops exists
		if(shops.length === 0){
			throw new Error('No shops exists.');
		}
    
		// set shop and return it
		shop.value = shops[0];
	}

	init();

	return {
		shop,
		getShopName,
		getShopDescription,
		createShop,
		indexShops,
		updateShop,
		deleteShop,
		init
	};
});

const useProductStore = defineStore('product', () => {
	const { post, get, patch, remove } = useRequest();
	const authStore = useAuthStore();
	const shopStore = useShopStore();

	const currency = ref<string>('SEK');
	const products = ref<Product[]>([]);

	async function createProduct(newProduct:Partial<Product>, newImages: NewImage[]): Promise<Product> {
		if(!shopStore.shop){
			throw new Error('No shop exists to create product');
		}
    
		newProduct.shop = shopStore.shop._id;
    
		const formData = createForm(newProduct, newImages);
		const product = await post('/products', formData , { authorization: authStore.accessToken, contentType: undefined }) as Product;

		// add to products
		products.value.push(product as Product);
    
		return product;
	}

	async function getProduct(id: string): Promise<Product> {
		return await get(`/products/${id}`) as Product;
	}

	async function indexProducts(): Promise<Product[]> {
		products.value = await get('/products') as Product[];
		return products.value;
	}

	async function updateProduct(id:string, patchedProduct: Partial<Product>, newImages: NewImage[]): Promise<Product> {
		const formData = createForm(patchedProduct, newImages);
		const product = await patch(`/products/${id}`, formData, { authorization: authStore.accessToken, contentType: undefined }) as Product;
		
		// update products
		const index = products.value.findIndex((product) => product._id === id);
		products.value[index] = product;
    
		return product;
	}

	async function deleteProduct(id:string): Promise<Product> {
		const product = await remove(`/products/${id}`, { authorization: authStore.accessToken }) as Product;

		// remove from products
		const index = products.value.findIndex((product) => product._id === id);
		products.value.splice(index, 1);

		return product;
	}

	async function init(): Promise<void> {
		products.value = await indexProducts();
	}

	return {
		products,
		currency,
		createProduct,
		getProduct,
		indexProducts,
		updateProduct,
		deleteProduct,
		init
	};
});

const useOrderStore = defineStore('order', () => {
	const { post, get, patch, remove } = useRequest();
	const authStore = useAuthStore();

	const cart = ref<CartItem[]>([]);
	const orders = ref<Order[]>([]);
	const showCart = ref<boolean>(false);

	const productStore = useProductStore();

	const totalCartItems = computed<number>(() => {
		let total = 0;
		cart.value.forEach((item) => total = total + item.quantity);

		return total;
	});
  
	const totalCartCost = computed<number>(() => {
		let cost = 0;
		cart.value.forEach((item) => cost = cost + (item.quantity * item.product.price));

		return cost;
	});

	function addToCart(product: Product): void {
		// do nothing if product does not have stock
		if(product.quantity <= 0){
			return;
		}
    
		const index = cart.value.findIndex((item) => item.product._id === product._id);
    
		// if it already exists, increase quantity
		if(index >= 0){
			cart.value[index].quantity ++;
		}
		// otherwise, add to cart
		else {
			cart.value.push({ product, quantity: 1 });
		}

		// reduce quantity in product store
		const productIndex = productStore.products.findIndex((item) => item._id === product._id);
		productStore.products[productIndex].quantity --;
	}

	function removeFromCart(product: Product): void {
		const index = cart.value.findIndex((item) => item.product._id === product._id);

		// do nothing if product is not in cart
		if(index === -1){
			return;
		}

		// otherwise, reduce quantity if quantity is greater than 1 otherwise, remove entirely
		else if(cart.value[index].quantity > 1){
			cart.value[index].quantity --;
		}

		else {
			cart.value.splice(index, 1);
		}

		// reduce quantity in product store
		const productIndex = productStore.products.findIndex((item) => item._id === product._id);
		productStore.products[productIndex].quantity ++;
	}

	async function createOrder(order:Partial<Order>): Promise<Order> {
		return await post('/orders', order) as Order;
	}

	async function getOrder(id: string): Promise<Order> {
		return await get(`/orders/${id}`) as Order;
	}

	async function indexOrders(): Promise<Order[]> {
		orders.value = await get('/orders') as Order[];
		return orders.value;
	}

	async function updateOrder(id:string, patchedOrder: Partial<Order>): Promise<Order> {
		return await patch(`/orders/${id}`, patchedOrder, { authorization: authStore.accessToken }) as Order;
	}

	async function deleteOrder(id:string): Promise<Order> {
		return await remove(`/orders/${id}`) as Order;
	}

	return {
		orders,
		cart,
		showCart,
		totalCartItems,
		totalCartCost,
		addToCart,
		removeFromCart,
		createOrder,
		getOrder,
		indexOrders,
		updateOrder,
		deleteOrder
	};
});

export { useShopStore, useProductStore, useOrderStore };