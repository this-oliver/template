import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useRequest } from '~/composables/useRequest';
import type { Shop, Product, Order } from '~/types';

const useShopStore = defineStore('shop', () => {
	const { post, get, patch, remove } = useRequest();
	const authStore = useAuthStore();

	const shop = ref<Shop>();

	const getShopName = computed(() => shop.value?.name ?? '');
	const getShopDescription = computed(() => shop.value?.description ?? '');

	async function createShop(newShop: Partial<Shop>): Promise<Shop> {
		const { data, error } = await post('/shops', newShop, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || 'Failed to create shop.');
  	}

		shop.value = data.value as Shop;

		return shop.value;
	}

	async function indexShops(): Promise<Shop[]> {
		const { data, error } = await get('/shops');

		if(error.value){
  		throw new Error(error.value?.data.message || 'Failed to fetch shops.');
  	}

		if(!data.value){
			return [];
		}
		
		return data.value as Shop[];
	}

	async function updateShop(id:string, patchedShop: Partial<Shop>): Promise<Shop> {
		const { data, error } = await patch(`/shops/${id}`, patchedShop, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to update shop with id ${id}`);
  	}
    
		shop.value = data.value as Shop;

		return shop.value;
	}

	async function deleteShop(id:string): Promise<Shop> {
		const { data, error } = await remove(`/shops/${id}`);
		
		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to delete shop with id ${id}`);
  	}
    
		return data.value as Shop;
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

	const products = ref<Product[]>([]);

	async function createProduct(product:Partial<Product>): Promise<Product> {
		if(!shopStore.shop){
			throw new Error('No shop exists to create product');
		}
    
		product.shop = shopStore.shop._id;
    
		const { data, error } = await post('/products', product, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to create product`);
  	}

		// add to products
		products.value.push(data.value as Product);
    
		return data.value as Product;
	}

	async function getProduct(id: string): Promise<Product> {
		const { data, error } = await get(`/products/${id}`);

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to get product with id ${id}`);
  	}
    
		return data.value as Product;
	}

	async function indexProducts(): Promise<Product[]> {
		const { data, error } = await get('/products');
		
		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to fetch products`);
  	}
    
		products.value = data.value as Product[];
    
		return products.value;
	}

	async function updateProduct(id:string, patchedProduct: Partial<Product>): Promise<Product> {
		const { data, error } = await patch(`/products/${id}`, patchedProduct, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to update product with id ${id}`);
  	}

		// update products
		const index = products.value.findIndex((product) => product._id === id);
		products.value[index] = data.value as Product;
    
		return data.value as Product;
	}

	async function deleteProduct(id:string): Promise<Product> {
		const { data, error } = await remove(`/products/${id}`, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to delete product with id ${id}`);
  	}

		// remove from products
		const index = products.value.findIndex((product) => product._id === id);
		products.value.splice(index, 1);

		return data.value as Product;
	}

	async function init(): Promise<void> {
		products.value = await indexProducts();
	}

	return {
		products,
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

	const orders = ref<Order[]>([]);

	async function createOrder(order:Partial<Order>): Promise<Order> {
		const { data, error } = await post('/orders', order);

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to create order`);
  	}

		return data.value as Order;
	}

	async function getOrder(id: string): Promise<Order> {
		const { data, error } = await get(`/orders/${id}`);

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to get order with id ${id}`);
  	}

		return data.value as Order;
	}

	async function indexOrders(): Promise<Order[]> {
		const { data, error } = await get('/orders');

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to fetch orders`);
  	}

		orders.value = data.value as Order[];
    
		return orders.value;
	}

	async function updateOrder(id:string, patchedOrder: Partial<Order>): Promise<Order> {
		const { data, error } = await patch(`/orders/${id}`, patchedOrder, { authorization: authStore.accessToken });

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to update order with id ${id}`);
  	}

		return data.value as Order;
	}

	async function deleteOrder(id:string): Promise<Order> {
		const { data, error } = await remove(`/orders/${id}`);

		if(error.value){
  		throw new Error(error.value?.data.message || `Failed to delete order with id ${id}`);
  	}

		return data.value as Order;
	}

	return {
		orders,
		createOrder,
		getOrder,
		indexOrders,
		updateOrder,
		deleteOrder
	};
});

export { useShopStore, useProductStore, useOrderStore };