interface FetchConfig extends RequestInit {
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE';
  contentType?: string | undefined; // if undefined, browser will automatically set content type
  authorization?: string;
}

export interface FetchError {
  status: number;
  statusText: string;
  message: string;
}

const DEFAULT_METHOD = 'GET';
const DEFAULT_CONTENT_TYPE = 'application/json';

/**
 * returns true if a string is a url with or without protocol
 */
function _isValidUrl (str: string): boolean {
	try {
		new URL(str);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * returns a valid url or appends base url if `url` value is an invalid http(s) protocol on it's own
 */
function _buildUrl (url: string, baseUrl: string): string {
	return _isValidUrl(url) ? url : `${baseUrl}${url}`;
}

/**
 * returns a fetch config
 */
function _buildConfig(options?: FetchConfig): RequestInit {
	const config: RequestInit = {
		method: options?.method || DEFAULT_METHOD,
		headers: { 'Content-Type': DEFAULT_CONTENT_TYPE }
	};

	if(options?.contentType){
        config.headers!['Content-Type' as keyof HeadersInit] = options.contentType;
	} else if (options?.contentType === undefined){
		delete config.headers!['Content-Type' as keyof HeadersInit];
	}

	if (options?.body) {
		config.body = options.body;
	}

	if (options?.authorization) {
    config.headers!['Authorization' as keyof HeadersInit] = `Bearer ${options.authorization}`;
	}

	return config;
}

/**
 * returns a stringyfied object. if a body is a formdata object, it will return the formdata object
 */
function _buildBody(body: object | string): string | FormData {
	if(body instanceof FormData){
		return body;
	}
  
	if(typeof body === 'string'){
		return body;
	}

	return JSON.stringify(body);
}

export function useRequest () {
	const BASE_URL = useRuntimeConfig().public.baseUrl;

	async function post (url: string, body: object | string, options?: FetchConfig) {
		url = _buildUrl(url, BASE_URL);

		return $fetch(url, {
			..._buildConfig(options),
			body: _buildBody(body),
			method: 'POST'
		});
	}

	async function get (url: string, options?: FetchConfig) {
		url = _buildUrl(url, BASE_URL);

		return $fetch(url, {
			..._buildConfig(options),
			method: 'GET'
		});
	}

	async function patch (url: string, body: object | string, options?: FetchConfig) {
		url = _buildUrl(url, BASE_URL);

		return $fetch(url, {
			..._buildConfig(options),
			body: _buildBody(body),
			method: 'PATCH'
		});
	}

	async function remove (url: string, options?: FetchConfig) {
		url = _buildUrl(url, BASE_URL);

		return $fetch(url, {
			..._buildConfig(options),
			method: 'DELETE'
		});
	}

	return { post, get, patch, remove };
}
