interface StorageOptions {
  server?: boolean;
  cookie?: boolean;
}

// a robust function for inspecting if a string is a stringified object
function _isStringifiedObject (value: string): boolean {
	return (value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'));
}

export function useStorage () {
	function set (key: string, value: string | object, options?: StorageOptions): boolean {
		
		if(typeof value !== 'string'){
			value = JSON.stringify(value);
		}
    
		try {
			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				cookie.value = value;
			} else {
				localStorage.setItem(key, value);
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	function get (key: string, options?: StorageOptions): string | object | null {
		try {
			let value = null;

			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				value = cookie.value as unknown as string | null;
			} else {
				value = localStorage.getItem(key);
			}

			if(!value || value === 'undefined' || value === 'null'){
				return null;
			}

			if(_isStringifiedObject(value)){
				value = JSON.parse(value);
			}

			return value;
		} catch (error) {
			return null;
		}
	}

	function remove (key: string, options?: StorageOptions): boolean {
		try {
			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				cookie.value = null;
			} else {
				localStorage.removeItem(key);
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	return { set, get, remove };
}
